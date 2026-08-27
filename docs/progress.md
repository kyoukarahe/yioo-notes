# Yioo Notes Progress

Date started: 2026-06-26

This file is the running implementation log for `yioo-notes`. Update it at the
start and end of every phase so state survives context changes, agent handoffs,
and deployment interruptions.

## Current Status

Phase: 25. Harden the Notes publication entry points
Status: verified locally and through live AWS dry-run; no production mutation
Last safe state: Both publishers now fail closed, validate the release and AWS
target, and require explicit full-release confirmation. The 2026-08-21 Codex
automation remains active and uses the revised commands.
Next step: At the scheduled run, verify the approved hashes and disclosure
ledger, review the AWS dry-run, and publish only if every local and live gate
passes.

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

### Phase 6. Deploy test build

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Upload the verified notes build to `s3://yioo-notes/notes/...`, create a
CloudFront invalidation, and confirm live `/notes/` routes work.
Files changed:

- `scripts/deploy.ps1`
- `docs/progress.md`

Commands run:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1 -DryRun`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1`
- `aws cloudfront wait invalidation-completed --distribution-id EWYEJXEIKC81C --id I4G27ZPK71ZQYYJ9804I9VLJ6F`
- `aws s3 ls s3://yioo-notes/notes/ --recursive`
- `curl.exe -I https://yioo.link/notes`
- `curl.exe -I https://yioo.link/notes/`
- `curl.exe -I https://yioo.link/notes/2026-06-26-test-note/`
- `curl.exe -I https://yioo.link/notes/assets/posts/2026-06-26-test-note/test-image.webp`
- `curl.exe -I https://yioo.link/notes/posts.manifest.json`
- `curl.exe -I https://yioo.link/notes/sitemap.xml`
- `curl.exe -s https://yioo.link/notes/2026-06-26-test-note/`
- `curl.exe -s https://yioo.link/notes/sitemap.xml`
- Existing route checks for root, `/api/health`, `/healthz`, `/tools/`, and
  `https://tools.yioo.link/tools/ko/`.
- `aws cloudfront update-response-headers-policy --id 8e1c7af3-7749-449b-a437-2938e261c9b9`
- `aws cloudfront create-invalidation --distribution-id EWYEJXEIKC81C --paths "/notes*" "/notes/*"`
- `aws cloudfront wait invalidation-completed --distribution-id EWYEJXEIKC81C --id ICCQB9V48Y9IWA0RWTKUBWGCB9`
- Playwright live browser checks for `/notes/` and
  `/notes/2026-06-26-test-note/`.

Verification:

- Dry-run deploy produced the expected six notes uploads.
- Real deploy uploaded:
  - `notes/index.html`
  - `notes/2026-06-26-test-note/index.html`
  - `notes/assets/posts/2026-06-26-test-note/test-image.webp`
  - `notes/favicon.svg`
  - `notes/posts.manifest.json`
  - `notes/sitemap.xml`
- First deploy invalidation completed: `I4G27ZPK71ZQYYJ9804I9VLJ6F`.
- HTML metadata was corrected to `Content-Type: text/html; charset=utf-8`.
- JSON metadata was corrected to `Content-Type: application/json; charset=utf-8`.
- XML metadata was corrected to `Content-Type: application/xml; charset=utf-8`.
- Second invalidation completed after metadata/CSP fixes:
  `ICCQB9V48Y9IWA0RWTKUBWGCB9`.
- `https://yioo.link/notes` and `https://yioo.link/notes/` return `200`.
- `https://yioo.link/notes/2026-06-26-test-note/` returns `200`.
- The test image returns `200`, `Content-Type: image/webp`, and long-cache
  headers.
- Manifest and sitemap return `200` and include the test post URL.
- Live post HTML includes canonical URL, `og:url`, and test image references.
- Root, `/api/health`, `/healthz`, `/tools/`, and
  `https://tools.yioo.link/tools/ko/` still return `200`.
- Playwright live post console check returned 0 errors and 0 warnings after the
  CSP `connect-src` update.

Commit: `201db15` (`chore: add notes deploy script`)
Push: Success to `origin/main` using the registered `yioo-notes` deploy key.
Deployment/invalidation: S3 upload completed. Invalidation IDs:
`I4G27ZPK71ZQYYJ9804I9VLJ6F`, `I4S3XVMYHHKE6W0M1LX1U71IXZ`, and
`ICCQB9V48Y9IWA0RWTKUBWGCB9`.
Rollback state: Restore previous S3 object versions or delete uploaded
`notes/` objects, then invalidate `/notes*` and `/notes/*`.
Next step: Start Phase 7 `yioo-link` sitemap coordination.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| First live deploy served HTML as `text/html` without `charset=utf-8`. | Checked live `curl -I` headers after deploy. | Updated `scripts/deploy.ps1` to rewrite HTML/JSON/XML content types explicitly and redeployed. |
| Live Playwright post check saw GA CSP errors for `https://www.google.com/g/collect`. | Opened live post with Playwright. | Updated shared response headers policy `8e1c7af3-7749-449b-a437-2938e261c9b9` to include `https://www.google.com` in `connect-src`, invalidated `/notes*`, and rechecked console. |

### Phase 7. yioo-link SEO

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Coordinate root SEO ownership in `yioo-link` by adding public notes URLs
to the root sitemap and documenting notes routing/ownership in the live
architecture doc.
Files changed:

- `C:\repos\yioo\yioo-link\apps\public-pages\sitemap.xml`
- `C:\repos\yioo\yioo-link\docs\ops\current-yioo-link-architecture.md`
- `docs/progress.md`
- `docs/findings.md`

Commands run:

- `aws s3 cp apps/public-pages/sitemap.xml s3://yioo-link-mail-static/sitemap.xml --content-type "application/xml; charset=utf-8" --cache-control "no-cache"`
- `aws cloudfront create-invalidation --distribution-id EWYEJXEIKC81C --paths "/sitemap.xml"`
- `aws cloudfront wait invalidation-completed --distribution-id EWYEJXEIKC81C --id IAO942HX0VG98LO6IS9ZYMYZOM`
- `curl.exe -s -I https://yioo.link/sitemap.xml`
- `curl.exe -s https://yioo.link/sitemap.xml`
- `curl.exe -s https://yioo.link/robots.txt`
- `curl.exe -s -o NUL -w "notes %{http_code}\n" https://yioo.link/notes/`
- `curl.exe -s -o NUL -w "api %{http_code}\n" https://yioo.link/api/health`
- `curl.exe -s -o NUL -w "tools %{http_code}\n" https://yioo.link/tools/`
- `[xml](Get-Content -LiteralPath 'apps/public-pages/sitemap.xml' -Raw)`
- `git diff --check`
- `git commit -m "docs: document notes routing and sitemap"` in `yioo-link`
- `git push origin main` in `yioo-link`

Verification:

- Root sitemap returns `200` with `Content-Type: application/xml; charset=utf-8`.
- Root sitemap includes `https://yioo.link/notes/`.
- Root sitemap includes
  `https://yioo.link/notes/2026-06-26-test-note/`.
- `robots.txt` still has `Allow: /` and `Disallow: /api/`, so `/notes/`
  is not blocked.
- Local `yioo-link` sitemap XML parses successfully with 41 URL entries.
- `https://yioo.link/notes/` returned `200` after the sitemap deploy.
- `https://yioo.link/api/health` returned `200` after the sitemap deploy.
- `https://yioo.link/tools/` returned `200` after the sitemap deploy.
- `git diff --check` passed in `yioo-link`.

Commit: `8632142` in `yioo-link` (`docs: document notes routing and sitemap`)
Push: Success to `kyoukarahe/yioo-link.git` `main`.
Deployment/invalidation: Root sitemap uploaded to `s3://yioo-link-mail-static`
and CloudFront invalidation `IAO942HX0VG98LO6IS9ZYMYZOM` completed.
Rollback state: Revert `yioo-link` commit `8632142`, upload the previous
`apps/public-pages/sitemap.xml` to `s3://yioo-link-mail-static/sitemap.xml`,
and invalidate `/sitemap.xml`. Leave notes S3 and `/notes` routing online
unless a notes-specific issue is found.
Next step: Start Phase 8 live acceptance.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| XML verification command failed because nested PowerShell quoting removed `$xml` from the expression. | Ran a nested `powershell -Command` one-liner. | Re-ran the XML parse as a direct PowerShell block and confirmed `url-count=41`. |
| First `yioo-notes` docs push after Phase 7 failed because the deploy key path was passed with backslashes inside `GIT_SSH_COMMAND`. | Ran `git push` with `C:\...` key path in the SSH command. | Re-ran with forward slashes (`C:/repos/.../yioo-notes-deploy-20260626`) and pushed successfully. |

### Phase 8. Live acceptance

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Confirm the deployed notes site is publicly reachable end to end and
that existing yioo.link root/API/tools routes still work after notes routing,
notes deploy, CSP update, and root sitemap deployment.
Files changed:

- `docs/progress.md`
- `docs/findings.md`

Commands run:

