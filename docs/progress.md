# Yioo Notes Progress

Date started: 2026-06-26

This file is the running implementation log for `yioo-notes`. Update it at the
start and end of every phase so state survives context changes, agent handoffs,
and deployment interruptions.

## Current Status

Phase: 5. AWS notes origin
Status: verified
Last safe state: Phase 4 local visual QA fixes were committed and pushed to
`origin/main`; Phase 5 AWS notes origin changes are applied, verified,
committed, and pushed, with no EC2, mail-service, or yioo-tools changes.
Next step: Start Phase 6 deploy test build.

## Phase Log

### Phase 0. Baseline

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Confirm current repo/AWS/live-route assumptions and create the initial
implementation plan.
Files changed:

- `docs/notes-implementation-plan.md`
- `docs/progress.md`
- `docs/findings.md`

Commands run:

- `git status`
- AWS/S3/CloudFront inspection commands from the planning session
- Live route checks for `https://yioo.link/`, `https://yioo.link/tools/`, and
  related notes assumptions

Verification:

- `yioo-notes` is a fresh clone of `kyoukarahe/yioo-notes`.
- `yioo-notes` S3 bucket exists in `ap-northeast-1`.
- Main CloudFront distribution is `EWYEJXEIKC81C`.
- No `/notes` CloudFront behavior exists yet.
- No runtime notes deployment has been made yet.

Commit: `0a633a9` (`docs: add notes implementation plan`)
Push: Success to `origin/main` after explicitly using the `yioo-notes` deploy
key.
Deployment/invalidation: none
Rollback state: No runtime rollback needed; docs-only state.
Next step: Start Phase 1 blog scaffold.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| PowerShell parser rejected `&&` command chaining. | Tried to run `git add`, cached diff, and diff check in one command. | Re-run the commands separately and avoid shell chaining. |
| Default SSH identity could not push to GitHub. | Ran `git push -u origin main`. | Re-ran push with `core.sshCommand` pointing to the registered `yioo-notes` deploy key. |

### Phase 1. Blog scaffold

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Create the static generator scaffold, `/notes/` route, layout/content
folders, site config, and local build verification script.
Files changed:

- `.gitignore`
- `AGENTS.md`
- `README.md`
- `astro.config.mjs`
- `package.json`
- `tsconfig.json`
- `content/posts/.gitkeep`
- `content/drafts/.gitkeep`
- `content/private/.gitkeep`
- `src/config/site.config.json`
- `src/lib/posts.ts`
- `src/layouts/BaseLayout.astro`
- `src/components/PostList.astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug]/index.astro`
- `src/styles/global.css`
- `scripts/verify-build.mjs`
- `docs/progress.md`

Commands run:

- `node --version`
- `npm.cmd --version`
- `npm.cmd install`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run preview -- --port 4321`
- `curl.exe -I http://127.0.0.1:4321/notes/`
- `curl.exe -I http://127.0.0.1:4321/notes`
- `npm.cmd run check`
- `git diff --cached --check`
- `git commit -m "feat: scaffold notes static site"`
- `git push` with the registered `yioo-notes` deploy key

Verification:

- Build succeeded and generated `dist/notes/index.html`.
- `npm.cmd run verify:build` confirmed `dist/notes` exists and draft/private
  output is absent.
- Local preview returned `200` for `/notes/`.
- Local preview returned `404` for `/notes`; this remains a later CloudFront
  exact route redirect concern, not a Phase 1 blocker.
- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints after fixes.
- `git diff --cached --check` passed after removing extra blank lines at EOF.

