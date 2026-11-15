# Notes hosted CI and isolated preview

## Scope and approval

2026-11-16: the user approved implementation, PR validation, merge and one
manual production deployment. This does not enable automatic CD, change
branch protection, install a local Docker engine, register a self-hosted
runner or reuse Mail infrastructure. Notes owns all files in this change.
The dirty editorial workspace is preserved separately from the CI worktree.

## Execution contract

Workflow: `.github/workflows/notes-ci.yml`, push to main and PR to main.
Each Linux matrix job uses a separate checkout and Docker build. A portable
security test may render temporary output, but each job then generates and
verifies its own final release. No final output is shared between renderers.

1. `npm ci` and `ci:source`: require tracked public input, explicit published
   status, unique safe slugs and a clean hosted checkout; record input hashes.
2. Docker `verify` stage: check input hashes and private-context exclusion,
   Astro diagnostics, portable content/publisher security, guide steps,
   image/relief comparison, languages, actual selected renderer, existing
   `verify:build`, output allowlist and per-file SHA-256 manifest.
3. Docker `preview` stage: copy only verified static output, manifest and the
   small static HTTP server. Run as node, read-only, no capabilities, no
   privilege escalation, 1 CPU/256 MiB/64 PIDs, loopback-bound port 8798.
   CI uses the same Compose entry point as the README to build/start/stop it,
   then confirms no project containers remain. It does not substitute a
   separate CI-only runtime definition for the operator's preview command.
4. Read back every served file hash. Chromium opens the actual preview and
   clicks index → Korean/English guides, language switch, category, tag,
   related post and TOC; exercises both comparison controls. Verify images,
   overflow and text bounds at 1440 and 390 pixels and save screenshots.
5. Windows hosted job runs the full existing PowerShell deployment guards:
   no approval, failed build and failed verification stop before AWS. Command
   traps are used only for these safety-control tests, not the render/UI flow.

`test:security:portable` explicitly excludes Windows deployment checks; the
separate Windows job is mandatory for the full CI verdict. Optionless
`publish:posts` is local generation. Production `--dry-run` and `--upload`
are not CI commands. The invalid-target security regression rejects its
negative dry-run case before any AWS call.

## Versions and permissions

- Node 24.22.1; official `bookworm-slim` multi-platform digest pinned in Dockerfile.
- Playwright 1.65.1 and its Chromium are locked together. One browser at a time,
  five-minute browser budget, 20-minute Linux job and 10-minute Windows job.
- Official actions/checkout v7.0.1, setup-node v7.1.0 and upload-artifact v7.0.2
  full commit SHAs were resolved from official GitHub release/tag APIs on
  2026-11-16. Review versions and verify pins before updates.
- `GITHUB_TOKEN`: contents read only; checkout does not persist credentials.
  No secrets, personal PAT, AWS keys, private sibling checkout or
  `pull_request_target`; no dependency cache in this first version.
- Responsible Git/gh authentication remains repository-selected
  `codex-yioo-notes`. Workflow publication additionally needs Workflows write.
  Read-only public API access does not prove token write grants. Never change
  global gh login, other profiles or shared authentication helpers.

## Privacy and reports

`.dockerignore` starts from deny-all, allowing build inputs and the generated
source manifest. Drafts, private fixtures, local workspaces, `.git`, `.env`,
node_modules and personal documents are excluded. Existing tracked private
test fixtures are preserved in source and never shipped to the image.

The baseline public assets are already approximately 104 MiB. To avoid
duplicating these on every CI run, artifacts contain only release manifests,
Docker identity/limits, browser results and allowlisted public screenshots.
No checkout, source ledger, input manifest, environment dump or raw log is
uploaded. Reports are capped at 20 MiB per Linux job and retained seven days;
full static files stay in the job's ephemeral image. Never upload artifacts
after a boundary-validator failure. Images are not pushed to a registry.

## Local verification and preview

Use a clean Notes worktree so unpublished local files cannot be promoted.
No Docker engine installation is part of this change.

