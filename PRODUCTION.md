# Kinora Production Setup

Kinora runs as an installable PWA backed by Supabase. GitHub Pages is the public deployment path.

## Current Production State

- Supabase project: `fpbodwjgypxzqpstwcvo`
- Supabase status checked during this overhaul: active and healthy
- GitHub Pages branch: `gh-pages`
- Expected GitHub Pages app URL: `https://abubakarshahid16.github.io/Kindred/`

## Required Services

- Supabase Auth, Postgres, Realtime, and Storage.
- Browser-native WebRTC for camera, microphone, and screen share.
- Supabase Edge Function `coach` for optional AI coach, proof sanity checks, and TURN credentials.
- Supabase Edge Function `push-send` for Web Push notifications.

Core usage does not require paid APIs. Groq and TURN provider keys are optional enhancements.

## Environment Variables

Preferred browser globals:

- `KINORA_SUPABASE_URL`
- `KINORA_SUPABASE_KEY`
- `KINORA_AI_URL`
- `KINORA_TURN_URL`
- `KINORA_VAPID_PUBLIC_KEY`

Push Edge Function secrets:

- `PUSH_FUNCTION_SECRET`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional coach/TURN secrets:

- `GROQ_API_KEY`
- `METERED_API_KEY`
- `METERED_APP_NAME`

## Database

For a fresh project, run `RUN-THIS-IN-SUPABASE.sql`, then `RUN-THIS-FOR-PUSH-NOTIFICATIONS.sql`.

For the existing production project, review and apply:

```sql
supabase/migrations/202608210001_kinora_security_compatibility.sql
```

This migration keeps production bucket IDs stable:

- `bondbridge-avatars`
- `bondbridge-proofs`
- `bondbridge-chat`

Do not rename these buckets until all existing object paths and deployed clients have been migrated.

## Verification After Deploy

1. Run `npm run check`.
2. Run `npm run build`.
3. Run `npm run build:github-pages`.
4. Serve `dist/github-pages` and verify the PWA manifest, install button, service worker, and screenshots.
5. Run Supabase security and performance advisors after applying the migration.
6. Test two real accounts on two devices:
   - signup/login
   - profile save
   - proof upload
   - discovery
   - connection request/accept
   - chat message
   - attachment upload
   - push subscription
   - voice call
   - video call

## Public API Routes In The Sites Worker

- `GET /health`
- `GET /api/status`
- `GET /api/profiles`
- `GET /api/me`
- `POST /api/profiles/me`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/storage/upload`
- `POST /api/proof`
- `GET /api/connections`
- `POST /api/connections/request`
- `POST /api/connections/respond`
- `GET /api/messages`
- `POST /api/messages`
- `GET /api/family-reminders`
- `POST /api/family-reminders`
- `POST /api/family-reminders/contacted`
- `GET /api/reports`
- `POST /api/reports`
- `POST /api/checkout`
- `POST /api/identity/session`
- `POST /api/video/room`
- `POST /api/moderate`
- `GET /manifest`
- `GET /service-worker`
- `GET /app-icon`

## Operational Notes

- Verification approval, report resolution, suspension, and restore actions should stay in a protected operator workflow or Supabase admin console.
- The public app must not expose self-approval controls.
- Keep leaked-password protection enabled in Supabase Auth before public promotion.
- TURN relay is recommended before promising reliable calls across strict mobile networks, corporate Wi-Fi, or carrier-grade NAT.

