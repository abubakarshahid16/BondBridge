// Kinora Push Sender — Supabase Edge Function
//
// Why this exists: a message or an incoming call needs to reach a person
// even if Kinora isn't open in their browser. Postgres triggers
// (see the push-notification SQL setup) call this function the instant a
// new message or call row is written, using pg_net — which runs inside the
// database and doesn't care whether anyone's tab is open. This function then
// looks up that person's saved push subscriptions and sends a real Web Push
// notification to their device, which the browser's service worker shows
// even with Kinora fully closed.
//
// SETUP (all in the Supabase dashboard, no terminal needed):
//   1. Edge Functions → Create function → name it exactly: push-send
//   2. Paste this whole file as the function body → Deploy
//   3. Edge Functions → push-send → Settings → turn OFF "Enforce JWT
//      Verification" (the database trigger that calls this function can't
//      supply a normal user login token, so the platform-level JWT check
//      must be disabled here — this function protects itself instead, see
//      the shared-secret check below).
//   4. Edge Functions → push-send → Secrets → add:
//        PUSH_FUNCTION_SECRET = <the same random secret used in the SQL setup>
//        VAPID_PUBLIC_KEY     = <your VAPID public key>
//        VAPID_PRIVATE_KEY    = <your VAPID private key>
//
// Never commit any of those three values to GitHub.

import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-notify-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, message: "POST only." }, 405);

  const expectedSecret = Deno.env.get("PUSH_FUNCTION_SECRET") || "";
  const gotSecret = req.headers.get("x-notify-secret") || "";
  // This is the real gate, not JWT verification (which is off for this
  // function so the database trigger can call it) — without a matching
  // secret, nobody outside our own trigger can make this function fire.
  if (!expectedSecret || gotSecret !== expectedSecret) {
    return json({ ok: false, message: "Not authorized." }, 401);
  }

  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") || "";
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") || "";
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("push-send: VAPID keys not configured");
    return json({ ok: false, message: "Push isn't configured yet." }, 200);
  }
  webpush.setVapidDetails("mailto:support@kinora.app", vapidPublicKey, vapidPrivateKey);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  const userId = String(body?.user_id || "").trim();
  if (!userId) return json({ ok: false, message: "Missing user_id." }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("push-send: Supabase admin credentials not configured");
    return json({ ok: false, message: "Push admin credentials are not configured." }, 200);
  }
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: subs, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error) {
    console.error("push-send: lookup failed", error.message);
    return json({ ok: false, message: "Could not look up subscriptions." }, 200);
  }
  if (!subs || subs.length === 0) {
    return json({ ok: true, sent: 0, message: "No saved push subscriptions for this person." });
  }

  const payload = JSON.stringify({
    title: String(body?.title || "Kinora"),
    body: String(body?.body || ""),
    tag: String(body?.tag || "kinora"),
    requireInteraction: Boolean(body?.requireInteraction),
    data: body?.data || {},
  });

  let sent = 0;
  const staleIds: string[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        );
        sent += 1;
      } catch (err) {
        const statusCode = (err && typeof err === "object" && "statusCode" in err) ? (err as { statusCode?: number }).statusCode : undefined;
        // 404/410 means the browser unregistered this subscription (device
        // reset, permission revoked, etc) — clean it up so we stop retrying.
        if (statusCode === 404 || statusCode === 410) {
          staleIds.push(sub.id as string);
        } else {
          console.error("push-send: send failed", statusCode, err instanceof Error ? err.message : err);
        }
      }
    }),
  );

  if (staleIds.length) {
    await admin.from("push_subscriptions").delete().in("id", staleIds);
  }

  return json({ ok: true, sent, pruned: staleIds.length });
});

