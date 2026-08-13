// BondBridge AI Coach — Supabase Edge Function
//
// Why this exists: the Groq API key is a SECRET. If it sat in the app's
// JavaScript, anyone could open View Source on the public site, copy it, and
// burn the quota. This function keeps the key on the server. The browser calls
// this function; only this function ever sees the key.
//
// SETUP (all in the Supabase dashboard, no terminal needed):
//   1. Edge Functions → Create function → name it exactly: coach
//   2. Paste this whole file as the function body → Deploy
//   3. Edge Functions → coach → Secrets → add:
//        GROQ_API_KEY = <your gsk_... key>
//
// Never commit the key itself to GitHub.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, message: "Use POST." }, 405);
  }

  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return json({ ok: false, message: "Coach is not configured yet." }, 200);
  }

  let prompt = "";
  let context = "";
  try {
    const body = await req.json();
    prompt = String(body?.prompt ?? "").slice(0, 2000);
    context = String(body?.context ?? "").slice(0, 1000);
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  if (!prompt.trim()) {
    return json({ ok: false, message: "Ask the coach a question first." }, 200);
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(context ? [{ role: "system", content: `Context about the person they're messaging: ${context}` }] : []),
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      // Don't leak provider internals to the browser
      console.error("Groq error", response.status, detail.slice(0, 500));
      if (response.status === 429) {
        return json({ ok: false, message: "Coach is busy right now. Try again in a moment." }, 200);
      }
      return json({ ok: false, message: "Coach is unavailable right now." }, 200);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";
    if (!reply) return json({ ok: false, message: "Coach had nothing to add. Try rephrasing." }, 200);

    return json({ ok: true, reply });
  } catch (error) {
    console.error("Coach failure", error);
    return json({ ok: false, message: "Coach is unavailable right now." }, 200);
  }
});
