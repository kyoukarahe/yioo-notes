# Yioo Notes Design Guidelines

Date: 2026-06-28
Status: active guidance

## Ownership

Design-owned files:

- `src/layouts/`
- `src/components/`
- `src/styles/`
- `src/config/site.config.json`
- `design-docs/`

Content-owned files:

- `content/posts/`
- `content/drafts/`
- `content/private/`
- `public/notes/assets/posts/{slug}/`

Routine content publishing must not require editing layout files. Structural
design changes must keep Astro source and `scripts/publish-posts.mjs` aligned,
because `npm.cmd run publish:posts` manually renders the index, post list, and
post HTML.

## Mobile Verification Rule

Every design verification must include mobile. Mobile is a required acceptance
gate, not an optional follow-up.

Minimum viewport evidence for every design change:

- Desktop index, 1440x1000 or similar.
- Desktop representative post, 1440x1000 or similar.
- Mobile index, 390x844.
- Mobile representative post, 390x844.

Add a narrower mobile check, such as 360x740, when changing navigation,
typography, article width, post-list density, code wrapping, tables, or image
treatment.

## Acceptance Gates

A design change is not ready to adopt until all of these pass:

- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- Desktop and mobile screenshots are captured.
- Desktop and mobile screenshots are inspected visually.
- Mobile index and representative post have no document-level horizontal
  overflow.
- Console checks show no errors or warnings caused by the design change.
- Representative post images are complete and have nonzero natural dimensions.
- Text, navigation, tags, code, and article content do not overlap or clip.
- Contrast-sensitive colors are checked when palette or text roles change.
- Canonical URLs, `og:url`, sitemap output, manifest output, and slugs remain
  unchanged unless the task explicitly asks for SEO or URL migration.

## Design Scoring

Future design candidates should be scored out of 100 before adoption. Use the
existing rubric from `docs/notes-implementation-plan.md`, but record new
scorecards in `design-docs/`.

Designs below 90 should not be deployed as a design pass. Either iterate,
reject, or explicitly record why the lower-scoring change is a narrow fix rather
than a full design adoption.

## Documentation

For every meaningful design pass, add:

- A short research or pre-work note in `design-docs/`.
- A current design scorecard or evaluation note.
- Screenshot paths under `output/playwright/` when screenshots are captured.
- A progress entry in `docs/progress.md` if the repo state changes.
