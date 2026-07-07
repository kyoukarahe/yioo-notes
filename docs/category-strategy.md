# Yioo Notes Category Strategy

Date: 2026-06-28
Status: Implemented as the minimal registry-backed category model

## Purpose

This document records why Yioo Notes may need categories, what category support
would change, and which implementation boundaries must be understood before
building it.

Implemented state:

- Posts already support `tags` in Markdown frontmatter.
- Tags are rendered on the index and post pages.
- Tags are included in generated `posts.manifest.json`.
- Tags are emitted as article metadata and JSON-LD keywords.
- Posts now require one `category` frontmatter value.
- Category ids are validated against `src/config/categories.json`.
- Generated `posts.manifest.json` includes resolved category metadata.
- Category archive routes exist at `/notes/categories/` and
  `/notes/categories/{category-id}/`.
- No tag archive route exists.

## Why Use Categories

Categories are useful when the notes site needs a stable, small set of primary
sections. They answer "what kind of writing is this?" better than tags.

Expected uses:

- Help readers scan the site by primary content type.
- Give post-writing agents a controlled classification target.
- Support future category landing pages such as `/notes/categories/research/`.
- Enable category-specific index pages, navigation, RSS/feed slices, or internal
  recommendations later.
- Provide a stable field for analytics or Search Console review once post count
  grows.

Categories are not required if the site stays small or if tags alone are enough.
The category system should not be added only for visual decoration.

## Category Vs Tag

Use one primary category per post:

```yaml
category: "research"
```

Use multiple tags for flexible cross-cutting labels:

```yaml
tags:
  - codex
  - seo
  - implementation-log
```

Recommended semantics:

| Field | Cardinality | Stability | Use |
| --- | ---: | --- | --- |
| `category` | One per post | High | Primary section, archive URL, controlled navigation |
| `tags` | Many per post | Medium/low | Search, metadata, secondary labels, future tag pages |

If a post can fit several categories, that is a signal to keep the category
coarser and use tags for the extra dimensions.

## Source Of Truth

Do not make generated `posts.manifest.json` the editable category registry.
Manifest files are deployment output and should remain generated.

Recommended source model:

```text
src/config/categories.json        editable category registry
content/posts/{slug}.md           post frontmatter references category id
dist/notes/posts.manifest.json    generated output
dist/notes/sitemap.xml            generated output
```

Example category registry:

```json
{
  "categories": [
    {
      "id": "research",
      "label": "Research",
      "description": "Research notes and collected findings",
      "status": "active",
      "sort": 10
    }
  ]
}
```

Example post frontmatter:

```yaml
category: "research"
tags:
  - codex
  - notes
```

The category `id` should be treated as a URL-bearing stable identifier. Rename
or delete it only with a migration plan.

## Impact Scope

Adding categories affects more than frontmatter parsing. The current code has
two rendering paths that must stay aligned:

- Astro build path under `src/`
- Content-only publisher in `scripts/publish-posts.mjs`

Expected files and surfaces:

| Area | Likely change | Notes |
| --- | --- | --- |
| Content schema | Add `category` to post parsing/types | Validate against `categories.json`. |
| Category registry | Add `src/config/categories.json` | Source of truth for category CRUD. |
| Markdown posts | Add `category` frontmatter | Existing posts need a default or migration. |
| Index UI | Display or filter category | Keep tags visually secondary. |
| Post UI | Show category near date/tags | Avoid changing canonical URL. |
| Manifest | Include `category` and resolved category metadata | Generated only. |
| Sitemap | Include category archive pages if created | Post URLs remain unchanged. |
| Routes | Add `/notes/categories/` and `/notes/categories/{id}/` if archive pages are built | Must support both Astro and publish script outputs. |
| Publish script | Generate category pages and validate category ids | Required for content-only publishing. |
| Verify script | Assert category output and sitemap entries | Prevent drift between renderers. |
| CSS | Add category label/list styles | Must remain mobile-safe. |
| yioo-notes-apply skill | Teach post agents to read `categories.json` | Avoid invalid category ids. |
| Docs | Update plan/findings/progress | Record migration and rollback. |

No routine `yioo-link` change should be needed. `robots.txt` already advertises
`https://yioo.link/notes/sitemap.xml`, so category archive URLs can be added to
the notes-owned sitemap.

## Operational Effects

New post upload:

