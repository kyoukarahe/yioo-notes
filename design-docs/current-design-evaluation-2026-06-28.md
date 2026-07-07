# Current Design Evaluation

Date: 2026-06-28
Target: live `https://yioo.link/notes/`
Design reviewed: `Workbench Notes`
Status: acceptable baseline, not yet an advanced long-term target

## Evidence

Screenshots inspected:

- `output/playwright/phase11-current-index-desktop.png`
- `output/playwright/phase11-current-post-desktop.png`
- `output/playwright/phase11-current-index-mobile.png`
- `output/playwright/phase11-current-post-mobile.png`

Commands and checks:

- `npm.cmd run check`: passed, 0 errors, 0 warnings, 0 hints.
- `npm.cmd run build`: passed.
- Playwright console check on live page: 0 errors, 0 warnings.
- Mobile post viewport: 390x844.
- Mobile post horizontal overflow: false.
- Mobile index horizontal overflow: false.
- Representative post images: complete, 1200x630 natural size.

Contrast spot check from current CSS variables:

| Pair | Ratio | Result |
| --- | ---: | --- |
| `--text` on `--background` | 14.84:1 | pass |
| `--body-text` on `--background` | 12.62:1 | pass |
| `--muted` on `--background` | 4.69:1 | pass |
| `--quiet` on `--background` | 2.94:1 | fail for normal-size text |
| `--accent-strong` on `--background` | 7.27:1 | pass |
| `--accent-blue` on `--surface` | 6.64:1 | pass |
| `--code-text` on `--code-bg` | 10.83:1 | pass |
| `--pre-text` on `--pre-bg` | 15.17:1 | pass |

## Visual Assessment

Strengths:

- The design has a clear editorial/workbench identity and feels appropriate for
  implementation notes rather than a marketing surface.
- Desktop article width is readable and stable.
- Mobile index and article pages preserve hierarchy without horizontal
  overflow.
- The design remains static and light: no extra runtime interaction is needed.
- Post images render correctly on desktop and mobile.
- Content/design separation is still intact.

Weaknesses:

- The `--quiet` color used for low-emphasis metadata is below the normal-text
  contrast threshold. It should be raised before metadata becomes more
  important or denser.
- Desktop index leaves a large unused right side. This is calm, but it can feel
  under-composed once there are more posts or richer metadata.
- Current test posts are too simple to stress-test long titles, Korean text,
  long code paths, tables, blockquotes, and mixed image sizes.
- Mobile nav works, but future nav growth will need a more deliberate compact
  pattern.
- Article pages could communicate stronger editorial value with optional
  reading time, updated date treatment, related notes, or a small table of
  contents for long posts.

## Score

2026-06-28 maintenance review score: 88 / 100.

This does not revoke the historical Phase 9 adoption decision. It is a stricter
forward-looking score based on today's mobile evidence and contrast spot check.

| Category | Points | Score | Reason |
| --- | ---: | ---: | --- |
| Content readability and hierarchy | 20 | 18 | Clear article and index hierarchy. Needs richer long-content stress tests. |
| Visual polish and brand fit | 20 | 16 | Calm and coherent, but the desktop index can feel sparse. |
| Responsive layout and text fit | 15 | 14 | Desktop/mobile screenshots pass; minor inline code wrapping remains visible. |
| Accessibility and contrast | 15 | 10 | Most text passes, but `--quiet` fails for normal-size metadata. |
| Content/design isolation | 10 | 10 | Design source and content remain separated. |
| Performance and static-site simplicity | 10 | 10 | Static CSS/HTML, no added runtime burden. |
| Asset and post rendering | 5 | 5 | Test images render correctly. |
| SEO surface preservation | 5 | 5 | Canonical, `og:url`, manifest, sitemap, and slug behavior are preserved. |

## Recommended Next Design Fixes

1. Raise `--quiet` contrast or reserve it only for non-essential large text.
2. Add a long-form visual fixture before the next design pass.
3. Decide whether the index should stay minimalist or gain a right-side
   metadata rail, tag summary, or recent-update module once real posts exist.
4. Add a compact mobile nav pattern before the nav grows beyond three links.
5. Consider article affordances for real notes: updated date, reading time,
   optional table of contents, and related notes.