- `curl.exe -s -o NUL -w "notes-noslash %{http_code} %{content_type}\n" https://yioo.link/notes`
- `curl.exe -s -o NUL -w "notes-slash %{http_code} %{content_type}\n" https://yioo.link/notes/`
- `curl.exe -s -o NUL -w "post %{http_code} %{content_type}\n" https://yioo.link/notes/2026-06-26-test-note/`
- `curl.exe -s -o NUL -w "image %{http_code} %{content_type}\n" https://yioo.link/notes/assets/posts/2026-06-26-test-note/test-image.webp`
- `curl.exe -s -o NUL -w "manifest %{http_code} %{content_type}\n" https://yioo.link/notes/posts.manifest.json`
- `curl.exe -s -o NUL -w "notes-sitemap %{http_code} %{content_type}\n" https://yioo.link/notes/sitemap.xml`
- `curl.exe -s -o NUL -w "root %{http_code} %{content_type}\n" https://yioo.link/`
- `curl.exe -s -o NUL -w "api-health %{http_code} %{content_type}\n" https://yioo.link/api/health`
- `curl.exe -s -o NUL -w "tools %{http_code} %{content_type}\n" https://yioo.link/tools/`
- `curl.exe -s https://yioo.link/notes/2026-06-26-test-note/`
- `curl.exe -s https://yioo.link/notes/posts.manifest.json`
- `curl.exe -s https://yioo.link/notes/sitemap.xml`
- `curl.exe -s https://yioo.link/sitemap.xml`
- `curl.exe -s https://yioo.link/robots.txt`
- `curl.exe -s -I https://yioo.link/notes/assets/posts/2026-06-26-test-note/test-image.webp`
- `npx.cmd --yes --package @playwright/cli playwright-cli open https://yioo.link/notes/`
- Playwright desktop screenshots for live index/post:
  - `output/playwright/phase8-live-index-desktop.png`
  - `output/playwright/phase8-live-post-desktop.png`
- Playwright mobile screenshots for live index/post:
  - `output/playwright/phase8-live-index-mobile.png`
  - `output/playwright/phase8-live-post-mobile.png`
- Playwright console checks for live index/post on desktop and mobile.
- Playwright DOM checks for mobile horizontal overflow and image load state.
- `npx.cmd --yes --package @playwright/cli playwright-cli close`

Verification:

- `https://yioo.link/notes` returns `200` and `text/html; charset=utf-8`.
- `https://yioo.link/notes/` returns `200` and `text/html; charset=utf-8`.
- `https://yioo.link/notes/2026-06-26-test-note/` returns `200` and
  `text/html; charset=utf-8`.
- Test image returns `200`, `Content-Type: image/webp`, and
  `Cache-Control: public,max-age=31536000,immutable`.
- `https://yioo.link/notes/posts.manifest.json` returns `200` and
  `application/json; charset=utf-8`.
- `https://yioo.link/notes/sitemap.xml` returns `200` and
  `application/xml; charset=utf-8`.
- Root `https://yioo.link/sitemap.xml` includes the notes index and test post
  URLs.
- `robots.txt` still allows `/` and disallows only `/api/`.
- Live post HTML includes canonical URL, `og:url`, title text, and
  `test-image.webp` references.
- Live manifest includes `2026-06-26-test-note` and the expected canonical URL.
- Live notes sitemap includes the notes index and test post URLs.
- Existing `https://yioo.link/`, `https://yioo.link/api/health`, and
  `https://yioo.link/tools/` routes returned `200`.
- Playwright opened the live notes index and test post with the expected page
  titles.
- Playwright console checks returned 0 errors and 0 warnings for live index and
  test post on desktop/mobile.
- Playwright confirmed both test post image instances are complete with natural
  size 1200x630.
- Playwright confirmed no document-level horizontal overflow at 390px width.
- Vision inspection of Phase 8 screenshots found no visible overlap, missing
  post image, or obvious live rendering breakage.

Commit: Docs-only acceptance record (`docs: record phase 8 acceptance`).
Push: Success to `origin/main` after this documentation update is pushed.
Deployment/invalidation: none in Phase 8. Phase 8 verifies the already deployed
Phase 6 notes objects, Phase 6 CSP update, and Phase 7 root sitemap deployment.
Rollback state: If notes-only checks fail later, redeploy a previous
`yioo-notes` commit or restore previous S3 object versions and invalidate
`/notes*` and `/notes/*`. If root/API/tools regress, restore the prior
CloudFront distribution config before changing EC2.
Next step: Start Phase 9 design research/subagent pass if the design
refinement requirement remains in scope.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| None. | Phase 8 live acceptance checks. | All checks passed. |

### Phase 9. Design pass

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Research Codex/frontend design references, run a scoped subagent-style
design implementation, verify with Playwright screenshots and vision, score the
candidate, then deploy only if the score is 90 or higher.
Files changed:

- `docs/design-research.md`
- `docs/design-scorecard.md`
- `docs/progress.md`
- `docs/findings.md`
- `src/layouts/BaseLayout.astro`
- `src/components/PostList.astro`
- `src/styles/global.css`

Commands run:

