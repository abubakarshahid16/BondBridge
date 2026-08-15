// BondBridge AI Coach — Supabase Edge Function
//
// Why this exists: the Groq API key is a SECRET. If it sat in the app's
// JavaScript, anyone could open View Source on the public site, copy it, and
// burn the quota. This function keeps the key on the server. The browser calls
// this function; only this function ever sees the key.
//
// This function does two things, chosen by `type` in the request body:
//   - type: "coach" (default)       → writes respectful message suggestions
//   - type: "verify-proof"          → looks at an uploaded proof photo and
//                                      gives a first-pass opinion on whether
//                                      it plausibly looks like the kind of
//                                      document claimed (student ID, work
//                                      email screenshot, etc). This is a
//                                      SANITY CHECK, not a final decision —
//                                      a human still reviews every submission.
//                                      If the AI check fails or is unsure, we
//                                      fail OPEN (don't block a real person's
//                                      real document over an AI hiccup).
//
// SETUP (all in the Supabase dashboard, no terminal needed):
//   1. Edge Functions → Create function → name it exactly: coach
//   2. Paste this whole file as the function body → Deploy
//   3. Edge Functions → coach → Secrets → add:
//        GROQ_API_KEY = <your gsk_... key>
//
// Never commit the key itself to GitHub.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const TEXT_MODEL = "llama-3.3-70b-versatile";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are BondBridge Coach, helping people write warm, respectful,
honest messages to new connections — study partners, friends, professional contacts,
or family they've lost touch with.

Rules:
- Keep replies short and practical. Give the actual message text they can send.
- Be warm and natural, never robotic, flowery, or salesy.
- Never write anything flirtatious, sexual, manipulative, or pressuring.
- Never suggest lying or exaggerating about themselves.
- If asked for something disrespectful, redirect kindly toward a respectful version.
- Respect that users are students and professionals from many cultures. Stay inclusive.
- Prefer 2-3 short options over one long block when suggesting messages.`;

const REWRITE_SYSTEM_PROMPT = `You lightly polish a chat message someone is about to send to a new
connection on a respectful dating/networking app, right before they hit send.

Critical rules:
- Keep the SAME language the person wrote in. If they wrote in Urdu, Roman Urdu (Urdu written in
  English letters, e.g. "kesa ho", "thik hoon"), Hindi, or any mix of languages, your rewrite must
  stay in that same language/mix. NEVER translate it into English. NEVER translate English into
  another language either — just keep whatever language(s) they used.
- Keep their original meaning, tone, and length as closely as possible. A short casual reply like
  "kesa ho" (how are you) or "hey, good to meet you" is ALREADY respectful and friendly — for
  messages like that, make only tiny fixes (spelling, obvious typos) or return it completely
  unchanged. Do not add greetings, sign-offs, or filler sentences that were not implied by the
  original message.
- Only meaningfully rewrite the message if it actually contains something disrespectful,
  aggressive, sexual, or pressuring — in that case, rephrase just that part into something
  considerate while preserving everything else the person said.
- Never add generic stock phrases like "I wanted to say this respectfully" or "I would appreciate
  your thoughts whenever you are comfortable" unless the original message is genuinely harsh and
  needs that kind of softening — most everyday messages don't need it at all.
- Reply with ONLY the final message text the person should send. No quotes, no explanation, no
  preamble.`;

const PROOF_SYSTEM_PROMPT = `You are a fast first-pass reviewer for a verification queue. You are
shown one photo someone submitted as proof of being a student or professional, along with what
type of document they claim it is. Your only job: does this photo plausibly look like that kind
of real document (a student ID card, a transcript, an enrollment letter, a screenshot of a
university/work email inbox or profile, a LinkedIn profile page, an employment letter) — as
opposed to something unrelated (a random selfie, a meme, a blank/black image, a screenshot of
something else entirely, an obvious drawing or AI-generated fake)?

You are a quick sanity filter, not the final decision — a human reviews every submission
afterward regardless of your answer. When genuinely unsure, lean toward plausible: true.

Reply with ONLY compact JSON, no other text: {"plausible": true or false, "reason": "one short sentence"}`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callGroq(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Groq error", response.status, detail.slice(0, 500));
    throw new Error(`groq_${response.status}`);
  }
  return response.json();
}

async function handleCoach(apiKey: string, body: Record<string, unknown>) {
  const prompt = String(body?.prompt ?? "").slice(0, 2000);
  const context = String(body?.context ?? "").slice(0, 1000);

  if (!prompt.trim()) {
    return json({ ok: false, message: "Ask the coach a question first." }, 200);
  }

  try {
    const data = await callGroq(apiKey, {
      model: TEXT_MODEL,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(context ? [{ role: "system", content: `Context about the person they're messaging: ${context}` }] : []),
        { role: "user", content: prompt },
      ],
    });
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";
    if (!reply) return json({ ok: false, message: "Coach had nothing to add. Try rephrasing." }, 200);
    return json({ ok: true, reply });
  } catch (error) {
    console.error("Coach failure", error);
    if (String(error).includes("429")) {
      return json({ ok: false, message: "Coach is busy right now. Try again in a moment." }, 200);
    }
    return json({ ok: false, message: "Coach is unavailable right now." }, 200);
  }
}

