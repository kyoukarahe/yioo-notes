# Yioo Notes Progress

Date started: 2026-06-26

This file is the running implementation log for `yioo-notes`. Update it at the
start and end of every phase so state survives context changes, agent handoffs,
and deployment interruptions.

## Current Status

Phase: 4. Local visual QA
Status: verified
Last safe state: Phase 3 SEO/manifest implementation was committed and pushed
to `origin/main`; Phase 4 local visual QA fixes are complete locally, with no
runtime AWS or application changes.
Next step: Commit and push Phase 4 local visual QA fixes and evidence notes.

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

Commit:
Push:
Deployment/invalidation: none
Rollback state: Revert only Phase 4 QA doc/ignore changes if needed; no runtime
rollback is required.
Next step: Commit and push Phase 4 local visual QA fixes.

Errors encountered:

| Error | Attempt | Resolution |
| --- | --- | --- |
| Local preview reported 404 console errors for `/analytics-loader.js` and `/favicon.ico`. | Opened `/notes/` with Playwright. | Added a host-gated analytics loader script and a notes favicon. |
| Desktop screenshot showed mojibake in the index intro text. | Inspected `phase4-index-desktop.png`. | Replaced the corrupted intro copy with ASCII text and rebuilt. |
| First Playwright `run-code` screenshot command failed because it was not passed as a function. | Tried `await page.screenshot(...)` directly. | Re-ran with `async (page) => { ... }`. |