- The post-writing agent must choose a valid category id.
- The publish script must reject unknown category ids.
- The generated manifest and sitemap should include the category data/archive.

Post update:

- Changing category should regenerate the post, index, manifest, sitemap, and
  affected category archive pages.
- This is not only a single post update once category archives exist.

Post delete:

- The deleted post must disappear from its category archive.
- If it was the last post in a category, the archive page policy must be clear:
  keep empty active category pages, hide them, or mark the category inactive.

Category create:

- Add a category registry entry.
- Category archive can be generated immediately, even before posts exist, or
  only after at least one published post uses it. Choose one policy before
  implementation.

Category update:

- `label`, `description`, and `sort` are safe to change.
- `id` is unsafe to change because it affects URLs and all post references.

Category delete:

- Should be blocked while published posts still reference the category.
- Safer alternative is `status: "inactive"` so old posts and archives can
  remain valid until a controlled cleanup is done.

## SEO And URL Effects

Post URLs should stay unchanged:

```text
/notes/{slug}/
```

Category archive URLs, if implemented, should be separate:

```text
/notes/categories/
/notes/categories/{category-id}/
```

Sitemap policy:

- Always include post URLs.
- Include category archive URLs only if they are real rendered pages.
- Do not include inactive or empty category pages unless there is a deliberate
  reason to index them.

Canonical policy:

- Post canonical remains `https://yioo.link/notes/{slug}/`.
- Category canonical is `https://yioo.link/notes/categories/{id}/`.
- Do not canonicalize posts to category pages.

## Risk Assessment

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Drift between Astro and `publish-posts.mjs` | Live content differs from full build output | Update both paths and verify both. |
| Invalid category ids in posts | Broken archives or inconsistent manifest | Validate posts against `categories.json`. |
| Category id rename | URL churn and broken references | Treat ids as stable; migrate explicitly. |
| Empty category pages indexed | Thin/low-value SEO pages | Exclude empty/inactive categories from sitemap. |
| Too many categories | Navigation and agent choice become noisy | Keep categories coarse and controlled. |
| Manual manifest edits | Source/output drift | Keep manifest generated only. |

## Implemented Minimal Model

The first implementation uses one required category per published post and a
small editable registry:

```text
src/config/categories.json
content/posts/{slug}.md
src/lib/categories.ts
src/lib/posts.ts
src/pages/notes/categories/
scripts/publish-posts.mjs
scripts/verify-build.mjs
```

Current active category:

```text
implementation
```

Both existing test posts use `category: "implementation"`. The Astro build path
and the content-only `publish:posts` path both render:

```text
/notes/categories/
/notes/categories/implementation/
```

The notes sitemap includes category archive URLs only for rendered active
category pages with posts.

## Implementation Readiness

Categories are worth implementing when at least one of these is true:

- There are enough posts that the flat index becomes hard to scan.
- Post-writing agents need a controlled classification field.
- Category archive pages will be useful to readers or search engines.
- Analytics/Search Console review needs stable content groups.

Categories were implemented because post-writing agents need a controlled
classification field and because category archives are useful generated outputs
for future SEO, navigation, and review.

## Recommended First Implementation

The implemented first version follows this minimal scope:

1. Added `src/config/categories.json`.
2. Added required `category` parsing and validation.
3. Migrated existing test posts to `implementation`.
4. Included category id/label/url/canonicalUrl in generated
   `posts.manifest.json`.
5. Rendered category labels on index and post pages.
6. Generated `/notes/categories/` and `/notes/categories/{id}/`.
7. Added category archive URLs to `notes/sitemap.xml`.
8. Updated `scripts/publish-posts.mjs` to generate the same category pages.
9. Extended `scripts/verify-build.mjs` to verify category pages, manifest, and
   sitemap.
10. Updated `$yioo-notes-apply` so post agents read `categories.json` before
    creating or updating posts.

This remains a focused implementation phase. Avoid combining later category
changes with design changes.

## Open Decisions

Resolved for the first implementation:

- Require one category for every published post.
- Keep category ids lowercase ASCII and URL-safe.
- Allow label/description to change.
- Block category deletion while posts reference it.
- Defer tag archive pages until categories prove useful.
- Render and sitemap only active categories that have published posts.
- Use English labels for now.

Still open:

- Whether future UI should expose category filters beyond archive links.
- Whether inactive historical categories should remain rendered but excluded
  from navigation.
- Whether category pages should get custom editorial copy once real content
  volume grows.
