# BondBridge Production Setup

The app is deployed on OpenAI Sites and now uses a free launch stack. The only required runtime configuration is Supabase public project config.

## Required Services

- Supabase free Auth and Postgres for accounts, profiles, connections, messages, family reminders, reports, proof queues, and WebRTC signaling.
- Browser-native WebRTC for camera, microphone, and screen share.
- Local safety and coach logic for foul-language blocking, respectful rewrites, and message drafts.

Video rooms are not simulated. `POST /api/video/room` requires a Supabase access token and inserts a real `webrtc_rooms` row. RLS only permits users with approved profile truth to host or join live rooms.

## Database

1. Create or use the connected Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Create private storage buckets for `profile-photos`, `proof-documents`, and `chat-attachments`.
4. Configure email/password auth and production SMTP before a public launch.

## Sites Environment Variables

Use `.env.example` as the exact key list. No paid provider keys are needed.

Minimum launch keys:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

## Server Routes

- `GET /api/status`
- `GET /api/profiles`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/checkout`
- `POST /api/identity/session`
- `POST /api/video/room`
- `POST /api/moderate`
- `GET /health`
- `GET /manifest`
- `GET /service-worker`
- `GET /app-icon`

## Launch Gate

The Launch page shows the free stack readiness. It should report connected when Supabase public config is present, and it should never ask for paid model, checkout, identity, or video API keys.

## Installable App

The deployed site is an installable PWA. Users can install it from the in-app Install button when the browser supports native prompts, or from the browser menu on iPhone and desktop browsers.

## Data Integrity

The app now starts with no fake users, chats, reports, communities, or family reminders. Real users must create an account, add their own profile details, submit proof, and become approved in Supabase before they appear in discovery.
