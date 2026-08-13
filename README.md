# BondBridge Verified

A trust-first relationship app for verified students, professionals, families, friendships, and serious connections.

## Open

Open `index.html` in a browser for local UI testing. The deployed version runs on an OpenAI Sites worker with backend API routes.

Live production site: https://bondbridge-verified-20260813.tabisharshad51.chatgpt.site

GitHub source and installable Pages app:

- Source: https://github.com/abubakarshahid16/BondBridge
- GitHub Pages: https://abubakarshahid16.github.io/BondBridge/

## Deploy

This folder is connected to OpenAI Sites. `npm run build` creates `dist/server/index.js` and copies `.openai/hosting.json` so the app can be published as a production Sites worker.

`npm run build:github-pages` creates `dist/github-pages`, a static installable PWA for GitHub Pages. That static build calls the live free backend at the production site URL for API routes.

GitHub Actions deploys the installable PWA automatically from `main` to the `gh-pages` branch. Push source changes to GitHub and Pages rebuilds without paid hosting.

## Live Data Rule

BondBridge does not seed fake strangers, fake chats, fake reports, or fake family members. Discovery only shows profiles returned by Supabase after real users sign up and pass the verification rules. If the database has no approved users yet, the app shows an honest empty state.

## SaaS Backend Routes

- `GET /health`
- `GET /api/status`
- `GET /api/profiles`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/checkout`
- `POST /api/identity/session`
- `POST /api/video/room`
- `POST /api/moderate`

The Launch page in the app calls these routes and shows whether the free stack is connected.

## Included In This V1

- Instagram-style social feed with dark-first layout, white mode toggle, left rail, story circles, post cards, and gradient accents
- Fully responsive app/web layout that automatically adjusts for phone, tablet, laptop, and desktop screens
- Installable PWA for Android, iPhone home screen, and desktop browsers
- Real account page with signup/login calls and no saved passwords or displayed auth tokens
- Live verified profile sync from Supabase; no fabricated discovery users
- Mobile bottom navigation inspired by modern social apps
- Local story photo upload
- Public profile photo upload
- Verified stranger live-video lounge with start, end, next, request, screen-share, AI help, and report controls
- Chat image/file attachment controls with local image preview
- Simple guided verification flow with Profile, Proof, and Safety steps
- Proof file selection for student or professional evidence
- Feed posts for verified meeting, family reminders, and safety
- Trusted-circles rail inspired by social story discovery
- Verified meet lounge with video-style preview, start, skip, request, translate, screen-share, and report controls
- Message-request and hidden-words safety patterns
- Verified profile and proof center
- Student/professional proof workflow
- Gender/profile truth and one-account policy UI
- Global discovery by country, gender, field, and purpose
- Verified community circles
- Mutual connection requests
- Respectful chat with foul-language blocking
- AI-style message and relationship coach
- Family/friend reconnection reminders
- Consent-based call and screen-share request controls
- Simplified safety center with report cards, proof review cards, respect scores, suspend, restore, and resolve flows
- Privacy vault with local export/reset controls
- SaaS Launch Console for Supabase, free browser video, manual proof review, local coach/safety, and privacy readiness
- Production worker API for health, status, signup, free beta path checks, proof review, authenticated video room creation, and moderation
- Supabase schema with RLS policies in `supabase-schema.sql`
- Environment template in `.env.example`
- PWA manifest, service worker, app icon, and install button served by the production worker

## Production Integrations

The current production stack avoids paid APIs. Add the Supabase public runtime variables in Sites and the app can launch with:

- Supabase for auth, database, storage, and encrypted sync
- Browser-native WebRTC for camera, microphone, and screen share
- Supabase `webrtc_rooms` and `webrtc_signals` for authenticated call signaling; room creation requires a signed-in verified profile
- Supabase proof queues for student/professional verification review
- Local respectful-message drafts and foul-language moderation without a model API key

See `PRODUCTION.md` and `.env.example`.
