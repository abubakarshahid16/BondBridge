# Kinora Rebrand Migration

This migration path preserves production data while presenting the product as Kinora.

## What Changes

- User-facing product name: Kinora.
- PWA app name: Kinora Verified.
- Browser title, install metadata, notifications, README, docs, package metadata, and workflow names.
- Supabase storage policy labels can be recreated with Kinora names.
- Public execution is revoked from trigger-only `SECURITY DEFINER` functions.
- Missing foreign-key indexes are added.

## What Does Not Change

- Supabase project ref: `fpbodwjgypxzqpstwcvo`.
- Storage bucket IDs: `bondbridge-avatars`, `bondbridge-proofs`, `bondbridge-chat`.
- Existing uploaded object paths.
- Existing auth users and table names.

## Apply After Review

Run:

```sql
-- supabase/migrations/202608210001_kinora_security_compatibility.sql
```

Use the Supabase SQL editor or your normal migration tool. The local Supabase CLI was not available in this workspace, so this migration file was created directly in the repository and should be applied through the reviewed production flow.

## Post-Migration Checks

1. Run Supabase security advisors.
2. Run Supabase performance advisors.
3. Confirm the public executable function warnings are gone for:
   - `public.handle_new_user()`
   - `public.notify_new_message()`
   - `public.notify_incoming_call()`
4. Confirm missing foreign-key index warnings are gone for:
   - `verification_documents.user_id`
   - `messages.sender_id`
   - `family_reminders.user_id`
   - `reports.reporter_id`
   - `reports.reported_user_id`
   - `reports.connection_id`
   - `webrtc_signals.sender_id`
   - `webrtc_signals.recipient_id`
5. Sign in with an existing account and confirm the session migrates from `bondbridge-auth` to `kinora-auth`.
6. Upload an avatar, proof file, and chat attachment to confirm the legacy buckets still work.

