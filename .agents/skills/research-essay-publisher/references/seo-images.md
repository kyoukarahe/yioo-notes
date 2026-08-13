# SEO and image guidance

## Search package

Prepare these alongside the article, without allowing them to distort the editorial conclusion:

- three accurate title candidates and one recommendation;
- final slug and canonical URL;
- one primary query or reader question;
- a small set of natural related terms and entities;
- concise `summary` text that works on the index and as a meta description;
- one active category and focused tags;
- existing internal links that genuinely help the reader;
- source links for externally verifiable claims;
- publication and updated dates;
- cover path and image alt text, when applicable.

Use one article H1. Make the title descriptive, not clickbait. Put key concepts in the title, opening, headings, and summary only where they read naturally. Never optimize for keyword density, artificial length, mass production, or search-engine-first prose.

Check that internal links actually exist and that external links point to the page supporting the nearby claim. Do not link to search results. The build derives manifests, category archives, sitemap entries, and structured metadata from the post; do not hand-edit generated files.

## Images

Use images only when they add information, orientation, or a distinctive cover. Prefer authored diagrams, verified charts, relevant screenshots, or clearly labeled generated illustrations over decorative stock imagery.

- Preferred cover target: 1200 x 630 WebP when practical.
- Keep body images to the smallest useful set, usually zero to two.
- Use assets the author owns, has permission to reuse, or explicitly generates for the post.
- Verify chart scales, labels, dates, and source attribution.
- Mark synthetic depictions as illustrations when a reader could mistake them for documentary evidence.
- Write useful alt text that describes the image's function; do not stuff keywords.
- Do not place essential explanatory text only inside an image.

During drafting, keep files in `content/drafts/assets/{slug}/` even if frontmatter already names the intended final public path. Only after explicit publish approval may approved files be copied to `public/notes/assets/posts/{slug}/`.

If image dimensions or layout behavior changes, verify both index and representative post pages on desktop and mobile. Confirm no horizontal overflow, clipped text or navigation, or missing images.
