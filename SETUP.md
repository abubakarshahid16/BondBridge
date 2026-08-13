# BondBridge — Setup

I could not do these steps for you: my sandbox is firewalled and every
Supabase host is blocked, no browser was connected, and I will not type an
API key into a form. So these are the parts that need your login.

I did cut it down to **3 steps, about 5 minutes**, and I tested the SQL
against a real PostgreSQL 16 database first so it will not fail on you.

Links below go straight to your project — just click.

---

## Step 1 — Set up the database  ⏱ 2 min

**Click:** https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/sql/new

1. Open `RUN-THIS-IN-SUPABASE.sql` from this repo
2. Select all → copy → paste into that page
3. Press **Run** (or Ctrl+Enter)

Expect: *"BondBridge is ready. Chat, video, profiles and realtime are live."*

Ignore any yellow `NOTICE ... does not exist, skipping` lines — those are
normal and harmless.

> Use **only** this file. It replaces both `supabase-schema.sql` and
> `supabase-setup-step2.sql`. Running it twice is safe.

**What I verified before giving it to you**, on a real Postgres 16 instance:
- runs clean on an empty database
- running it a second time changes nothing and throws no errors
- signing up automatically creates a profile — including with missing or
  junk data (age `7` becomes 18, role `Wizard` becomes Student, blank name
  becomes "BondBridge member") instead of crashing
- a stranger cannot read your private messages, and cannot inject a message
  into someone else's conversation — the database rejects it
- logged-out visitors *can* see profiles, which is what fixes the
  "app looks completely empty" bug

---

## Step 2 — Turn off email confirmation  ⏱ 1 min

Otherwise nobody can log in until they click a confirmation email, and most
people never will.

**Click:** https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/auth/providers

1. Expand **Email**
2. Turn **OFF** "Confirm email"
3. **Save**

---

## Step 3 — AI Coach  ⏱ 2 min  *(optional)*

Skip this and everything else still works — the Coach just uses its built-in
templates instead of live AI.

**Click:** https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/functions

1. **Create a new function**, name it exactly `coach`
2. Paste all of `supabase/functions/coach/index.ts` from this repo → **Deploy**
3. Open `coach` → **Secrets** → add name `GROQ_API_KEY`, value = your `gsk_...` key

**You have to paste the key yourself.** I don't enter API keys into forms —
if I'm ever wrong about which field I'm filling, your key leaks. Not a risk
worth taking to save you one paste.

---

## Then test it properly

1. Open **https://abubakarshahid16.github.io/BondBridge/** on your phone
2. Have a friend open it on theirs — different phone, ideally different network
3. Both sign up
4. **Discover** → you should see each other
5. Send a request → they accept
6. Chat — messages should land within about a second
7. Try a video call

If a step fails, tell me which one and what you saw on screen.

---

## One more thing I couldn't push

The GitHub token you gave me lacks `workflow` scope, so I couldn't commit
`.github/workflows/keep-supabase-awake.yml`. It's in the repo as
**`keep-supabase-awake.workflow.txt`**.

Add it via GitHub → **Actions** → **New workflow** → **set up a workflow
yourself** → paste → commit.

Without it, Supabase free projects sleep after ~7 idle days and your link
goes dead — which is exactly when a LinkedIn visitor might click it.

---

## Worth knowing before you launch

**Your keys.** The `sb_publishable_...` key is *meant* to be public — Row
Level Security is what actually protects the data, and I tested that it does.
The Groq key is different and stays in the Edge Function secret only.

**Approving a verification badge.** Everyone with a complete profile is
discoverable. Uploading role proof sets them to *pending*. To approve:

```sql
update public.profiles set role_status = 'verified' where id = 'THE-USER-ID';
```

**Video calls** work browser-to-browser for roughly 75-80% of people. The rest
sit behind strict firewalls or corporate wifi and need a TURN relay server —
the one piece that isn't free at scale. Don't promise "video for everyone."

**Free tier:** 50,000 monthly users, 500MB database, 5GB bandwidth. You are
nowhere near this.

**Before LinkedIn:** test with 3-5 real friends first. A launch post is one
shot — if someone clicks and chat is broken, they don't come back.