```powershell
npm.cmd ci
npm.cmd run ci:source
npm.cmd run ci:verify -- --renderer astro
npx.cmd --no-install playwright install chromium
npm.cmd run ci:browser
npm.cmd run test:security   # Windows only; overwrites local generated output
```

Preserve the Astro report/output before running the manual path in a separate
checkout. Run `ci:source`, then `ci:verify -- --renderer manual` and `ci:browser`.
On Linux use `playwright install --with-deps chromium` and the portable security
command. Local changed-input runs are marked dirty; hosted runs reject them.

For Docker, run `ci:source` before the README Compose command. The image build
checks those input hashes. `NOTES_RENDERER=manual` selects the other renderer.
`docker compose -f compose.preview.yml down` stops only this preview; do not
remove shared caches, Mail volumes or existing worktrees. Port 8798 must be
available. No host directories, credential stores or Docker socket are mounted.

On this Windows host no Docker engine was available at preparation time.
Hosted Docker verification is distinct from local-engine acceptance. Local
preview startup on this PC remains unverified until an engine is provided.

## Footer and production verification

Loopback preview exercises the Notes fallback footer. The real shared-footer
loader runs only at `yioo.link`; local success is not a shared-footer integration
claim. After approved manual deployment, check the real public host's footer,
desktop/mobile navigation, canonical/hreflang, RSS/sitemap and HTTP hashes.

Deployment remains the existing guarded full-release workflow: verify exact
merged source, review AWS dry-run and all deletion targets, then manually
upload with explicit confirmation. Do not deploy CI artifacts automatically.
On the current operator host, select `AWS_PROFILE=codex-yioo-notes` only for
the deployment process. The default profile returned InvalidClientTokenId;
do not repair/replace global or another owner's credentials as a workaround.
If live-only assets would be deleted, pause only that deployment decision and
report the exact paths; do not infer approval to delete them from merge approval.

## Failure, recovery and handoff

Before initial acceptance, record PASS, a temporary real invalid-publication
metadata FAIL, and restored PASS in the owning PR ledger, with source/run SHA.
Do not simulate this with an unconditional exit. Restore the test metadata
before merge; published content must remain byte-identical to the base.

A CI failure blocks this implementation's merge/deploy completion claim, not
the already served static site. Fix this branch and retest the affected flow.
Rollback changes only the new workflow/preview code through a reviewed revert;
existing manual publishing remains available. Required-check/branch-protection
policy is a separate decision. Production rollback requires the recorded
previous release/S3 version identities, never a broad workspace reset.

## Initial hosted acceptance evidence (2026-11-16)

- [PASS run 43740569428](https://github.com/kyoukarahe/yioo-notes/actions/runs/43740569428):
  head `06bebff54b1f260b841cd5438986d796d2085749`, tested PR merge ref
  `7c1d26899b58d63550eb8f2402c87ccb2fe8d811`; all three jobs passed.
  Both Docker outputs have 263 files / 20 posts. Verification stage measured
  12 seconds Astro and 6.5 seconds manual. Context transfer was 110.29 MB;
  report uploads approximately 2.23 MB per renderer. Post-browser container
  memory snapshots were 34.2/33.58 MiB of 256 MiB, not peak memory.
- [Intentional FAIL run 43740794102](https://github.com/kyoukarahe/yioo-notes/actions/runs/43740794102):
  head `4f37f7d7687cee35b6e6d5bacdc8bb8f46b1daa7`; a real source's temporary
  `status: draft` was rejected by both source-boundary checks and the existing
  Windows publication regression. Nothing was deployed; status restored before
  merge. Recovery/main/deployment records are in [PR #1](https://github.com/kyoukarahe/yioo-notes/pull/1).
- Scoped AWS dry-run passed with zero deletions; current S3 version inventory
  retained in the operator's ignored output folder. Production upload awaits
  recovered CI and merge. GitHub workflow publication succeeded using the
  existing responsible credential, without replacing any profile/token.

Reference: [GitHub Actions security](https://docs.github.com/en/actions/reference/security/secure-use),
[Playwright CI](https://playwright.dev/docs/ci),
[Docker build context](https://docs.docker.com/build/concepts/context/).
