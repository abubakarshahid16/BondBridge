# Kinora Architecture

Kinora is a static-first PWA with Supabase as the live backend. GitHub Pages is the public deployment target.

## Runtime Surfaces

- `index.html` defines public runtime globals and loads the app.
- `config.js` centralizes the Kinora brand, runtime key aliases, browser storage migration, and stable Supabase bucket names.
- `app.js` owns rendering, client-side routing, local state, Supabase calls, realtime subscriptions, WebRTC signaling, install prompts, notifications, and offline fallbacks.
- `styles.css` owns the responsive app shell, mobile bottom navigation, call UI, auth flow, dashboard, discovery, chat, verification, family, safety, and settings surfaces.

## Deployments

- GitHub Pages: `npm run build:github-pages` writes `dist/github-pages`.
- GitHub Actions: `.github/workflows/deploy-pages.yml` rebuilds and publishes the static PWA to `gh-pages`.

## Data Model

Supabase tables:

- `profiles`
- `verification_documents`
- `connections`
- `messages`
- `family_reminders`
- `reports`
- `subscriptions`
- `webrtc_rooms`
- `webrtc_signals`
- `push_subscriptions`

Supabase Storage buckets:

- `bondbridge-avatars`
- `bondbridge-proofs`
- `bondbridge-chat`

The bucket IDs are legacy production identifiers. They are intentionally not renamed during the Kinora rebrand because existing object paths, public URLs, signed URLs, and deployed clients depend on them.

## Security Model

- Public clients use Supabase publishable keys only.
- RLS is enabled on every public table.
- Profile discovery is constrained by profile status and suspension checks.
- Chat requires an accepted connection.
- Message attachments are private except for the sender and accepted connection participants.
- Proof files are private to the uploading user and review workflow.
- Public self-approval is not exposed; verification and moderation actions remain admin/operator concerns.
- Trigger-only `SECURITY DEFINER` functions have direct execution revoked in the migration.

## Compatibility Shims

- `kinora-verified-live-v1` is the new local app state key.
- Existing `bondbridge-verified-*` state is migrated forward at boot.
- `kinora-auth` is the new Supabase auth storage key.
- Existing `bondbridge-auth` sessions are copied forward before Supabase initializes.
- `KINORA_*` browser globals are preferred.
- `BONDBRIDGE_*` globals remain supported for existing deployments.
- Realtime channel names keep the old `bondbridge-*` values during rollout.

## Edge Functions

- `supabase/functions/coach` stores the optional AI provider key server-side and handles coach, rewrite, proof sanity check, and optional TURN credential requests.
- `supabase/functions/push-send` sends Web Push notifications from database triggers. It requires `PUSH_FUNCTION_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Testing Strategy

- Syntax checks: `npm run check`.
- GitHub Pages PWA build: `npm run build:github-pages`.
- Visual verification: run the static build locally and capture real screenshots from the actual app.
- Production verification: after migration, rerun Supabase security and performance advisors.

