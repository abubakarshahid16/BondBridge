# BondBridge — Setup (do this once, ~10 minutes)

The app code is done and deployed. These are the steps only you can do,
because they need your Supabase dashboard login.

Do them in order. After step 4, real chat and video work between real users.

---

## Step 1 — Create the database tables

1. Go to **https://supabase.com/dashboard** → open your project
2. Left sidebar → **SQL Editor** → **New query**
3. Open the file `supabase-schema.sql` from this repo, copy **all** of it, paste, click **Run**

You should see "Success. No rows returned."

---

## Step 2 — Make it actually work (important)

The base schema has three problems that would leave the app broken:

- signing up doesn't create a profile, so the app has no user record
- every profile is hidden until an admin verifies it — and there is no admin,
  so the app would look permanently empty
- realtime is off, so chat wouldn't appear without refreshing

Step 2 fixes all three.

1. **SQL Editor** → **New query**
2. Copy all of `supabase-setup-step2.sql` from this repo, paste, click **Run**

You should see: *"BondBridge setup complete. Realtime chat, video and profiles are live."*

---

## Step 3 — Turn off email confirmation

Otherwise nobody can log in until they click a confirmation email, which kills
signups on day one.

1. **Authentication** → **Sign In / Providers** → **Email**
2. Turn **OFF** "Confirm email"
3. Save

You can turn this back on later once you have real users and want stricter signup.

---

## Step 4 — Add the AI Coach

Your Groq key must never go in the app's code — the site is public, so anyone
could read it and burn your quota. It goes in a server-side function instead.

1. **Edge Functions** → **Create a new function** → name it exactly **`coach`**
2. Copy all of `supabase/functions/coach/index.ts` from this repo → paste → **Deploy**
3. Open the **`coach`** function → **Secrets** (or Settings → Secrets) → add:

   | Name | Value |
   |---|---|
   | `GROQ_API_KEY` | your `gsk_...` key |

4. Save

If you skip this step, everything else still works — the Coach just falls back
to its built-in message templates instead of live AI.

---

## Step 5 — Test with a real friend

1. Open **https://abubakarshahid16.github.io/BondBridge/**
2. You sign up on your phone. Your friend signs up on theirs.
3. Go to **Discover** — you should see each other
4. Send a connection request → they accept
5. Chat — messages should appear on both phones within a second
6. Try a video call

If something doesn't work, tell me exactly which step failed and what you saw.

---

## Things worth knowing

**Your keys.** The `sb_publishable_...` key is *meant* to be public — Row Level
Security in the database is what actually protects data. The Groq key is not:
it lives only in the Edge Function secret.

**Supabase pausing.** Free projects sleep after ~7 days of no traffic. A GitHub
Action (`.github/workflows/keep-supabase-awake.yml`) pings it every 3 days so
your link never dies. It's already committed — nothing to do.

**Verification badges.** Everyone with a completed profile is discoverable.
Uploading role proof sets their status to *pending*. To approve someone, run
this in the SQL Editor:

```sql
update public.profiles set role_status = 'verified' where id = 'THE-USER-ID';
```

**Video calls.** Browser-to-browser, no server cost. Works for roughly 75-80% of
people. The rest are behind strict firewalls or corporate wifi and need a TURN
relay server — that's the one piece that isn't free at scale. Worth knowing
before you promise "video calls for everyone" on LinkedIn.

**Free tier limits.** 50,000 monthly users, 500MB database, 5GB bandwidth.
You will not hit these for a long time.

---

## Before you post on LinkedIn

Test with 3-5 real friends on real phones and different networks first. A
LinkedIn launch is one shot — if someone clicks and chat is broken, they don't
come back.
