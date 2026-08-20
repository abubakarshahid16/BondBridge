# Kinora Setup Status

This repo is configured for a free launch stack: Supabase, browser WebRTC, Web Push, and GitHub Pages.

## Already Connected

- Supabase project `fpbodwjgypxzqpstwcvo`
- Auth, profiles, connections, messages, family reminders, reports, WebRTC signaling, storage buckets, and push subscription schema
- Supabase Edge Function `coach`
- Supabase Edge Function `push-send`
- GitHub Pages deploy workflow from `main` to `gh-pages`

## Current URLs

- GitHub Pages PWA: `https://abubakarshahid16.github.io/Kindred/`

## Local Checks

```bash
npm run check
npm run build
npm run build:github-pages
```

## Production Follow-Up

1. Review and merge the Kinora branch.
2. Apply `supabase/migrations/202608210001_kinora_security_compatibility.sql`.
3. Enable Supabase leaked-password protection before public promotion.
4. Re-run Supabase advisors.
5. Test with two real users on separate devices and networks.
6. Confirm the GitHub Pages URL is the only public product link.

## Manual Secrets

Do not commit secrets. Add them only through Supabase or Sites secret management:

- `GROQ_API_KEY` for live AI coach/rewrite/proof sanity checks
- `METERED_API_KEY` and `METERED_APP_NAME` for more reliable TURN relay
- `PUSH_FUNCTION_SECRET`, `VAPID_PUBLIC_KEY`, and `VAPID_PRIVATE_KEY` for background push

## Real-World Test Script

1. Open the GitHub Pages PWA on two phones.
2. Create two accounts.
3. Complete profile details.
4. Approve verification in the protected Supabase/admin workflow.
5. Use Discover to find each other.
6. Send and accept a connection request.
7. Send a chat message and an attachment.
8. Try voice and video calls.
9. Close one browser and confirm push notifications arrive.

Video calls work best with TURN configured. Without TURN, some mobile and strict Wi-Fi networks may fail because STUN-only WebRTC cannot always cross carrier-grade NAT or firewalls.

