# GitHub Workflow

## Branches

- `main` is the protected release branch and should stay deployable.
- `feature/<short-name>` is for product work.
- `fix/<short-name>` is for defects and regressions.
- `chore/<short-name>` is for maintenance, documentation, and tooling.
- `release/<version>` is optional when a coordinated release needs a stabilization window.

Keep branches short-lived, rebase or merge the latest `main` before review, and delete merged branches. Avoid committing directly to `main`.

## Pull requests

Every change goes through a pull request with one clear purpose. Keep the PR small enough to review, link the relevant issue or milestone, include validation evidence, and call out database, security, privacy, or deployment impact. User-facing changes should include truthful screenshots or a short recording.

Recommended repository settings for maintainers:

- Require pull requests before merging to `main`.
- Require the Kinora checks workflow to pass.
- Require one approving review and dismiss stale approvals after new commits.
- Require branches to be up to date before merging.
- Block force pushes and branch deletion on `main`.
- Enable automatic deletion of merged head branches.

## Milestones

Use milestones for outcomes, not individual commits:

1. `Kinora launch readiness`: rebrand, compatibility, security migration, accessibility, PWA, and documentation.
2. `Kinora production hardening`: observability, backup/restore rehearsal, rate limits, and device-matrix verification.
3. `Kinora public beta`: onboarding, moderation operations, support process, and measured rollout.

Close an issue only when the change is merged, validated, and documented. Reopen it when production verification fails.

## Commit and release style

Use imperative, scoped commit subjects such as `fix(auth): preserve legacy sessions during rebrand`. Keep secrets and real user data out of commits. Tag public releases with semantic versions, for example `v1.0.0`, and publish release notes containing user impact, migration steps, and known limitations.