async function handleRewriteMessage(apiKey: string, body: Record<string, unknown>) {
  const text = String(body?.text ?? "").slice(0, 2000);
  const peerContext = String(body?.peer_context ?? "").slice(0, 300);
  if (!text.trim()) {
    return json({ ok: false, message: "Type a message first, then tap Improve." }, 200);
  }
  try {
    const data = await callGroq(apiKey, {
      model: TEXT_MODEL,
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: REWRITE_SYSTEM_PROMPT },
        ...(peerContext ? [{ role: "system", content: `Who they're messaging: ${peerContext}` }] : []),
        { role: "user", content: text },
      ],
    });
    const reply = data?.choices?.[0]?.message?.content?.trim().replace(/^["“]|["”]$/g, "") || "";
    if (!reply) return json({ ok: false, message: "Could not improve that message. Try again." }, 200);
    return json({ ok: true, reply });
  } catch (error) {
    console.error("Rewrite failure", error);
    return json({ ok: false, message: "Message improver is unavailable right now." }, 200);
  }
}

async function handleVerifyProof(apiKey: string, body: Record<string, unknown>) {
  const imageUrl = String(body?.image_url ?? "").trim();
  const documentType = String(body?.document_type ?? "document").slice(0, 60);
  // Fail open: if there's nothing to look at, don't block the submission —
  // just skip the AI check and let human review handle it.
  if (!imageUrl) return json({ ok: true, plausible: true, reason: "Nothing to preview — sent for human review." });

  try {
    const data = await callGroq(apiKey, {
      model: VISION_MODEL,
      temperature: 0.2,
      max_tokens: 150,
      messages: [
        { role: "system", content: PROOF_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `Claimed document type: ${documentType}` },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });
    const raw = data?.choices?.[0]?.message?.content?.trim() || "";
    const cleaned = raw.replace(/```json|```/gi, "").trim();
    let parsed: { plausible?: boolean; reason?: string } = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Model didn't return clean JSON — fail open rather than block a real document.
      return json({ ok: true, plausible: true, reason: "AI check inconclusive — sent for human review." });
    }
    return json({
      ok: true,
      plausible: parsed.plausible !== false,
      reason: parsed.reason || "",
    });
  } catch (error) {
    console.error("Proof check failure", error);
    // Fail open — never let an AI hiccup block a genuine submission.
    return json({ ok: true, plausible: true, reason: "AI check unavailable — sent for human review." });
  }
}

// Hands out short-lived TURN credentials for video calls, so the TURN
// provider's API key never has to be shipped in client-side code (the same
// reasoning as GROQ_API_KEY above). Returns an empty list — not an error —
// when no key is configured yet, so the app quietly falls back to
// STUN-only rather than breaking calls.
//
// SETUP (optional — calls already work without this, just less reliably
// across some mobile networks): sign up free at metered.ca (no credit
// card, 500MB/month free), find your "app name" under the TURN Server
// product, then add TWO secrets in Edge Functions → coach → Secrets:
//   METERED_API_KEY  = your API key
//   METERED_APP_NAME = the app name shown in your Metered dashboard
async function handleTurnCredentials() {
  const apiKey = Deno.env.get("METERED_API_KEY");
  const appName = Deno.env.get("METERED_APP_NAME");
  if (!apiKey || !appName) return json({ ok: true, iceServers: [] });
  try {
    const response = await fetch(
      `https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${encodeURIComponent(apiKey)}`,
    );
    if (!response.ok) return json({ ok: true, iceServers: [] });
    const iceServers = await response.json();
    if (!Array.isArray(iceServers)) return json({ ok: true, iceServers: [] });
    return json({ ok: true, iceServers });
  } catch (error) {
    console.error("TURN credentials failure", error);
    return json({ ok: true, iceServers: [] });
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, message: "Use POST." }, 405);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  if (body?.type === "turn-credentials") {
    return handleTurnCredentials();
  }

  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return json({ ok: false, message: "Coach is not configured yet." }, 200);
  }

  if (body?.type === "verify-proof") {
    return handleVerifyProof(apiKey, body);
  }
  if (body?.type === "rewrite-message") {
    return handleRewriteMessage(apiKey, body);
  }
  return handleCoach(apiKey, body);
});