Commit: `ffc6c89` (`feat: scaffold notes static site`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: none
Rollback state: Revert the Phase 1 scaffold commit before any deploy.
Next step: Start Phase 2 test content.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| `astro check` failed because Node globals/modules had no type definitions. | Ran `npm.cmd run check`. | Added `@types/node` as a dev dependency. |
| `astro check` treated `post.tags` as possibly undefined. | Ran `npm.cmd run check`. | Made the normalized `Post.tags` field required. |
| Astro hinted that the analytics loader script should be explicitly inline. | Ran `npm.cmd run check`. | Added `is:inline` to the external analytics loader script tag. |
| `git diff --cached --check` reported extra blank lines at EOF. | Checked staged Phase 1 files before commit. | Removed the trailing blank lines and re-ran the staged diff check successfully. |
| `npm.cmd install` reported 9 dependency audit findings. | Installed Astro dependencies. | Left unresolved for now because `npm audit fix --force` may introduce breaking changes; revisit before production acceptance. |

### Phase 2. Test content

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Add one published test note and one real post-scoped WebP image asset.
Files changed:

- `content/posts/2026-06-26-test-note.md`
- `public/notes/assets/posts/2026-06-26-test-note/test-image.webp`
- `docs/progress.md`

Commands run:

- `Get-Command magick`
- `Get-Command cwebp`
- `Get-Command ffmpeg`
- `npm.cmd install sharp --no-save`
- Node/sharp WebP generation command
- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run preview -- --port 4321`
- `curl.exe -I http://127.0.0.1:4321/notes/`
- `curl.exe -I http://127.0.0.1:4321/notes/2026-06-26-test-note/`
- `curl.exe -I http://127.0.0.1:4321/notes/assets/posts/2026-06-26-test-note/test-image.webp`

Verification:

- Test image was generated as a real WebP asset at 1200x630.
- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- Build succeeded and generated the notes index plus
  `dist/notes/2026-06-26-test-note/index.html`.
- `npm.cmd run verify:build` confirmed draft/private output is absent.
- Local preview returned `200` for `/notes/`.
- Local preview returned `200` for `/notes/2026-06-26-test-note/`.
- Local preview returned `200` and `Content-Type: image/webp` for the test
  image.
- Phase 3 generation verified that the test post appears in
  `posts.manifest.json`.
- Phase 3 generation verified that the test post appears in `sitemap.xml`.

Commit: `cbec9d5` (`feat: add notes test post`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: none
Rollback state: Remove the test post and asset folder, then rebuild.
Next step: Continue Phase 3 SEO and manifest implementation.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| No local `magick`, `cwebp`, or `ffmpeg` command was available for WebP generation. | Checked local image tooling. | Used temporary `sharp` installation with `--no-save`. |
| First Node/sharp one-liner failed because PowerShell quoting stripped JS string quotes. | Tried to generate WebP with `node -e`. | Passed the JS code through stdin to `node -`, then generated the image successfully. |

### Phase 3. SEO and manifest

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Add generated post manifest, generated notes sitemap, article/index SEO
metadata, structured data, and stronger build verification.
Files changed:

- `src/lib/posts.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug]/index.astro`
- `src/pages/notes/posts.manifest.json.ts`
- `src/pages/notes/sitemap.xml.ts`
- `scripts/verify-build.mjs`
- `docs/progress.md`

Commands run:

- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `Get-ChildItem -Recurse -File dist/notes`
- `Get-Content -Raw dist/notes/posts.manifest.json`
- `Get-Content -Raw dist/notes/sitemap.xml`
- `npm.cmd run preview -- --port 4321`
- `curl.exe -I http://127.0.0.1:4321/notes/posts.manifest.json`
- `curl.exe -I http://127.0.0.1:4321/notes/sitemap.xml`
- `curl.exe -s http://127.0.0.1:4321/notes/posts.manifest.json`
- `curl.exe -s http://127.0.0.1:4321/notes/sitemap.xml`
- `curl.exe -s http://127.0.0.1:4321/notes/2026-06-26-test-note/`
- `git diff --cached --check`
- `git commit -m "feat: add notes SEO manifest"`
- `git push` with the registered `yioo-notes` deploy key

Verification:

- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- Build generated:
  - `dist/notes/index.html`
  - `dist/notes/2026-06-26-test-note/index.html`
  - `dist/notes/assets/posts/2026-06-26-test-note/test-image.webp`
  - `dist/notes/posts.manifest.json`
  - `dist/notes/sitemap.xml`
- `npm.cmd run verify:build` verified the test post, image asset, generated
  manifest, generated sitemap, canonical URL, `og:url`, and absence of
  draft/private output.
- Manifest includes `2026-06-26-test-note` with canonical URL
  `https://yioo.link/notes/2026-06-26-test-note/`.
- Sitemap includes `https://yioo.link/notes/` and
  `https://yioo.link/notes/2026-06-26-test-note/`.
- Local preview returned `200` for `/notes/posts.manifest.json`.
- Local preview returned `200` for `/notes/sitemap.xml`.
- Post HTML includes article Open Graph metadata, Twitter large-image metadata,
  and JSON-LD `BlogPosting` structured data.
- `git diff --cached --check` passed before commit.

Commit: `e4231fc` (`feat: add notes SEO manifest`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: none
Rollback state: Revert Phase 3 SEO/manifest files; keep Phase 2 content source
untouched unless content metadata is proven invalid.
Next step: Start Phase 4 local visual QA.

### Phase 4. Local visual QA

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Verify the simple first layout locally before any AWS work, including
desktop/mobile screenshots, rendered post image, console output, and obvious
layout overlap checks.
Files changed:

- `.gitignore`
- `src/layouts/BaseLayout.astro`
- `src/pages/notes/index.astro`
- `public/notes/favicon.svg`
- `docs/progress.md`

Commands run:

- `npx.cmd --version`
- `npx.cmd --yes --package @playwright/cli playwright-cli --help`
- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run preview -- --port 4321`
- `npx.cmd --yes --package @playwright/cli playwright-cli open http://127.0.0.1:4321/notes/`
- `npx.cmd --yes --package @playwright/cli playwright-cli console`
- `npx.cmd --yes --package @playwright/cli playwright-cli resize 1440 1000`
- `npx.cmd --yes --package @playwright/cli playwright-cli resize 390 844`
- Playwright screenshot commands for:
  - `output/playwright/phase4-index-desktop.png`
  - `output/playwright/phase4-post-desktop.png`
  - `output/playwright/phase4-index-mobile.png`
  - `output/playwright/phase4-post-mobile.png`
- Playwright DOM overflow and image load check.

Verification:

- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed.
- `npm.cmd run verify:build` passed.
- Playwright console check returned 0 errors and 0 warnings after fixes.
- Desktop screenshots were captured for `/notes/` and
  `/notes/2026-06-26-test-note/`.
- Mobile screenshots were captured at 390x844 for `/notes/` and
  `/notes/2026-06-26-test-note/`.
- Vision inspection confirmed the desktop and mobile index pages no longer have
  mojibake text and do not show overlapping UI.
- Vision inspection confirmed the desktop and mobile post pages render the test
  image and article body without visible overlap.
- DOM check at 390px width found no horizontally overflowing header/nav/main/
  article/text/image elements.
- The post cover image was complete with natural width 1200.

Commit: `dff98e5` (`fix: complete local visual QA`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: none
Rollback state: Revert only Phase 4 QA doc/ignore changes if needed; no runtime
rollback is required.
Next step: Start Phase 5 AWS notes origin.

### Phase 5. AWS notes origin

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Configure the `yioo-notes` private S3 bucket and main `yioo.link`
CloudFront distribution so `/notes` and `/notes/*` can serve notes static
objects without changing EC2, mail-service, or yioo-tools routing.
Files changed:

- `infra/cloudfront/yioo-notes-uri-rewrite.js`
- `infra/aws/yioo-notes-bucket-policy.json`
- `docs/progress.md`

Commands run:

- `aws --version`
- `aws sts get-caller-identity`
- `curl.exe -I https://yioo.link/`
- `curl.exe -I https://yioo.link/api/health`
- `curl.exe -I https://yioo.link/healthz`
- `curl.exe -I https://yioo.link/tools/`
- `aws cloudfront get-distribution-config --id EWYEJXEIKC81C`
- `aws s3api get-bucket-location --bucket yioo-notes`
- `aws s3api get-public-access-block --bucket yioo-notes`
- `aws s3api get-bucket-versioning --bucket yioo-notes`
- `aws s3api get-bucket-encryption --bucket yioo-notes`
- `aws s3api get-bucket-policy --bucket yioo-notes`
- `aws s3api list-objects-v2 --bucket yioo-notes --max-items 5`
- `aws cloudfront list-origin-access-controls`
- `aws cloudfront create-origin-access-control`
- `aws cloudfront create-function --name yioo-notes-uri-rewrite`
- `aws cloudfront publish-function --name yioo-notes-uri-rewrite`
- `aws s3api put-bucket-versioning --bucket yioo-notes --versioning-configuration Status=Enabled`
- `aws s3api put-bucket-tagging --bucket yioo-notes`
- `aws s3api put-bucket-policy --bucket yioo-notes`
- `aws cloudfront update-distribution --id EWYEJXEIKC81C`
- `aws cloudfront wait distribution-deployed --id EWYEJXEIKC81C`
- Post-change route and AWS verification commands.

Verification:

- Pre-change `https://yioo.link/`, `/api/health`, `/healthz`, and `/tools/`
  returned `200`.
- Pre-change CloudFront config was backed up locally to
  `output/aws/phase5-cloudfront-before.json`.
- S3 bucket `yioo-notes` is in `ap-northeast-1`, public access block remains
  fully enabled, and direct S3 object access returns `403`.
- S3 bucket versioning is enabled.
- S3 bucket tags are set: `Project=yioo`, `App=yioo-notes`,
  `Purpose=notes-static`.
- S3 bucket policy allows `s3:GetObject` only from CloudFront distribution
  `EWYEJXEIKC81C`.
- Created notes OAC `E3GOFI784M6TJF`.
- Created and published CloudFront Function `yioo-notes-uri-rewrite`.
- Updated CloudFront distribution `EWYEJXEIKC81C`; deployed status confirmed.
- CloudFront now has `s3-yioo-notes` origin pointing to
  `yioo-notes.s3.ap-northeast-1.amazonaws.com` with OAC `E3GOFI784M6TJF`.
- CloudFront now has `/notes` and `/notes/*` behaviors targeting
  `s3-yioo-notes`, each with one viewer-request Function association.
- Post-change `https://yioo.link/`, `/api/health`, `/healthz`, and `/tools/`
  returned `200`.
- `https://yioo.link/notes/` returned `403`, which is expected until Phase 6
  uploads the notes build objects.

Commit: `42afd98` (`chore: add notes AWS routing assets`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: CloudFront distribution update deployed. Current
CloudFront config ETag after Phase 5 is `EN1VRQENFRJN5`.
Rollback state: Restore the pre-change CloudFront distribution config, remove
the notes bucket policy/OAC additions if applied, and leave EC2 untouched.
Next step: Start Phase 6 deploy test build.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| PowerShell `ConvertFrom-Json -Depth` was not supported in this environment. | Tried to generate the updated CloudFront config with PowerShell JSON parsing. | Switched to a Node script for config generation. |
| Node JSON parsing failed on the CloudFront backup because `Out-File` wrote a UTF-8 BOM. | Tried to parse the backup JSON directly. | Stripped the BOM before JSON.parse and regenerated the updated config. |

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| Local preview reported 404 console errors for `/analytics-loader.js` and `/favicon.ico`. | Opened `/notes/` with Playwright. | Added a host-gated analytics loader script and a notes favicon. |
| Desktop screenshot showed mojibake in the index intro text. | Inspected `phase4-index-desktop.png`. | Replaced the corrupted intro copy with ASCII text and rebuilt. |
| First Playwright `run-code` screenshot command failed because it was not passed as a function. | Tried `await page.screenshot(...)` directly. | Re-ran with `async (page) => { ... }`. |
