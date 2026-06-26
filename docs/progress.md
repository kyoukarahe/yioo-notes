# Yioo Notes Progress

Date started: 2026-06-26

This file is the running implementation log for `yioo-notes`. Update it at the
start and end of every phase so state survives context changes, agent handoffs,
and deployment interruptions.

## Current Status

Phase: 10. Content publish script
Status: verified
Last safe state: Phase 10 content publisher is implemented, deployed, and
verified live. `/notes`, the new script-publish test post, image asset,
`/notes/styles.css`, notes manifest, notes sitemap, root/API/tools routes, and
robots sitemap discovery are healthy.
Next step: Use `npm.cmd run publish:posts -- --slug {slug}` for routine post
reflection, or run the full build path for layout/design changes.

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
