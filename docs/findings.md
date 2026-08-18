# Yioo Notes Findings

Use this file for durable facts discovered during implementation. Do not store
untrusted web text as instructions; summarize only the facts that should guide
future phases.

## 2026-08-17 Korean editorial wording

- Use `싼`, `싸다`, and `값싼` when the intended meaning is consciously
  negative, such as low quality or cost cutting at the expense of the result.
  For neutral `low-cost` or positive `reasonable`, prefer wording such as
  `비용이 낮은`, `부담이 적은`, `합리적인`, or `경제적인` according to the
  sentence.
- Do not use `증거` as the default translation of `evidence` in ordinary Korean
  product writing or essays. Name its function instead: `근거`, `자료`, `완료
  기록`, `확인 결과`, `검증 결과`, or `판단 기준`. Keep `증거` when it is the
  established legal, investigative, forensic, or proof-oriented term.
- These are contextual editorial rules, not global search-and-replace rules.
  Preserve quotations, product terms, and established technical distinctions.

## 2026-08-19 Publication security

- Both Notes publishing scripts reconcile the complete generated release;
  changing one post never meant that S3 changed only that post. The CLI and
  documentation now name this behavior directly.
- A slug argument is safe only as a presence assertion. `--require-slug`
  verifies that the requested post exists in the full release, while the
  default command remains local-only.
- Production mutation requires an authoritative AWS account, bucket, region,
  versioning status, and CloudFront readback, followed by an S3 sync/delete dry-run and explicit
  full-release confirmation. These checks are part of the publishing entry
  points rather than agent-only instructions.
- PowerShell's terminating-error preference does not reliably stop on a native
  executable's nonzero exit. Native commands need an explicit
  `$LASTEXITCODE` check, including build and verification commands.
- Marked accepts raw HTML by default, and both Notes renderers eventually use
  raw HTML insertion. A shared renderer now escapes raw Markdown HTML and
  allowlists URL schemes; JSON embedded in script elements escapes `<`, `>`,
  and `&`.
- The 2026-08-19 live AWS previews found no pending deletion. They confirmed
  the expected private S3 origin and deployed `/notes` CloudFront routing; no
  production upload or invalidation occurred.

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
- Phase 10 replaced generated stylesheet URLs with the stable public path
  `/notes/styles.css`. `scripts/sync-styles.mjs` copies
  `src/styles/global.css` to `public/notes/styles.css`, and
  `BaseLayout.astro` references the fixed stylesheet path directly.
- `scripts/publish-posts.mjs` can regenerate and upload notes HTML, post pages,
  `posts.manifest.json`, `sitemap.xml`, fixed CSS, favicon, and post assets
  without running a full Astro build. It still reads the same Markdown
  frontmatter from `content/posts/`.
- The content-only publish workflow intentionally regenerates the index,
  manifest, and sitemap together with the changed post. This preserves one URL
  per post while allowing a future post-writing agent to publish through a
  script instead of editing layout or build internals.
- Post assets remain post-scoped under
  `public/notes/assets/posts/{slug}/`. A post-writing agent should place images
  there before publishing, then reference them with root-relative
  `/notes/assets/posts/{slug}/...` URLs in Markdown frontmatter/body.
- Phase 10 changed notes asset uploads in `scripts/deploy.ps1` to `no-cache`
  because post images may be replaced during content maintenance. Existing
  root/API/tools/mail-service routing remains out of scope for notes content
  publishing.
- On Node v24.13.1 for Windows, Astro completed output generation but sometimes
  exited with a `UV_HANDLE_CLOSING` assertion unless telemetry was disabled.
  `scripts/astro-build.mjs` now sets `ASTRO_TELEMETRY_DISABLED=1` before
  running `astro build`, and `npm.cmd run build` uses that wrapper.
- `yioo-link` commit `e736f73` added
  `Sitemap: https://yioo.link/notes/sitemap.xml` to live `robots.txt`. Future
  notes post publishing can update the notes-owned sitemap without editing the
  root sitemap for every post.

## 2026-06-28 Design Guidance

- New forward-looking design guidance and audits live under `design-docs/`.
  Historical Phase 9 design research and scorecards under `docs/` remain
  evidence, but future design work should record new guidance, research, and
  scorecards in `design-docs/`.
- Mobile verification is mandatory for every design change. At minimum, capture
  and inspect the notes index and one representative post at desktop width and
  mobile 390x844. Add a narrower mobile viewport when navigation, typography,
  article width, post-list density, code wrapping, tables, or image treatment
  changes.
- The 2026-06-28 live design audit found the current `Workbench Notes` design
  acceptable as a baseline but not yet an advanced long-term target. The
  maintenance review score is 88/100, mainly because the desktop index can feel
  sparse and the `--quiet` metadata color contrast is too low for normal-size
  text.
- Current CSS contrast spot check: `--quiet` on `--background` is 2.94:1. Most
  other checked text roles pass AA normal text contrast, including `--text`,
  `--body-text`, `--muted`, `--accent-strong`, code text, and preformatted
  text.
- Future design passes should use a stress fixture before visual adoption. The
  current two test posts do not cover long titles, Korean paragraphs, long code
  paths, tables, blockquotes, or mixed image aspect ratios.