- Web research for current Codex/frontend design references.
- `tool_search` for multi-agent tooling.
- `multi_agent_v1.spawn_agent` for the scoped design worker.
- `multi_agent_v1.wait_agent`
- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run preview -- --host 127.0.0.1 --port 4321`
- Playwright local checks for `/notes/` and
  `/notes/2026-06-26-test-note/` at 1440x1000 and 390x844.
- Playwright screenshots:
  - `output/playwright/phase9-design-index-desktop.png`
  - `output/playwright/phase9-design-post-desktop.png`
  - `output/playwright/phase9-design-index-mobile.png`
  - `output/playwright/phase9-design-post-mobile.png`
- Playwright console, overflow, and image natural-size checks.
- Vision inspection of the four Phase 9 screenshots.
- `git diff --check`

Verification:

- Multi-agent tooling is available through `multi_agent_v1`.
- Design research and implementation brief are recorded in
  `docs/design-research.md`.
- Phase 9 scope is limited to design-owned files and docs. Content, SEO route
  generation, deploy scripts, AWS routing, `yioo-link`, mail-service, and
  `yioo-tools` are out of scope unless a separate defect is found.
- The design worker changed only `src/layouts/BaseLayout.astro`,
  `src/components/PostList.astro`, and `src/styles/global.css`.
- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed on rerun.
- `npm.cmd run verify:build` passed.
- Local Playwright console checks returned 0 errors and 0 warnings for
  index/post on desktop/mobile.
- Local Playwright confirmed no document-level horizontal overflow at 1440px or
  390px.
- Local Playwright confirmed both post image instances load at 1200x630.
- Vision inspection found no visible overlap, missing image, or text clipping
  in the four Phase 9 screenshots.
- Design candidate `Workbench Notes` scored 94/100 in
  `docs/design-scorecard.md`, so it is eligible for deployment.

Commit:

- `1442d1a` (`docs: add phase 9 design research`)
- `9cdbf69` (`feat: refine notes workbench design`)
- `a3596a9` (`fix: serve notes astro assets under notes path`)

Push: All Phase 9 implementation/fix commits pushed to `origin/main`.
Deployment/invalidation:

- First design deploy completed and created invalidation
  `I8CL4OW1G6T0O559MUPJZ7XGP7`.
- Final fixed deploy completed and created invalidation
  `IERJALDF76M2KTATHYLGI79Z5V`.
- Final invalidation `IERJALDF76M2KTATHYLGI79Z5V` completed.

Rollback state: Revert Phase 9 design docs and design-owned source files only.
Do not roll back Phase 5/6/7 routing or sitemap work for a design-only issue.
If the final asset path fix must be rolled back, also confirm CSS still loads
from `/notes/_astro/...` before redeploying. For a deployed design-only issue,
redeploy the previous known-good commit and invalidate `/notes*` and
`/notes/*`.
Next step: Optional future content publishing or a separate design/content pass.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| First local `npm.cmd run build` after the design patch completed output generation but exited with a Windows/Node `UV_HANDLE_CLOSING` assertion. | Ran the build in parallel with a git diff status check. | Confirmed generated output with `verify:build`, reran `npm.cmd run build` alone, and it completed normally. |
| Local Astro preview listened on `[::1]:4321` even though the test attempted `127.0.0.1:4321`. | Opened `http://127.0.0.1:4321/notes/` with Playwright. | Reopened with `http://localhost:4321/notes/`, which resolved to the active preview server. |
| The exec backend did not support sending Ctrl-C to stop the preview session. | Tried to interrupt the preview process via `write_stdin`. | Identified the listening Node PID with `netstat`/`Get-Process` and stopped that preview process only. |
| First live design deploy loaded HTML but the stylesheet URL was `/_astro/index.Cz73WjMw.css`; root CloudFront served an XML error response as `application/xml`, so the browser refused to apply the stylesheet. | Opened live `/notes/` after invalidation `I8CL4OW1G6T0O559MUPJZ7XGP7`. | Set `build.assets` to `notes/_astro`, taught `verify-build` to reject root `/_astro` links, updated deploy metadata for `_astro` CSS, committed `a3596a9`, redeployed, and verified `https://yioo.link/notes/_astro/index.Cz73WjMw.css` returns `text/css; charset=utf-8`. |

Final live verification:

- `https://yioo.link/notes` returns `200` and `text/html; charset=utf-8`.
- `https://yioo.link/notes/` returns `200` and `text/html; charset=utf-8`.
- `https://yioo.link/notes/2026-06-26-test-note/` returns `200` and
  `text/html; charset=utf-8`.
- `https://yioo.link/notes/_astro/index.Cz73WjMw.css` returns `200`,
  `text/css; charset=utf-8`, and long-cache headers.
- Live HTML references `/notes/_astro/index.Cz73WjMw.css`, not `/_astro/...`.
- `https://yioo.link/`, `https://yioo.link/api/health`, and
  `https://yioo.link/tools/` returned `200` after the final deploy.
- Live Playwright screenshots:
  - `output/playwright/phase9-live-index-desktop.png`
  - `output/playwright/phase9-live-post-desktop.png`
  - `output/playwright/phase9-live-index-mobile.png`
  - `output/playwright/phase9-live-post-mobile.png`
- Live Playwright console checks returned 0 errors and 0 warnings for
  index/post on desktop/mobile after the asset path fix.
- Live Playwright confirmed no document-level horizontal overflow at 1440px or
  390px.
- Live Playwright confirmed the stylesheet loaded from
  `https://yioo.link/notes/_astro/index.Cz73WjMw.css`.
- Live Playwright confirmed both post image instances load at 1200x630.
- Final vision inspection found the deployed design matches the accepted
  `Workbench Notes` candidate with no visible overlap or missing image.

### Phase 10. Content publish script

Status: verified
Started: 2026-06-26
Finished: 2026-06-26
Scope: Make post reflection possible without a full Astro build by introducing
a content publishing script, moving the notes stylesheet to a stable
`/notes/styles.css` path, quarantining local generated artifacts outside the
repository, and validating the workflow with a new image-backed test post.
Files changed:

- `package.json`
- `src/layouts/BaseLayout.astro`
- `public/notes/styles.css`
- `scripts/astro-build.mjs`
- `scripts/sync-styles.mjs`
- `scripts/publish-posts.mjs`
- `scripts/verify-build.mjs`
- `scripts/deploy.ps1`
- `content/posts/2026-06-26-script-publish-test.md`
- `public/notes/assets/posts/2026-06-26-script-publish-test/script-publish-flow.svg`
- `docs/progress.md`
- `docs/findings.md`

Related `yioo-link` files changed for sitemap discovery:

- `C:\repos\yioo\yioo-link\apps\public-pages\robots.txt`
- `C:\repos\yioo\yioo-link\docs\ops\current-yioo-link-architecture.md`

Commands run:

- `git status --short --branch`
- `rg --files`
- `npm.cmd run sync:styles`
- `npm.cmd run check`
- `npm.cmd run build`
- `$env:ASTRO_TELEMETRY_DISABLED='1'; npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run publish:posts -- --no-upload`
- `npm.cmd run publish:posts -- --slug 2026-06-26-script-publish-test --no-upload`
- Local generated-output inspection for fixed CSS, manifest, sitemap, and post
  image paths.
- `npm.cmd run publish:posts -- --slug 2026-06-26-script-publish-test`
- Live `curl.exe` checks for `/notes/`, the new post, the new image,
  `/notes/styles.css`, manifest, notes sitemap, root, `/api/health`, and
  `/tools/`.
- `aws s3 ls s3://yioo-notes/notes/ --recursive`
- `aws s3 cp apps/public-pages/robots.txt s3://yioo-link-mail-static/robots.txt`
- `aws cloudfront create-invalidation --distribution-id EWYEJXEIKC81C --paths "/robots.txt"`
- `aws cloudfront wait invalidation-completed --distribution-id EWYEJXEIKC81C --id I3GURMMAZEH1K2IBP8G2KPLGFG`

Verification:

- Local generated artifacts `.astro`, `.playwright-cli`, `dist`, and `output`
  were moved to `C:\repos\yioo\_local-quarantine\yioo-notes-20260626-094242`
  instead of being deleted.
- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed and now syncs `src/styles/global.css` to
  `public/notes/styles.css` before build.
- `npm.cmd run verify:build` passed for Astro output and for
  `publish:posts --no-upload` output.
- `publish:posts --no-upload` rendered two published posts to `dist/notes`.
- The new test post appears in `dist/notes/index.html`,
  `dist/notes/posts.manifest.json`, and `dist/notes/sitemap.xml`.
- The new SVG image appears under
  `dist/notes/assets/posts/2026-06-26-script-publish-test/`.
- Generated HTML references `/notes/styles.css` and does not reference
  `/_astro/...` or `/notes/_astro/...` stylesheet assets.
- First plain `astro build` attempts generated output but exited with a
  Windows/Node `UV_HANDLE_CLOSING` assertion after completion. Setting
  `ASTRO_TELEMETRY_DISABLED=1` fixed the exit state, so
  `scripts/astro-build.mjs` now runs Astro with telemetry disabled.
- The final default `npm.cmd run build` passed through `scripts/astro-build.mjs`.
- Live `https://yioo.link/notes/` returns `200` and
  `text/html; charset=utf-8`.
- Live
  `https://yioo.link/notes/2026-06-26-script-publish-test/` returns `200` and
  `text/html; charset=utf-8`.
- Live
  `https://yioo.link/notes/assets/posts/2026-06-26-script-publish-test/script-publish-flow.svg`
  returns `200` and `image/svg+xml`.
- Live `https://yioo.link/notes/styles.css` returns `200` and
  `text/css; charset=utf-8`.
- Live `https://yioo.link/notes/posts.manifest.json` includes
  `2026-06-26-script-publish-test`.
- Live `https://yioo.link/notes/sitemap.xml` includes
  `https://yioo.link/notes/2026-06-26-script-publish-test/`.
- Live post HTML includes the correct canonical URL, `og:url`, fixed CSS path,
  and SVG image references.
- Live `https://yioo.link/robots.txt` advertises both
  `https://yioo.link/sitemap.xml` and
  `https://yioo.link/notes/sitemap.xml`, so future notes sitemap updates do not
  require per-post `yioo-link` edits.
- Existing `https://yioo.link/`, `https://yioo.link/api/health`, and
  `https://yioo.link/tools/` routes returned `200` after notes deployment and
  robots deployment.

Commit:

- `49c6d3f` (`feat: add notes content publisher`) in `yioo-notes`
- Related SEO discovery commit: `e736f73` (`chore: advertise notes sitemap`) in
  `yioo-link`

Push: Both commits pushed to their `origin/main` remotes.
Deployment/invalidation:

- Notes publish script uploaded `dist/notes/...` to `s3://yioo-notes/notes/...`
  and deleted the old `notes/_astro/index.Cz73WjMw.css` object.
- Notes CloudFront invalidation `I4SR75IEVON7ZDXJQYGT7UH4C2` completed.
- `yioo-link` robots update invalidation `I3GURMMAZEH1K2IBP8G2KPLGFG`
  completed.

Rollback state: Restore the previous commit, run `npm.cmd run build`, redeploy
the previous `dist/notes` or restore S3 object versions, then invalidate
`/notes*` and `/notes/*`. For the robots-only SEO discovery change, revert
`yioo-link` commit `e736f73`, re-upload `apps/public-pages/robots.txt`, and
invalidate `/robots.txt`. The quarantined local artifacts can be deleted by the
user after this phase is verified.
Next step: Commit and push this phase, then use `publish:posts` for routine
post reflection.

### Phase 11. Design guidance and current audit

Status: verified
Started: 2026-06-28
Finished: 2026-06-28
Scope: Add current design guidance, make mobile design verification explicitly
mandatory, evaluate the current deployed design, and record pre-implementation
research for future advanced design work.
Files changed:

- `AGENTS.md`
- `docs/notes-implementation-plan.md`
- `docs/progress.md`
- `docs/findings.md`
- `design-docs/README.md`
- `design-docs/design-guidelines.md`
- `design-docs/current-design-evaluation-2026-06-28.md`
- `design-docs/design-advancement-research-2026-06-28.md`

Commands run:

- `npx.cmd --version`
- `npm.cmd run check`
- `npm.cmd run build`
- Web research against W3C/WAI, MDN, web.dev, and Material Design references
- Playwright live browser checks for `https://yioo.link/notes/` and
  `https://yioo.link/notes/2026-06-26-test-note/`
- Playwright screenshots:
  - `output/playwright/phase11-current-index-desktop.png`
  - `output/playwright/phase11-current-post-desktop.png`
  - `output/playwright/phase11-current-index-mobile.png`
  - `output/playwright/phase11-current-post-mobile.png`
- Playwright console and DOM checks for mobile overflow and image load state
- Node contrast spot-check script against current CSS color variables
- `git diff`
- `git status --short --branch`

Verification:

- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed.
- Live Playwright console check returned 0 errors and 0 warnings.
- Mobile index and representative post at 390x844 had no document-level
  horizontal overflow.
- Representative post images were complete with 1200x630 natural size.
- Desktop and mobile screenshots were inspected.
- Current design was recorded as an acceptable baseline with a 2026-06-28
  maintenance review score of 88/100.
- Contrast spot check found `--quiet` on `--background` at 2.94:1, which should
  be improved before future metadata-heavy design work.

Commit: `085ebfc` (`feat: add notes categories and design guidance`)
Push: Success to `origin/main` with the follow-up progress record commit.
Deployment/invalidation: none; documentation and audit only.
Rollback state: Revert the Phase 11 docs and `AGENTS.md` guidance changes only.
No runtime rollback is required.
Next step: Use `design-docs/` as the source of truth for future design guidance
and run mobile verification for every design change.

### Phase 12. Category implementation

Status: verified
Started: 2026-06-28
Finished: 2026-06-28
Scope: Implement one required category per published post, keep categories in
an editable registry, generate category archive pages, and verify the existing
two test posts through both rendering paths.
Files changed:

- `README.md`
- `content/posts/2026-06-26-script-publish-test.md`
- `content/posts/2026-06-26-test-note.md`
- `docs/category-strategy.md`
- `docs/findings.md`
- `docs/progress.md`
- `public/notes/styles.css`
- `scripts/publish-posts.mjs`
- `scripts/verify-build.mjs`
- `src/components/PostList.astro`
- `src/config/categories.json`
- `src/lib/categories.ts`
- `src/lib/posts.ts`
- `src/pages/notes/[slug]/index.astro`
- `src/pages/notes/categories/index.astro`
- `src/pages/notes/categories/[category]/index.astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/sitemap.xml.ts`
- `src/styles/global.css`

Related skill update:

- `C:\Users\love_\.codex\skills\yioo-notes-apply\SKILL.md`

Commands run:

- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- `npm.cmd run publish:posts -- --no-upload`
- `npm.cmd run verify:build`
- Generated output inspections for:
  - `dist/notes/posts.manifest.json`
  - `dist/notes/sitemap.xml`
  - `dist/notes/categories/index.html`
  - `dist/notes/categories/implementation/index.html`
- `python C:\Users\love_\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\love_\.codex\skills\yioo-notes-apply`

Verification:

- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed and generated:
  - `/notes/categories/`
  - `/notes/categories/implementation/`
  - the two existing test post pages
  - `posts.manifest.json`
  - `sitemap.xml`
- `npm.cmd run verify:build` passed after the Astro build.
- `npm.cmd run publish:posts -- --no-upload` rendered two published posts to
  `dist/notes` without uploading.
- `npm.cmd run verify:build` passed after the content-only publish output.
- `posts.manifest.json` includes resolved category metadata for both test posts:
  `id`, `label`, `url`, and `canonicalUrl`.
- `sitemap.xml` includes `https://yioo.link/notes/categories/` and
  `https://yioo.link/notes/categories/implementation/`.
- The `implementation` category page includes both existing test posts.
- The `yioo-notes-apply` skill validates after adding category workflow rules.

Commit: `085ebfc` (`feat: add notes categories and design guidance`)
Push: Success to `origin/main` with the follow-up progress record commit.
Deployment/invalidation: none; Phase 12 was locally verified only.
Rollback state: Revert Phase 12 category source files and post frontmatter
changes, rebuild `dist/notes`, and keep Phase 11 design guidance untouched.
Because no deployment was made, no S3 or CloudFront rollback is required.
Next step: Deploy separately with `publish:posts` if category pages should go
live, then verify `/notes/categories/` and
`/notes/categories/implementation/`.

### Phase 13. Research essay agent instructions

Status: locally verified (instruction configuration only)
Started: 2026-08-11
Finished: 2026-08-11
Scope: Add a repository-scoped workflow that turns topics, shared
conversations, research TODOs, and existing notes into evidence-backed Korean
essay drafts, pauses for author feedback, verifies the revision, and requires
separate explicit approval before handing production work to the existing
notes publishing skill.
Files changed:

- `AGENTS.md`
- `.agents/skills/research-essay-publisher/SKILL.md`
- `.agents/skills/research-essay-publisher/agents/openai.yaml`
- `.agents/skills/research-essay-publisher/references/site-profile.md`
- `.agents/skills/research-essay-publisher/references/research-editorial.md`
- `.agents/skills/research-essay-publisher/references/seo-images.md`
- `.agents/skills/research-essay-publisher/references/review-publishing.md`
- `docs/findings.md`
- `docs/progress.md`

Commands run:

- `python %USERPROFILE%\.codex\skills\.system\skill-creator\scripts\init_skill.py research-essay-publisher --path .agents\skills --resources references ...`
- `$env:PYTHONUTF8='1'; python %USERPROFILE%\.codex\skills\.system\skill-creator\scripts\quick_validate.py .agents\skills\research-essay-publisher`
- `git diff --check`
- Reference-file existence and scaffold-marker checks

Verification:

- Official skill validation passed in UTF-8 mode.
- The core skill is 68 lines and all four referenced guidance files exist.
- No initializer placeholders remain; intentional uses of the word `TODO`
  describe research inputs and placeholder checks.
- `git diff --check` passed.
- The publish path delegates to `yioo-notes-apply`; no post, generated site
  artifact, S3 object, CloudFront cache, commit, or remote branch changed.
- This phase validates instruction structure and safety gates only. A real
  essay-authoring run and production publication were intentionally not
  performed.
- First-run correction on 2026-08-11: the site profile's canonical example was
  changed from `/notes/posts/{slug}/` to the authoritative `/notes/{slug}/`
  route after comparison with both renderers, both existing posts, and the
  implementation plan. UTF-8-mode skill validation passed after correction.

Commit: none.
Push: none.
Deployment/invalidation: none; instruction configuration only.
Rollback state: Remove the new repository skill and the Phase 13 `AGENTS.md`,
findings, and progress entries. No runtime rollback is required.
Next step: Invoke `$research-essay-publisher` with a topic or shared research
source; the workflow should stop at `WAITING_FOR_AUTHOR_FEEDBACK` after staging
its draft outside public paths.

### Phase 14. Publish the LLM Wiki research essay

Status: published and live-verified
Started: 2026-08-12
Finished: 2026-08-12
Operation: New post
Slug: `2026-08-11-how-to-use-llm-wiki`
Live URL: `https://yioo.link/notes/2026-08-11-how-to-use-llm-wiki/`
Scope: Publish the explicitly approved Korean research essay and only its two
approved WebP assets. Keep the source ledger and SVG authoring files private.
Files published:

- `content/posts/2026-08-11-how-to-use-llm-wiki.md`
- `public/notes/assets/posts/2026-08-11-how-to-use-llm-wiki/cover.webp`
- `public/notes/assets/posts/2026-08-11-how-to-use-llm-wiki/memory-layers.webp`

Commands run:

- `npm.cmd run check`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki --no-upload`
- `npm.cmd run verify:build`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki`
- Live HTTP readback for the post, both images, notes index, manifest, sitemap,
  implementation category, stylesheet, root, API health, and tools page
- Playwright desktop and 390px mobile checks for the live index and post

Verification:

- The repository check passed with 0 errors, 0 warnings, and 0 hints.
- The content-only renderer produced three published posts, and
  `verify:build` passed for HTML, assets, manifest, sitemap, and SEO routes.
- The live post, both WebP assets, notes index, manifest, sitemap,
  implementation category, stylesheet, site root, API health, and tools page
  all returned HTTP 200 with the expected content types.
- Live index, manifest, sitemap, category archive, post HTML, cover reference,
  and body-diagram reference all contain the expected slug or canonical URL.
- Live desktop and 390px mobile browser checks showed no horizontal overflow;
  both images loaded at their expected natural dimensions, and the browser
  console reported 0 errors and 0 warnings.
- The source ledger and SVG authoring sources remain under `content/drafts/`
  and were not uploaded to public paths.

Deployment/invalidation: Uploaded through the repository publishing script to
`s3://yioo-notes/notes`; CloudFront distribution `EWYEJXEIKC81C` invalidation
`I1J86V6VUQI7190CQKD990MRFF` completed successfully.
Rollback state: Remove the post Markdown and its slug-scoped public asset
directory, rerun the publishing script so generated indexes and S3 reflect the
removal, invalidate `/notes*` and `/notes/*`, and verify the post and both asset
URLs are absent while the notes index, manifest, sitemap, and category remain
valid.

### Phase 15. Unpublish and privately archive legacy test notes

Status: unpublished and live-verified
Started: 2026-08-12
Finished: 2026-08-12
Operation: Unpublish two legacy test posts with recoverable private archival
Slugs: `2026-06-26-test-note`, `2026-06-26-script-publish-test`
Scope: Remove both test posts and their scoped assets from the public build and
live Notes surface so `2026-08-11-how-to-use-llm-wiki` is the first and only
published note. Retain the test sources and assets under `content/private/`.
Files changed:

- `content/posts/2026-06-26-test-note.md` moved to `content/private/`
- `content/posts/2026-06-26-script-publish-test.md` moved to `content/private/`
- Both test asset folders moved from `public/notes/assets/posts/` to
  `content/private/assets/`
- `scripts/verify-build.mjs`
- `README.md`

Commands run:

- `npm.cmd run check`
- `npm.cmd run publish:posts -- --no-upload`
- `npm.cmd run verify:build`
- Generated manifest/index/category/sitemap and archive-integrity assertions
- `npm.cmd run publish:posts`
- Live HTTP and S3 object readback for removed and retained surfaces

Verification:

- The repository check passed with 0 errors, 0 warnings, and 0 hints.
- The full no-upload publisher rendered exactly one post, and the build
  verifier passed using the remaining LLM Wiki post and its two images.
- Generated and live manifest data contain exactly one post with slug
  `2026-08-11-how-to-use-llm-wiki`; index, category, and sitemap contain that
  slug and neither legacy slug.
- Both old live post URLs and both old asset URLs return 403 after invalidation.
- Authoritative S3 readback returns zero keys for all four legacy prefixes.
- The LLM Wiki post, both images, notes/discovery pages, root, API health, and
  tools page all return 200.
- Archived asset Git blob hashes match their formerly public versions.

Deployment/invalidation: Full notes sync to `s3://yioo-notes/notes` deleted the
four legacy objects; CloudFront distribution `EWYEJXEIKC81C` invalidation
`ICAFF6OSAGI0CBVRYQJSSZ0V1K` completed successfully.
Rollback state: Move both Markdown files and both asset folders back to their
original public paths, restore `status: published`, revert the verifier/README
fixture updates, run `npm.cmd run publish:posts`, and verify both slugs return
to the manifest, sitemap, category archive, S3, and live URLs.

### Phase 16. Draft humanization and publish-time AI disclosure workflow

Status: locally verified (instruction and validator changes only)
Started: 2026-08-13
Finished: 2026-08-13
Scope: Make Korean research essays run through a post-draft Korean editorial
pass while keeping the AI disclosure outside the humanization input and
working article. Add the exact approved disclosure only during the authorized
production handoff.
Files changed:

- `AGENTS.md`
- `.agents/skills/research-essay-publisher/SKILL.md`
- `.agents/skills/research-essay-publisher/references/review-publishing.md`
- `%USERPROFILE%\.codex\skills\humanize-korean\SKILL.md`
- `%USERPROFILE%\.codex\skills\humanize-korean\references\quick-rules.md`
- `%USERPROFILE%\.codex\skills\humanize-korean\references\quick-rules.header.md`
- `%USERPROFILE%\.codex\skills\humanize-korean\references\quick-rules.footer.md`
- `%USERPROFILE%\.codex\skills\humanize-korean\scripts\verify_change_rate.py`
- `%USERPROFILE%\.codex\skills\yioo-notes-apply\SKILL.md`
- `%USERPROFILE%\.codex\skills\yioo-notes-apply\scripts\verify_ai_disclosure.py`
- `content/drafts/2026-08-11-how-to-use-llm-wiki.md`
- `content/drafts/2026-08-11-how-to-use-llm-wiki.sources.md`
- `docs/post-todos/2026-08-13-llm-wiki-humanize-comparison.md`
- `docs/findings.md`
- `docs/progress.md`

Commands run:

- Official `quick_validate.py` for all three skills
- Deterministic change-rate verification for the current published and local
  LLM Wiki article bodies
- Positive Markdown and HTML exact-once disclosure fixtures
- Expected-failure disclosure check against the no-disclosure working draft
- `npm.cmd run check`
- `git diff --check`
- Live HTTP readback of the existing LLM Wiki post
- Independent read-only forward test, followed by a second pass after fixes

Verification:

- All three skills passed official structural validation.
- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- The change-rate script returned `pass` for the current conservative edit.
- The disclosure verifier passed one exact Markdown footer and one rendered
  HTML disclosure, and correctly rejected a draft with no disclosure.
- The first independent forward test found four instruction issues: a stale
  nonexistent change-rate verifier reference, an undefined `REVISION_READY`
  transition, proposed/approved field ambiguity, and a ledger that would remain
  pending after publication. All four were corrected.
- The second independent read-only forward test returned PASS with no new P0,
  P1, P2, or step-number issue. It also confirmed duplicate HTML disclosure is
  rejected.
- The local LLM Wiki working article contains no disclosure. Its private
  ledger records `status: proposed`, drafting-time model provenance, and the
  proposed exact public line.
- `content/posts/` and public post assets were not changed. The live post
  returned HTTP 200 with its existing wording and no AI disclosure.

Commit: none.
Push: none.
Deployment/invalidation: none.
Rollback state: Revert the Phase 16 instruction and validator changes and keep
the existing live post untouched. No S3 or CloudFront rollback is required.
Next step: Use the new lifecycle on the next author-approved essay publish:
`proposed -> approved -> exact-once insertion -> applied`.

### Phase 17. Publish the approved LLM Wiki revision

Status: published and live-verified
Started: 2026-08-13
Finished: 2026-08-13
Scope: Publish the author-approved Korean editorial revision of the first
LLM Wiki post, add the approved AI disclosure exactly once during production
promotion, verify the rendered and live result, and record the publication
provenance transition.
Planned production source:

- `content/drafts/2026-08-11-how-to-use-llm-wiki.md`
- `content/drafts/2026-08-11-how-to-use-llm-wiki.sources.md`

Approval: The author explicitly approved publishing the current changed
version on 2026-08-13.
Files changed:

- `content/posts/2026-08-11-how-to-use-llm-wiki.md`
- `content/drafts/2026-08-11-how-to-use-llm-wiki.sources.md` (private ledger)
- `docs/post-todos/2026-08-13-llm-wiki-humanize-comparison.md` (private review record)
- `.agents/skills/research-essay-publisher/references/review-publishing.md`
- `%USERPROFILE%\.codex\skills\yioo-notes-apply\SKILL.md`
- `%USERPROFILE%\.codex\skills\yioo-notes-apply\scripts\verify_ai_disclosure.py`
- `docs/progress.md`

Commands run:

- Final independent read-only draft verification
- `python .../verify_change_rate.py --before ... --after ... --ignore-markup`
- Official `quick_validate.py` for `research-essay-publisher` and
  `yioo-notes-apply`
- Markdown and rendered-HTML exact-once disclosure validation
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki --no-upload`
- `npm.cmd run verify:build`
- `git diff --check`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki`
- Live HTTP, S3 object, and CloudFront invalidation readback

Verification:

- The independent final verifier returned PASS with no P0 or P1. Its two
  private-record P2 findings were corrected before production handoff.
- The Korean edit changed 1.6% of reference tokens with markup ignored and
  preserved the article's claims, links, numbers, code spans, tables, title,
  slug, category, canonical URL, and images.
- Astro check passed with 0 errors, 0 warnings, and 0 hints.
- The dry-run publisher rendered exactly one post, and build verification
  passed for the post, assets, manifest, sitemap, and SEO URLs.
- The approved disclosure appears exactly once in Markdown, rendered HTML,
  authoritative S3 HTML, and the live page.
- The live post, notes index, manifest, cover, and body image all return 200.
- Live and S3 readback contain the revised introduction and modified date
  `2026-08-13`, and no longer contain the replaced introduction.

Deployment/invalidation: Published to `s3://yioo-notes/notes`; CloudFront
distribution `EWYEJXEIKC81C` invalidation
`IBK6K0FS9DWHWTRWXS2KTXR78F` completed successfully.
Live URL: `https://yioo.link/notes/2026-08-11-how-to-use-llm-wiki/`
Rollback state: Restore the previous Markdown body and `updated: 2026-08-12`,
remove the single disclosure footer, run the slug-scoped publisher again, and
verify the old wording and metadata on S3 and the live URL.
Commit: This phase record is included in the scoped publication commit.

### Phase 20. Simplify the agent-completion definition

Status: published and live-verified
Started: 2026-08-14
Finished: 2026-08-14
Operation: Update post wording
Slug: `2026-08-12-how-to-verify-ai-agent-completion`
Scope: Replace one dense thesis sentence with a two-sentence explanation that
preserves the distinction between agent self-report, the actual result, and
readback from the user surface or final store. Preserve all metadata, links,
assets, citations, and the approved disclosure.
Files changed:

- `content/posts/2026-08-12-how-to-verify-ai-agent-completion.md`
- `docs/progress.md`

Commands run:

- Markdown and rendered-HTML exact-once disclosure validation
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --slug 2026-08-12-how-to-verify-ai-agent-completion --no-upload`
- `npm.cmd run verify:build`
- `git diff --check`
- `npm.cmd run publish:posts -- --slug 2026-08-12-how-to-verify-ai-agent-completion`
- Live post, manifest, category, root, API health, tools, and invalidation readback

Verification:

- The replacement sentence appears exactly once in source and rendered HTML;
  the previous sentence is absent.
- Astro check passed with 0 errors, 0 warnings, and 0 hints.
- The dry-run publisher rendered two posts and `verify:build` passed.
- The approved AI disclosure remains exactly once at the article end in
  Markdown, rendered HTML, and live HTML.
- The live post, manifest, category archive, root site, API health, and tools
  page returned HTTP 200. Manifest and category still include the post.

Deployment/invalidation: Published to `s3://yioo-notes/notes`; CloudFront
distribution `EWYEJXEIKC81C` invalidation
`IAVHM8YCM5M54ESIMRUAWUWOFN` completed successfully.
Live URL: `https://yioo.link/notes/2026-08-12-how-to-verify-ai-agent-completion/`
Rollback state: Restore the prior thesis sentence, run the slug-scoped
publisher, and verify the old wording returns while the disclosure remains
exactly once.
Commit: This phase record is included in the scoped wording-update commit.

### Phase 21. Add a plain-Korean gate to research essays

Status: locally verified (instruction change only)
Started: 2026-08-14
Finished: 2026-08-14
Scope: Persist the author's preference for shorter, natural Korean sentences
and prevent English clause order, stacked modifiers, and abstract-noun chains
from surviving the Korean editorial and final-verifier stages.
Files changed:

- `.agents/skills/research-essay-publisher/SKILL.md`
- `.agents/skills/research-essay-publisher/references/research-editorial.md`
- `.agents/skills/research-essay-publisher/references/review-publishing.md`
- `docs/findings.md`
- `docs/progress.md`

Verification:

- The official skill validator returned `Skill is valid!`.
- The skill core remains concise at 80 lines, all referenced instruction files
  exist, and checks found no missing final newline, replacement character,
  conflict marker, trailing whitespace, or `git diff --check` error.
- A read-only forward test rewrote one dense definition into three natural
  Korean sentences. It preserved the required outcome, persistence and
  authoritative-readback conditions, as well as the exception for low-impact,
  easily reversible changes.
- No content post, public asset, generated site, S3 object, CloudFront state,
  or live page changed.

Deployment/invalidation: none; instruction-only change.
Rollback state: Revert the Phase 21 skill and documentation changes. No
runtime or content rollback is required.
Commit: This phase record is included in the scoped skill-update commit.

### Phase 18. Use Yioo as the public editorial identity

Status: published and live-verified
Started: 2026-08-14
Finished: 2026-08-14
Scope: Replace the first post's public editorial reviewer name from `Karahe`
to `Yioo`, preserve the exact-once disclosure contract, and make `Yioo` the
default public identity in the reusable research-essay skill.
Approval: The author explicitly approved the wording change and immediate
publication on 2026-08-14.
Files changed:

- `content/posts/2026-08-11-how-to-use-llm-wiki.md`
- `.agents/skills/research-essay-publisher/references/review-publishing.md`
- `content/drafts/2026-08-11-how-to-use-llm-wiki.sources.md` (private ledger)
- `docs/post-todos/2026-08-13-llm-wiki-humanize-comparison.md` (private review record)
- `docs/findings.md`
- `docs/progress.md`

Commands run:

- Official `quick_validate.py` for `research-essay-publisher`
- Markdown and rendered-HTML exact-once disclosure validation
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki --no-upload`
- `npm.cmd run verify:build`
- `git diff --check`
- `npm.cmd run publish:posts -- --slug 2026-08-11-how-to-use-llm-wiki`
- Live HTTP, S3 object, and CloudFront invalidation readback

Verification:

- The reusable skill passed structural validation and now records `Yioo` as
  the default editorial reviewer and disclosure identity.
- Astro check passed with 0 errors, 0 warnings, and 0 hints.
- The dry-run publisher and build verifier passed for the post, assets,
  manifest, sitemap, and SEO URLs.
- The new line appears exactly once in source Markdown, rendered HTML,
  authoritative S3 HTML, and the live page; the former `Karahe` line is absent
  from all four surfaces.
- The post and rendered metadata use `updated: 2026-08-14`, matching the final
  Korean-time publication date.
- The live post, notes index, manifest, two images, root site, API health, and
  tools page all return 200.

Deployment/invalidation: Published to `s3://yioo-notes/notes`; CloudFront
distribution `EWYEJXEIKC81C` invalidation
`I96XPY52PJER0N31HDK67G58KP` completed successfully.
Live URL: `https://yioo.link/notes/2026-08-11-how-to-use-llm-wiki/`
Rollback state: Restore `Karahe` in the post disclosure and prior skill
template, run the slug-scoped publisher, and verify the previous line once on
S3 and the live URL.
Commit: This phase record is included in the scoped identity-update commit.

### Phase 19. Publish the agent-completion verification essay

Status: published and live-verified
Started: 2026-08-14
Finished: 2026-08-14
Operation: New post
Slug: `2026-08-12-how-to-verify-ai-agent-completion`
Live URL: `https://yioo.link/notes/2026-08-12-how-to-verify-ai-agent-completion/`
Scope: Publish the explicitly approved Korean research essay, promote only its
approved WebP diagram, add the approved AI disclosure exactly once, and keep
the private source ledger and SVG authoring source out of public paths.
Approval: The author explicitly sent `게시 승인` on 2026-08-14.
Files published:

- `content/posts/2026-08-12-how-to-verify-ai-agent-completion.md`
- `public/notes/assets/posts/2026-08-12-how-to-verify-ai-agent-completion/evidence-ladder.webp`

Private provenance updated:

- `content/drafts/2026-08-12-how-to-verify-ai-agent-completion.sources.md`
- Disclosure line: `Researched and drafted with OpenAI Codex using GPT‑5.6 Sol (xhigh reasoning). Editorial review and final approval by Yioo.`

Commands run:

- Independent read-only final verification after approval
- Markdown and rendered-HTML exact-once disclosure validation
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --slug 2026-08-12-how-to-verify-ai-agent-completion --no-upload`
- `npm.cmd run verify:build`
- `git diff --check`
- `npm.cmd run publish:posts -- --slug 2026-08-12-how-to-verify-ai-agent-completion`
- Live HTTP, manifest, sitemap, category, S3 object, and CloudFront invalidation readback
- Live Chromium checks at 1440×1000 and 390×844

Verification:

- The post-approval independent verifier returned PASS with no P0, P1, or P2;
  the approved draft SHA-256 remained
  `bc87b35e34597299bbeb87eacdaad90fe3e9b361225ea1fc8ba54e736beaf5b7`.
- Astro check passed with 0 errors, 0 warnings, and 0 hints.
- The dry-run publisher rendered exactly two published posts, and the build
  verifier passed for HTML, assets, manifest, sitemap, and SEO routes.
- The approved disclosure appears exactly once at the end of source Markdown,
  rendered HTML, and the live page.
- Live post, image, notes index, manifest, sitemap, implementation category,
  stylesheet, root site, API health, and tools page all returned HTTP 200 with
  expected content types.
- Live manifest contains exactly two posts and includes both this post and the
  existing LLM Wiki post. The sitemap and category archive include the new
  slug.
- The public WebP is byte-identical to the approved draft asset and S3 reports
  `image/webp` with 102,964 bytes. The private source ledger and SVG are absent
  from the rendered post and public asset directory.
- Desktop and 390px mobile Chromium checks showed no page-level horizontal
  overflow, one fully loaded 1200×1040 diagram, one disclosure block, and zero
  browser console errors or warnings. The long code block uses internal
  horizontal scrolling on mobile without widening the page.

Deployment/invalidation: Uploaded through the repository publisher to
`s3://yioo-notes/notes`; CloudFront distribution `EWYEJXEIKC81C` invalidation
`I47Y5X78WI70925UB33KMP0186` completed successfully.
Rollback state: Remove the new post Markdown and its slug-scoped public WebP,
run the full publisher so manifest, sitemap, category pages, and S3 remove the
slug, invalidate `/notes*` and `/notes/*`, and verify the old URL and asset are
absent while the existing LLM Wiki post and service boundaries remain healthy.
Commit: This phase record is included in the scoped publication commit.

### Phase 22. Add repository Korean editorial guidance

Status: verified
Started: 2026-08-16
Finished: 2026-08-16
Scope: Add a repository-owned Korean sentence and terminology guide, separate
its responsibility from the `humanize-korean` prose pass, and make future
research essays discover the guide through `AGENTS.md`.
Files changed:

- `docs/korean-editorial-guide.md`
- `AGENTS.md`
- `docs/progress.md`
- `docs/findings.md`

Verification:

- The guide distinguishes established standards, industry terms, emerging
  terms, and article-specific editorial synthesis.
- It gives a context-sensitive translation rule for `contract` and a starter
  table for other frequently literal technical translations.
- It includes sentence-level before/after examples, a drafting and publication
  checklist, and a private terminology-ledger template.
- `AGENTS.md` makes terminology review part of drafting and final verification
  without changing the existing `humanize-korean` workflow or publication
  approval gates.
- Documentation links and Markdown structure were checked locally. No build,
  upload, deployment, cache invalidation, commit, or push was performed.

Deployment/invalidation: none
Rollback state: Remove the guide and its `AGENTS.md`, progress, and findings
references. No runtime rollback is required.
Commit: not created

### Phase 23. Apply Korean editorial guidance to unpublished drafts

Status: verified
Started: 2026-08-16
Finished: 2026-08-16
Scope: Revise seven unpublished drafts, their private terminology ledgers, and
matching draft-only diagrams using the repository Korean editorial guide. The
two draft mirrors of already-published posts remain out of scope.

Verification:

- All seven articles remain `status: draft`; no AI disclosure was inserted.
- All 90 body URLs are present in the matching private source ledgers.
- No matching production post or public post-asset directory exists.
- Comment-free humanize rate checks passed at 16.87%, 20.54%, 25.59%, 15.62%,
  16.82%, 20.21%, and 23.08%.
- Five changed SVGs were re-rendered to WebP and visually checked. All seven
  SVG/WebP pairs retain their documented dimensions and readable labels.
- `npm.cmd run check`: 18 files, 0 errors, 0 warnings, 0 hints.
- Independent read-only verification returned PASS with P0 0, P1 0, P2 0.

Deployment/invalidation: none
Rollback state: Revert only the Phase 23 prose, private terminology records,
workspace comparison artifacts, and regenerated draft-only diagrams. No
runtime rollback is required.
Commit: not created

### Phase 24. Schedule the long-agent-task-control publication

Status: scheduled
Started: 2026-08-17
Scheduled run: 2026-08-21 09:00 Asia/Seoul
Scope: Record publication approval for the verified long-agent-task-control
essay, update the repository Korean wording rules, and create a one-run Codex
automation for the complete production handoff.
Files changed before the scheduled run:

- `docs/korean-editorial-guide.md`
- `docs/findings.md`
- `docs/progress.md`
- `content/drafts/2026-08-16-long-agent-task-control.sources.md` (private)

Verification:

- The article body already uses `합리적인 방식` and `완료 기록`; no public-body
  replacement was needed.
- The editorial guide now distinguishes negative `cheap` from neutral or
  positive `reasonable`, and maps ordinary `evidence` wording to its actual
  function such as 근거, 완료 기록, 확인 결과, or 검증 결과.
- The approved draft and two assets are pinned by SHA-256 in the private
  source ledger and the scheduled task prompt.
- The AI disclosure ledger is `approved`; the disclosure remains absent from
  the draft and will be inserted only by yioo-notes-apply during the production
  handoff.
- Codex automation `publish-long-agent-task-control` is `ACTIVE`, targets the
  local `yioo-notes` project, and is configured for one run on the requested
  date.
- The task is instructed to stop before mutation on any hash, ledger,
  destination, or preflight mismatch and to require live readback before
  declaring publication complete.

Deployment/invalidation: none at scheduling time
Rollback state: Pause or delete the Codex automation. No runtime content needs
rollback because the production handoff has not run.
Commit: not created at scheduling time

### Phase 25. Harden the Notes publication entry points

Status: verified; no production mutation
Started: 2026-08-19
Finished: 2026-08-19
Scope: Apply the approved H-05 and M-10 publication safeguards plus the small
M-11 rendering defense, then update every documented and scheduled consumer.

Implementation:

- `scripts/deploy.ps1` checks every native command exit, always runs the build
  verifier even with `-SkipBuild`, validates the AWS account/bucket/region and
  CloudFront target, shows the S3 sync/delete dry run, and requires
  `-ConfirmFullRelease` for production.
- `scripts/publish-posts.mjs` defaults to local-only, rejects the misleading
  `--slug` form, uses `--require-slug` only as a release-presence assertion,
  validates and inventories the full release, and requires
  `--upload --confirm-full-release` for production.
- Astro and the content-only renderer now share the same safe Markdown and
  JSON-in-script helpers. Raw Markdown HTML is rendered as text, unsafe link
  and image schemes are removed, and script-closing JSON text is escaped.
- README, the repository essay handoff, implementation plan, installed
  `yioo-notes-apply` skill, and active 2026-08-21 automation use the revised
  full-release contract.

Verification:

- `npm.cmd run test:security`: PASS. Default publishing made no AWS call;
  legacy slug and unconfirmed mutation failed closed; build and verifier
  failures stopped before AWS, including the `-SkipBuild` path.
- `npm.cmd run check`: 20 files, 0 errors, 0 warnings, 0 hints.
- Local representative publish with `--require-slug` rendered and verified 12
  release files without calling AWS.
- Content-only and full Astro AWS dry runs both verified the current account,
  versioned `yioo-notes` bucket in `ap-northeast-1`, and the deployed CloudFront
  distribution. The sync preview contained uploads only and no deletion.
- The full Astro entry point rebuilt five pages and passed `verify:build`
  before the AWS preview. No upload or invalidation was run.
- The installed publishing skill passed `quick_validate.py`; an independent
  read-only forward test selected the new local, AWS-preview, explicit upload,
  and live-readback sequence without being told the implementation details.

Deployment/invalidation: none
Rollback state: Revert the Phase 25 code/docs commit and restore the prior
installed skill and automation prompt. No S3 or CloudFront content rollback is
needed because only dry runs were performed.

### Phase 26. Publish the long-agent task control essay

Status: published and live-verified
Started: 2026-08-21
Finished: 2026-08-21
Operation: New post
Slug: `2026-08-16-long-agent-task-control`
Live URL: `https://yioo.link/notes/2026-08-16-long-agent-task-control/`
Scope: Publish the scheduled, explicitly approved Korean research essay,
promote its approved SVG/WebP assets, append the approved AI disclosure once,
and preserve every unrelated draft/research artifact outside the public build
and scoped Git commit.

Files published:

- `content/posts/2026-08-16-long-agent-task-control.md`
- `public/notes/assets/posts/2026-08-16-long-agent-task-control/recovery-choice.svg`
- `public/notes/assets/posts/2026-08-16-long-agent-task-control/recovery-choice.webp`

Commands:

- `npm.cmd run test:security`
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-long-agent-task-control`
- `npm.cmd run verify:build`
- Markdown and rendered-HTML AI disclosure exact-once checks
- Local manifest, sitemap, category, private-output, and 52-link checks
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-long-agent-task-control --dry-run`
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-long-agent-task-control --upload --confirm-full-release`
- AWS S3/CloudFront and live HTTP/body readback

Verification:

- Approved draft, SVG, and WebP SHA-256 values matched before promotion. The
  promoted post differs from the approved draft only by `status: published`
  and the approved disclosure footer.
- Security regression tests passed. Astro check passed with 20 files, 0
  errors, 0 warnings, and 0 hints. The full local release rendered 3 posts and
  15 files; `verify:build`, disclosure, manifest, sitemap, category, asset,
  private-output, and local-link checks passed.
- AWS preflight confirmed account `948654497054`, versioned bucket
  `yioo-notes` in `ap-northeast-1`, and distribution `EWYEJXEIKC81C`. The
  complete preview contained 10 uploads and 0 deletions. The two existing post
  HTML upload actions were byte-identical timestamp reconciliations.
- S3 readback returned versioned post/SVG/WebP/manifest/sitemap objects with
  expected sizes, MIME types, cache metadata, and ETags matching local MD5.
- Live post, SVG, WebP, notes index, implementation category, manifest, notes
  sitemap, root sitemap, root site, API health, tools route, and stylesheet all
  returned HTTP 200 with expected content types.
- Live post, manifest, and notes sitemap were byte-identical to the final local
  release. Live SVG/WebP SHA-256 values matched the approved assets. Index,
  category, manifest, and notes sitemap include the slug; robots advertises the
  dedicated notes sitemap and the root sitemap documents that delegation.
- The approved AI disclosure appears exactly once at the article end in source
  Markdown, rendered HTML, and the live URL.

Deployment/invalidation: Full release uploaded to `s3://yioo-notes/notes`;
CloudFront invalidation `IF222BPFRVMMK7M14X0OCDJSZ3` completed.
Rollback: Revert the scoped content commit, remove the new post Markdown and
slug-scoped public assets, run the local publisher and AWS dry run without a
slug assertion, then publish with `--upload --confirm-full-release`; verify
the slug is absent from S3, manifest, sitemap, category, and live URLs while
root/API/tools remain healthy.
Commit: This phase record is included in the scoped publication commit.

### Phase 29. Publish the data-canonical-before-formulas essay

Status: published and live-verified
Started: 2026-08-26 18:03 Asia/Seoul
Finished: 2026-08-26 18:20 Asia/Seoul
Operation: New post
Slug: `2026-08-16-data-canonical-before-formulas`
Live URL: `https://yioo.link/notes/2026-08-16-data-canonical-before-formulas/`
Scope: Publish only the scheduled, explicitly approved formula-review essay,
promote its pinned SVG/WebP assets, append the exact approved AI disclosure
once, preserve every unrelated draft/research artifact, and leave the
uncommitted `finance` category configuration out of this publication commit.

Files published:

- `content/posts/2026-08-16-data-canonical-before-formulas.md`
- `public/notes/assets/posts/2026-08-16-data-canonical-before-formulas/data-lineage.svg`
- `public/notes/assets/posts/2026-08-16-data-canonical-before-formulas/data-lineage.webp`

Commands:

- `npm.cmd run test:security`
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-data-canonical-before-formulas`
- `npm.cmd run verify:build`
- Markdown, rendered-HTML, S3, link, metadata, category, manifest, sitemap, and private-output checks
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-data-canonical-before-formulas --dry-run`
- `npm.cmd run publish:posts -- --require-slug 2026-08-16-data-canonical-before-formulas --upload --confirm-full-release`
- CloudFront invalidation, authoritative S3 object, and live HTTP/body readback

Verification:

- Approved draft, SVG, and WebP SHA-256 values matched before promotion. The
  promoted Markdown differs from the approved draft only by `status:
  published` and the exact approved disclosure footer.
- The formula limitation is preserved: its conditions were checked, but it was
  not executed in a live Excel or Google Sheets UI. The public article still
  discloses product and locale differences and makes no execution-test claim.
- Security regression passed. Astro check passed with 23 files and zero
  errors, warnings, or hints. The local full release rendered 4 posts and 18
  files; `verify:build`, exact-once disclosure, metadata, manifest, sitemap,
  implementation category, private-output, and 56-link checks passed.
- The exact authorized `finance` object remained a local unstaged
  configuration change. No finance archive, category link, manifest category,
  sitemap entry, S3 prefix, or draft content entered the release.
- AWS preflight confirmed account `948654497054`, versioned private bucket
  `yioo-notes` in `ap-northeast-1`, and distribution `EWYEJXEIKC81C`. The
  complete preview contained 11 uploads and 0 deletions. Three existing post
  HTML actions were byte-identical timestamp reconciliations; the remaining
  actions were the new post/assets and the expected generated index, category,
  manifest, and sitemap updates.
- S3 readback returned versioned post, SVG, WebP, indexes, manifest, sitemap,
  and stylesheet objects with expected sizes, MIME types, cache metadata, and
  ETags matching local MD5. Live post/assets/index/category/manifest/sitemaps,
  robots, root, API health, tools, and stylesheet returned HTTP 200 with the
  expected content types.
- Live post, assets, notes index, implementation category, categories index,
  manifest, notes sitemap, and stylesheet are byte-identical to the local
  release. The SVG/WebP live SHA-256 values match the approved assets. All 14
  unique live post links returned 200. The root sitemap contains its Notes
  delegation comment once, and robots advertises the dedicated Notes sitemap
  once.
- The approved AI disclosure appears exactly once at the article end in source
  Markdown, rendered HTML, authoritative S3 HTML, and the live URL.

Deployment/invalidation: Full release uploaded to `s3://yioo-notes/notes`;
CloudFront invalidation `I6RQ334R7NITZ8QKNDRX0FCR6F` completed.
Rollback: Revert the scoped content commit, remove the new post Markdown and
slug-scoped public assets, run the local publisher and complete AWS dry run
without a slug assertion, then publish with `--upload --confirm-full-release`;
verify the slug is absent from S3, manifest, sitemap, category, and live URLs
while root/API/tools remain healthy. Leave unrelated drafts and the finance
category change untouched.
Commit: This phase record is included in the scoped publication commit.

### Phase 30. Publish the cautious FIRE income strategy essay

Status: published and live-verified
Started: 2026-08-27 18:00 Asia/Seoul
Finished: 2026-08-27 18:19 Asia/Seoul
Operation: New post
Slug: `2026-08-25-cautious-fire-income-strategy`
Live URL: `https://yioo.link/notes/2026-08-25-cautious-fire-income-strategy/`
Scope: Publish only the scheduled, author-approved cautious FIRE essay and its
pinned SVG/WebP assets, include the exact approved `finance` category, preserve
the first-person meaning and removed defensive wording, and leave unrelated
draft/research/planning artifacts private and unstaged.

Files published:

- `content/posts/2026-08-25-cautious-fire-income-strategy.md`
- `public/notes/assets/posts/2026-08-25-cautious-fire-income-strategy/crow-fire-loop.svg`
- `public/notes/assets/posts/2026-08-25-cautious-fire-income-strategy/crow-fire-loop.webp`
- `src/config/categories.json` (exact approved active `finance` addition)

Commands:

- `npm.cmd run test:security`
- `npm.cmd run check`
- `npm.cmd run publish:posts -- --require-slug 2026-08-25-cautious-fire-income-strategy`
- `npm.cmd run verify:build`
- Markdown/rendered/live exact-once disclosure, metadata, link, category,
  manifest, sitemap, private-output, S3 identity, and protected-route checks
- `npm.cmd run publish:posts -- --require-slug 2026-08-25-cautious-fire-income-strategy --dry-run`
- `npm.cmd run publish:posts -- --require-slug 2026-08-25-cautious-fire-income-strategy --upload --confirm-full-release`

Verification:

- Draft/SVG/WebP SHA-256 values matched the approved identities before
  promotion. The promoted Markdown differs only by `status: published` and the
  approved disclosure footer.
- The approved first-person account, staged financial-independence goal,
  author-reported six-holding/approximately 7.1% snapshot, omitted defensive
  sentences, total-return/price/distribution/concentration/emergency-savings
  limits, and diagram without the removed disclaimer text are preserved.
- Security regression passed. Astro check passed with 23 files and zero errors,
  warnings, or hints. The local full release rendered 5 posts and 22 files;
  build, metadata, category, manifest, sitemap, disclosure, link, and
  private-output checks passed.
- AWS preflight confirmed account `948654497054`, versioned private bucket
  `yioo-notes` in `ap-northeast-1`, and distribution `EWYEJXEIKC81C`. The
  complete preview contained 13 explained uploads and 0 deletions.
- S3 contains exactly 22 release objects with no extra or missing key; every
  object size and ETag matches the local release. All 22 live files are
  byte-identical to local output after invalidation.
- Post, SVG, WebP, Notes index, finance archive, manifest, Notes sitemap, root
  sitemap, robots, root site, API health, tools route, and stylesheet return
  HTTP 200 with expected content types. Internal links pass, and external
  source targets resolve; two bot-protected targets required direct web
  readback after generic HTTP clients received 403.
- The approved disclosure line is exactly:
  `Researched and drafted with OpenAI Codex using GPT‑5.6 Sol (xhigh reasoning). Editorial review and final approval by Yioo.`
  It appears exactly once at the article end in Markdown, rendered HTML, S3,
  and the live URL.

Deployment/invalidation: Full release uploaded to `s3://yioo-notes/notes`;
CloudFront invalidation `IAYJG1MRLQ17NJZ0VFLM1Y21LE` completed.
Rollback: Revert the scoped content commit, remove the FIRE post Markdown and
slug-scoped public assets, restore the category registry if it has no remaining
finance consumer, run the local publisher and complete AWS dry run without a
slug assertion, then publish with `--upload --confirm-full-release`. Verify the
slug and finance archive are absent from S3/manifest/sitemap/live while
root/API/tools remain healthy. Preserve unrelated drafts and private ledgers.
Commit: This phase record is included in the scoped publication commit.
Push: Scoped commit pushed to `origin/main` with the repository deploy key.

### Phase 31. Improve Notes discovery, long-form reading, and RSS

Status: published and live-verified
Started: 2026-08-27
Finished: 2026-08-27 22:17 Asia/Seoul
Operation: Existing-site capability update
Scope: Localize Notes aggregation copy, add a static H2 table of contents,
site-wide and per-post social-image metadata, repeated-tag navigation, curated
related reading, and one RSS 2.0 feed. Keep Astro and the manual publication
renderer aligned, preserve public URLs and all approved disclosures, and keep
draft/private content outside the release.

Implemented behavior:

- Root, category, navigation, accessibility, metadata, and structured-data copy
  now use Korean while category IDs and canonical URLs remain stable.
- Every long post receives duplicate-safe Korean heading IDs and an open,
  collapsible H2 table of contents. Mobile fragment targets clear the sticky
  header without JavaScript.
- A 1200x630 Korean social card covers aggregation pages and posts without an
  explicit image; the LLM Wiki post keeps its existing 1200x630 cover.
- Only the repeated `ai-agent` and `workflow` tags receive public archives and
  sitemap URLs. Singleton tags remain labels rather than thin archive links.
- Four implementation essays expose curated related-reading links outside the
  article. The finance essay remains unlinked until a related finance post
  exists, and every AI disclosure remains the final content inside its article.
- `/notes/rss.xml` contains summaries for the five published posts, has page
  autodiscovery, and is uploaded as `application/rss+xml; charset=utf-8` by
  both deployment entry points.

Verification:

- `npm.cmd run test:security`, `npm.cmd run check`, `npm.cmd run build`,
  `npm.cmd run publish:posts`, and `npm.cmd run verify:build` passed.
- The final manual release contains 28 files, five RSS items, 12 sitemap URLs,
  12 HTML pages, zero missing internal links, no draft/private output, and one
  disclosure per source and rendered post.
- Desktop 1440x1000 plus mobile 390x844 and 360x740 browser checks passed with
  zero horizontal overflow, failed images, console errors, or warnings. The
  design score is 93/100.
- AWS preflight confirmed account `948654497054`, the versioned `yioo-notes`
  bucket in `ap-northeast-1`, and distribution `EWYEJXEIKC81C`. The full
  preview contained 18 explained uploads and zero deletions.
- After invalidation, S3 contained exactly the same 28 files as the local
  release; every object size and MD5-backed ETag matched. RSS, sitemap, HTML,
  and PNG content types matched their intended values.
- Fifteen Notes routes, root, root sitemap, robots, tools, and API health
  returned HTTP 200. RSS has five live items, the Notes sitemap has 12 URLs,
  the two repeated-tag archives contain two posts each, and a singleton tag
  archive remains absent with HTTP 403.

Deployment/invalidation: Full release uploaded to `s3://yioo-notes/notes`;
CloudFront invalidation `I6EI7E7K88QXMYVARQWDPM2ALN` completed.
Rollback: Revert the scoped capability commit, run the complete local
publisher and AWS dry run, and publish the understood prior full release with
`--upload --confirm-full-release`. S3 versioning remains enabled for object
recovery. Verify Notes and protected root/API/tools routes again. Preserve
unrelated drafts, scheduling records, and private ledgers.
Commit: This phase record is included in the scoped capability commit.
