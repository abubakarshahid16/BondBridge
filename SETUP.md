# BondBridge — Setup status

I did the setup through your browser. Here's what's done and the one thing left.

---

## ✅ Done — database

Ran against your project and **verified afterwards by querying the database**,
not just trusting the success message:

| Check | Result |
|---|---|
| Tables created | 8 |
| Security (RLS) policies | 21 |
| Signup trigger active | yes |
| Realtime-enabled tables | 4 |
| Storage buckets | 3 |
| Profile visibility fix applied | yes |

Before running it on your live project I tested the same file on a local
PostgreSQL 16 database:

- runs clean on an empty database, and re-running changes nothing
- signup auto-creates a profile even from junk data (age `7` → 18,
  role `Wizard` → Student, blank name → a default) instead of crashing
- a stranger reads **0** of your private messages and is **blocked** from
  inserting into a conversation they're not part of
- logged-out visitors **can** see profiles — this is the fix for the
  "app looks completely empty" bug

Supabase warned the query was "destructive". It wasn't: the file contains no
`drop table`, `delete`, or `truncate` — only `drop policy` / `drop trigger`
lines that the same script immediately recreates. Your database was empty
anyway.

## ✅ Done — email confirmation turned off

"Confirm email" is now **off** and saved. People can sign up and use the app
immediately instead of waiting for a confirmation email.

## ✅ Done — AI Coach function deployed

Live at `https://fpbodwjgypxzqpstwcvo.supabase.co/functions/v1/coach`

I also caught and fixed a bug while doing this: the function has "Verify JWT"
switched on, and your new-style `sb_publishable_` key is **not** a JWT — so
every Coach call would have failed with a 401. The app now sends the
signed-in user's session token instead. Fixed, pushed, and deployed.

---

## ⚠️ One thing left — you have to do this part

**Add your Groq key as a secret.** The page is already open in your browser:

https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/functions/secrets

- **Name:** `GROQ_API_KEY`
- **Value:** your `gsk_...` key
- Click **Save**

**Why I didn't do it:** I don't type API keys into forms. That isn't me being
overly cautious — while setting this up, a clipboard copy silently failed and
your Groq key got pasted into the function editor instead of the code. I
caught it before deploying and wiped it, but that is exactly the failure mode
that makes me refuse to handle keys. One wrong field and your key is public.

Until you add it, everything else works — the Coach just uses its built-in
message templates instead of live AI.

### About that near-miss

Your Groq key was sitting in your clipboard, which means it may still be. It
was never deployed, never committed, and never left your own browser. But
since it has been pasted around, **consider rotating it** at
console.groq.com — generate a new key, add the new one as the secret, delete
the old one. Takes a minute and removes all doubt.

---

## Also still needed: keep-alive workflow

The GitHub token you gave me lacks `workflow` scope, so I couldn't commit
`.github/workflows/keep-supabase-awake.yml`. It's in the repo as
**`keep-supabase-awake.workflow.txt`**.

GitHub → **Actions** → **New workflow** → **set up a workflow yourself** →
paste it → commit.

Without it, Supabase free projects sleep after ~7 idle days — and a dead link
is exactly what a LinkedIn visitor would find weeks after your post.

---

## Now test it properly

1. Open **https://abubakarshahid16.github.io/BondBridge/** on your phone
2. A friend opens it on theirs — different phone, ideally different network
3. Both sign up
4. **Discover** → you should see each other
5. Send a request → they accept
6. Chat — messages should land in about a second
7. Try a video call

I could not test signup myself, because creating accounts and entering
passwords is something I don't do on your behalf. So this step is genuinely
untested until you run it — tell me exactly which step fails and what you saw.

---

## Before you post on LinkedIn

**Approving a verification badge.** Everyone with a complete profile is
discoverable. Uploading role proof sets them to *pending*. To approve:

```sql
update public.profiles set role_status = 'verified' where id = 'THE-USER-ID';
```

**Video calls** work browser-to-browser for roughly 75-80% of people. The rest
are behind strict firewalls or corporate wifi and need a TURN relay server —
the one piece that isn't free at scale. Don't promise "video for everyone."

**Free tier:** 50,000 monthly users, 500MB database, 5GB bandwidth. You are
nowhere near this.

**Test with 3-5 real friends first.** A launch post is one shot — if someone
clicks and chat is broken, they don't come back.
