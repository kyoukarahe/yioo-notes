# Yioo Notes Design Scorecard

Date: 2026-06-26
Design candidate: `Workbench Notes`
Status: adopted for deployment

## Research Sources

- OpenAI Codex product page:
  https://openai.com/codex/
- OpenAI Developer Blog, "Designing delightful frontends with GPT-5.4":
  https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4
- OpenAI Developer Blog, "Building frontend UIs with Codex and Figma":
  https://developers.openai.com/blog/building-frontend-uis-with-codex-and-figma
- OpenAI Developer Blog, "Mastering Codex Remote for engineering":
  https://developers.openai.com/blog/mastering-codex-remote-for-engineering
- OpenAI, "Codex for every role, tool, and workflow":
  https://openai.com/index/codex-for-every-role-tool-workflow/
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world":
  https://openai.com/index/harness-engineering/

## Screenshots Inspected

- `output/playwright/phase9-design-index-desktop.png`
- `output/playwright/phase9-design-post-desktop.png`
- `output/playwright/phase9-design-index-mobile.png`
- `output/playwright/phase9-design-post-mobile.png`

These screenshots are local QA artifacts and are intentionally ignored by Git.

## Vision Inspection Summary

- Desktop index has a clearer workbench/editorial identity than the first
  design, with a compact brand mark, active notes nav state, controlled
  whitespace, and a scannable indexed post list.
- Desktop post has a stable reading column, strong title hierarchy, image
  framing, readable list/code styling, and no visible overlap.
- Mobile index keeps the nav, headline, summary, date, title, and tags readable
  without horizontal scrolling.
- Mobile post renders both test images, metadata, paragraph text, list items,
  and inline code without clipping or overlap.
- The mobile inline code around `yioo-notes` wraps tightly, but it remains
  readable and does not overflow. This is acceptable for this candidate.

## Verification

- `npm.cmd run check`: passed with 0 errors, 0 warnings, 0 hints.
- `npm.cmd run build`: passed on rerun. The first attempt completed output
  generation but exited with a transient Windows/Node `UV_HANDLE_CLOSING`
  assertion; the rerun completed normally.
- `npm.cmd run verify:build`: passed.
- `git diff --check`: passed, with only Windows LF-to-CRLF warnings.
- Local Playwright console checks: 0 errors and 0 warnings on index/post,
  desktop/mobile.
- Local Playwright overflow checks: no document-level horizontal overflow at
  1440px or 390px.
- Local Playwright image checks: both post image instances loaded at 1200x630.

## Rubric

| Category | Points | Score | Evidence |
| --- | ---: | ---: | --- |
| Content readability and hierarchy | 20 | 19 | Stronger title hierarchy, reading measure, article spacing, post queue, and metadata treatment. |
| Visual polish and brand fit | 20 | 18 | Calm workbench/editorial tone with brand mark, active nav, thin rules, and restrained accents. |
| Responsive layout and text fit | 15 | 14 | Desktop and mobile screenshots show no overlap or overflow; minor inline code wrapping remains. |
| Accessibility and contrast | 15 | 13 | Semantic structure preserved, focus states improved, contrast appears acceptable; no automated contrast audit was run. |
| Content/design isolation | 10 | 10 | Changes stayed in `src/layouts`, `src/components`, and `src/styles`; no post/source/SEO/deploy changes. |
| Performance and static-site simplicity | 10 | 10 | No runtime JS added; design is CSS/HTML only. |
| Asset and post rendering | 5 | 5 | Test post images render on desktop and mobile, with natural size 1200x630. |
| SEO surface preservation | 5 | 5 | Canonical, `og:url`, manifest, sitemap, slug, and deploy rules are unchanged. |

Total score: 94 / 100

Adopted: yes

Required fixes before adoption:

- None.

Follow-up candidates:

- Consider a small CSS adjustment for inline code wrapping if future posts use
  many hyphenated identifiers or long paths.
- Run an automated contrast audit if the palette becomes darker or more
  colorful in a later design pass.

Commit:

- `9cdbf69` (`feat: refine notes workbench design`)
- `a3596a9` (`fix: serve notes astro assets under notes path`)

Deployment/invalidation:

- First design deploy created invalidation `I8CL4OW1G6T0O559MUPJZ7XGP7`, but
  live browser verification caught a root `/_astro` stylesheet path problem.
- Final fixed deploy created invalidation `IERJALDF76M2KTATHYLGI79Z5V` and
  verified live CSS at `/notes/_astro/index.Cz73WjMw.css` with
  `Content-Type: text/css; charset=utf-8`.
- Final live Playwright checks passed with 0 console errors/warnings,
  no desktop/mobile horizontal overflow, and both test images loaded.
