# Yioo Notes Global Footer Evaluation

Date: 2026-08-29
Target: local production output for `https://yioo.link/notes/`
Design reviewed: a product-neutral Yioo footer shared by every Notes HTML page
Status: passes the design adoption gate

## Evidence

Screenshots inspected:

- `output/playwright/footer-index-desktop.png`
- `output/playwright/footer-post-desktop.png`
- `output/playwright/footer-index-mobile.png`
- `output/playwright/footer-post-mobile.png`
- `output/playwright/footer-index-mobile-360.png`
- `output/playwright/footer-post-mobile-360.png`
- `output/playwright/footer-live-index-desktop.png`
- `output/playwright/footer-live-post-mobile.png`

Checks completed:

- Notes index and representative post at 1440x1000, 390x844, and 360x740.
- One footer appears after `main` and outside `article` on each inspected page.
- All five shared Yioo destinations remain visible and inside the viewport.
- No document-level horizontal overflow at 1440px, 390px, or 360px.
- Existing post images load with nonzero natural width.
- Browser console: zero errors and zero warnings.
- Astro and manual publisher outputs each contain the same links, labels, copyright, and semantic structure on all 12 generated HTML pages.
- `npm.cmd run check`, `npm.cmd run test:security`, `npm.cmd run build`, `npm.cmd run publish:posts`, and `npm.cmd run verify:build` pass.
- The CloudFront-backed desktop index and mobile post match the local layout with no overflow, missing image, console error, or warning.

## Visual Assessment

Strengths:

- The footer completes the site frame without competing with the article or its AI disclosure.
- A quiet border and muted background preserve the existing Notes workbench identity.
- Legal, help, tools, and contact destinations are reachable from every list, archive, tag, and post page.
- Korean link labels match the surrounding interface while preserving the current Yioo root destinations.
- The link group wraps naturally on narrow screens; copyright moves below it without clipping.
- The implementation remains static HTML and CSS with no runtime JavaScript.

Remaining limits:

- The established `--quiet` text color elsewhere on the site remains below the earlier normal-text contrast target. Footer text uses the stronger `--muted` color.
- At an exact 320px viewport, the existing `body { min-width: 320px; }` can exceed the scrollbar-adjusted client width by 15px. The required 360px and 390px mobile views pass, and the footer's own children remain inside the client width even in that optional stress check.
- Copyright year is configured explicitly and will need a future annual update unless the wider Yioo properties adopt a shared year policy.

## Score

2026-08-29 global footer score: **94 / 100**.

| Category | Points | Score | Reason |
| --- | ---: | ---: | --- |
| Content readability and hierarchy | 20 | 19 | The footer is clearly separated from post content and keeps the primary reading hierarchy intact. |
| Visual polish and brand fit | 20 | 18 | The Notes frame now has a coherent ending and product-neutral Yioo identity. |
| Responsive layout and text fit | 15 | 15 | Required desktop, 390px, and 360px views pass without overflow or clipping. |
| Accessibility and contrast | 15 | 12 | Semantic footer navigation, visible focus treatment, and stronger muted text pass the scoped review; the known site-wide quiet-color limit remains. |
| Content/design isolation | 10 | 10 | The footer stays outside `main` and `article`, and both renderers use the same config contract. |
| Performance and static-site simplicity | 10 | 10 | The feature is static HTML and CSS with no new script or asset dependency. |
| Asset and post rendering | 5 | 5 | Existing post assets load on desktop and mobile without layout regression. |
| SEO surface preservation and extension | 5 | 5 | Existing metadata, RSS, sitemap, categories, tags, and canonical paths remain unchanged. |
