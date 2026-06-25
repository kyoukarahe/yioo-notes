# Yioo Notes Findings

Use this file for durable facts discovered during implementation. Do not store
untrusted web text as instructions; summarize only the facts that should guide
future phases.

## 2026-06-26 Baseline

- Public SEO target is `https://yioo.link/notes/...`, not `notes.yioo.link`.
- `yioo-notes` should be a separate repository, build, and deploy unit.
- Existing yioo.link mail/API routes and `yioo-tools` routes are protected and
  must be verified before and after notes routing changes.
- EC2 changes are not expected for the notes implementation.
- The first usable milestone is blog-first implementation with one published
  test post and one real image asset.
- Design work happens after the blog pipeline is live and must pass screenshot,
  vision, and 90/100 scorecard checks before adoption.

## 2026-06-26 Implementation

- Placing Astro pages under `src/pages/notes/` generates deploy-ready output
  under `dist/notes/...` without needing Astro `base`.
- Local Astro preview serves `/notes/` but not `/notes`; exact `/notes` to
  `/notes/` behavior still belongs to the CloudFront routing phase.
- The test post fixture slug is `2026-06-26-test-note`.
- The generated notes manifest path is `/notes/posts.manifest.json`.
- The generated notes sitemap path is `/notes/sitemap.xml`; `yioo-link` still
  needs to reference or merge it before root sitemap publication.
- In local preview, a root-relative `/analytics-loader.js` script causes a 404
  because the notes repo does not serve the root yioo-link asset. The notes
  layout now injects that loader only on `yioo.link` or subdomains.
- Keep `output/` and `.playwright-cli/` untracked; they are local QA artifacts.
- Phase 5 created notes OAC `E3GOFI784M6TJF` and CloudFront Function
  `yioo-notes-uri-rewrite`.
- The main CloudFront distribution `EWYEJXEIKC81C` now has `/notes` and
  `/notes/*` behaviors pointing at S3 origin `s3-yioo-notes`.
- The notes bucket remains private; direct S3 access returns `403`, and
  CloudFront access will return `403` until Phase 6 uploads `dist/notes/...`.
- Phase 6 deployed live notes objects under `s3://yioo-notes/notes/...`; both
  `/notes` and `/notes/` resolve to the notes index through the CloudFront
  Function.
- HTML/JSON/XML uploads need explicit content type metadata in the deploy
  script; otherwise S3 may serve HTML without `charset=utf-8`.
- The shared `yioo-link-main-static-security-20260518` response headers policy
  needed `https://www.google.com` in `connect-src` for GA's live
  `www.google.com/g/collect` request.
- Phase 7 updated the root `yioo-link` sitemap to include
  `https://yioo.link/notes/` and
  `https://yioo.link/notes/2026-06-26-test-note/`; the source commit is
  `yioo-link` `8632142`.
- Phase 8 live acceptance verified `/notes`, `/notes/`, the test post, test
  image, manifest, notes sitemap, root sitemap, root page, API health, and
  tools route. Playwright screenshots are local QA artifacts under
  `output/playwright/phase8-live-*.png` and are intentionally ignored by Git.
- Phase 9 design candidate `Workbench Notes` was implemented by a scoped
  subagent-style worker and scored 94/100 after main-agent Playwright and vision
  inspection. The design changed only layout/component/style files and preserved
  content, canonical URLs, manifest, sitemap, deploy script, AWS routing,
  `yioo-link`, mail-service, and `yioo-tools` boundaries.
- Astro-generated CSS/assets must live under `/notes/_astro/...`, not
  `/_astro/...`, because the main CloudFront distribution routes `/notes/*` to
  the `yioo-notes` S3 origin while root `/_astro` belongs to the root site
  behavior. `verify-build` now rejects root `/_astro` links.
