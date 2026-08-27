# Notes Discovery and Reading Evaluation

Date: 2026-08-27
Target: local production build for `https://yioo.link/notes/`
Design reviewed: Korean discovery copy, repeated-tag navigation, article TOC, related posts, and social-image coverage
Status: passes the design adoption gate

## Evidence

Screenshots inspected:

- `output/playwright/notes-discovery-index-desktop.png`
- `output/playwright/notes-discovery-post-desktop.png`
- `output/playwright/notes-discovery-index-mobile-390.png`
- `output/playwright/notes-discovery-post-mobile-390.png`
- `output/playwright/notes-discovery-index-mobile-360.png`
- `output/playwright/notes-discovery-post-mobile-360.png`
- `output/playwright/notes-discovery-tag-index-mobile-360.png`
- `output/playwright/notes-discovery-toc-target-mobile-360.png`

Checks completed:

- Desktop index and representative post at 1440x1000.
- Mobile index and representative post at 390x844 and 360x740.
- No document-level horizontal overflow at 360px (`scrollWidth=345`, `innerWidth=360`).
- All inspected article images completed with nonzero natural width.
- Browser console: zero errors and zero warnings.
- Repeated-tag navigation reaches the tag index and the two-post `ai-agent` archive.
- A TOC fragment entry lands the target heading at about 120px, below the 108px sticky mobile header.
- `npm.cmd run check`, `npm.cmd run build`, and the security regression suite pass.

The Playwright CLI is unavailable in this Windows/Node 24 runtime because it aborts on an internal libuv assertion. The installed Codex in-app browser exercised the real local HTTP route, responsive viewport, DOM, navigation, image loading, fragment entry, console, and screenshot surfaces instead. Fragment-click emulation did not apply the same-page default action in that tool, so the link markup and direct fragment entry were verified separately.

## Visual Assessment

Strengths:

- Korean discovery copy now matches the language of the articles and is visible in both metadata and page introductions.
- Post cards keep title, category, and tag destinations distinct without nested links.
- Only repeated tags look and behave like navigation; singleton tags remain quieter labels.
- The open, collapsible H2 TOC gives long posts a clear map without adding JavaScript or a desktop-only sidebar.
- Long Korean titles, taxonomy chips, TOC labels, and article tables wrap without clipping at 360px.
- Related-post blocks extend reading paths without interrupting the article or moving the AI disclosure out of its final article position.

Remaining limits:

- The desktop index intentionally keeps substantial white space on the right; it remains calm but slightly under-composed.
- The established `--quiet` text color remains below the normal-text contrast target from the earlier audit. This pass did not change the palette.
- Singleton tag archives are intentionally absent until more posts share those tags.

## Score

2026-08-27 discovery and reading score: **93 / 100**.

| Category | Points | Score | Reason |
| --- | ---: | ---: | --- |
| Content readability and hierarchy | 20 | 19 | TOC, Korean descriptions, and related reading paths materially improve long-form use. |
| Visual polish and brand fit | 20 | 17 | The Workbench identity stays coherent; desktop whitespace remains somewhat sparse. |
| Responsive layout and text fit | 15 | 15 | Required desktop, 390px, and 360px views pass without overflow or clipping. |
| Accessibility and contrast | 15 | 12 | Semantic navigation, focus treatment, and distinct link structure improve access; the known quiet-color contrast limit remains. |
| Content/design isolation | 10 | 10 | Shared components and CSS remain separate from article content, with the manual renderer kept aligned. |
| Performance and static-site simplicity | 10 | 10 | TOC, tags, related links, OG metadata, and RSS remain static HTML/XML with no runtime JavaScript. |
| Asset and post rendering | 5 | 5 | Existing images load and the fallback social card has the required 1200x630 dimensions. |
| SEO surface preservation and extension | 5 | 5 | Canonicals remain stable while Korean metadata, OG coverage, tag sitemap entries, and RSS discovery are added. |