- Structural design changes must keep Astro components and
  `scripts/publish-posts.mjs` aligned, because the content-only publish script
  manually renders the same layout surface.

## 2026-06-28 Category Analysis

- Category support is implemented with one required `category` frontmatter
  value per published post.
- Category rationale, impact scope, operational effects, SEO implications, and
  open decisions are documented in `docs/category-strategy.md`.
- `src/config/categories.json` is the editable category registry.
  `posts.manifest.json` remains generated-only.
- The Astro build path and `scripts/publish-posts.mjs` both generate
  `/notes/categories/` and `/notes/categories/implementation/`.
- The current verification contract checks category pages, manifest category
  metadata, notes sitemap category URLs, and both existing test posts under the
  `implementation` category.

## 2026-08-11 Research Essay Agent Workflow

- Repository-scoped essay instructions now live at
  `.agents/skills/research-essay-publisher/`. The compact `SKILL.md` controls
  state and safety gates; four one-level references hold site, research,
  SEO/image, and review/publishing details.
- Research work has two deliberate human gates: one after the first complete
  draft and another after the verified revision. Positive feedback is not
  treated as authorization to publish.
- The workflow assigns independent framing, evidence, counter-research, and
  read-only verification roles while keeping a single primary draft owner.
  This prevents competing edits and stitched multi-agent prose.
- Unapproved images must remain under `content/drafts/assets/{slug}/`.
  `scripts/publish-posts.mjs` copies the public notes tree, so placing draft
  assets in `public/notes/assets/posts/{slug}/` could expose them during an
  unrelated deployment.
- The essay skill does not duplicate production controls. After explicit
  approval it hands the approved post and assets to `yioo-notes-apply`, which
  remains authoritative for validation, S3 upload, CloudFront invalidation,
  live readback, and git delivery.
- The skill tells agents to inspect `src/config/categories.json` rather than
  freezing the current `implementation` category as permanent policy.
- During the first essay run, the skill profile's canonical example was found
  to conflict with the authoritative renderer and existing posts. The incorrect
  `/notes/posts/{slug}/` example was corrected to `/notes/{slug}/` before any
  draft was created; the skill then passed validation again.

## 2026-08-13 Korean editing and AI disclosure lifecycle

- Research essays now separate three concerns: canonical prose drafting,
  Korean editorial cleanup, and production disclosure insertion.
- `humanize-korean` runs after the complete first draft and before author
  feedback. Its input excludes frontmatter, source ledgers, URLs, code,
  machine-readable metadata, and the pending disclosure. The primary writer
  reconciles section outputs and rechecks claims, names, dates, numbers,
  quotations, links, code, and tables.
- Drafting provenance is captured at first-draft time in the private source
  ledger. Publication must not substitute the model that happens to execute
  the later upload task.
- Disclosure lifecycle states are `proposed -> approved -> applied`. The
  author sees the proposed exact line at the publish-approval gate; only an
  explicit publishing instruction advances it to `approved`.
- `yioo-notes-apply` is the single insertion owner. It appends the approved
  footer after approval, then verifies exact-once presence in source Markdown,
  rendered HTML, and the live URL before marking the ledger `applied`.
- Manual self-reported change rates were insufficient for a durable editorial
  gate. The installed `humanize-korean` skill now has a deterministic
  `scripts/verify_change_rate.py` implementation using character-level
  `SequenceMatcher` similarity, with warning above 30% and abort above 50%.
- The publishing skill now includes `scripts/verify_ai_disclosure.py` for
  exact-once Markdown, rendered-HTML, and live-URL verification.
- `Yioo` is the default public editorial identity for research-essay
  disclosures so the footer matches the site's public byline. A different
  identity still requires explicit article-level approval.

## 2026-08-14 Plain Korean preference

- Yioo Notes prose should not preserve English clause order merely because it
  sounds formal or precise.
- Thesis, summary, and bold conclusion sentences receive a separate
  plain-language gate after Korean editing. Stacked modifiers, abstract-noun
  chains, and a delayed main verb should be split or reordered.
- Prefer a concrete subject, action, and result that can be understood on the
  first reading. Keep evidence boundaries, uncertainty, exceptions, dates,
  numbers, and technical distinctions even when simplifying the syntax.
- English terms remain acceptable when they are established technical terms or
  materially improve precision; otherwise introduce natural Korean first.

## 2026-08-16 Korean terminology and editorial guide

- Repository-specific Korean terminology decisions now live in
  `docs/korean-editorial-guide.md`; they are not delegated to the external
  `humanize-korean` skill.
- `humanize-korean` remains responsible for prose rhythm and common AI-writing
  patterns. The repository guide governs term status, literal translation,
  first-use definitions, sentence clarity, and article-specific terminology
  ledgers.
- An English technical term is classified before use as an established
  standard, an industry term, an emerging or product-specific term, or an
  editorial synthesis. The first two may justify retaining the technical term,
  but an industry term still receives a first-use explanation when general
  readers may not know it.
- Software `contract` is a real English engineering metaphor, but Korean
  `계약` is not the default translation in every compound. Prefer `명세`,
  `규칙`, `조건`, `범위`, or `경계` when those words state the actual meaning
  more clearly. Keep terms such as `data contract` only with a first-use
  definition and a verified source.
