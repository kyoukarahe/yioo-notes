# Yioo Notes Agent Guide

This repository owns the static notes/blog implementation for
`https://yioo.link/notes/`.

## Boundaries

- Keep public notes URLs under `https://yioo.link/notes/...`.
- Do not modify `yioo-link` or `yioo-tools` from this repository.
- Do not change EC2, nginx, PM2, or mail-service runtime behavior here.
- Keep drafts and private notes out of builds and deploys.

## Ownership

- Published posts: `content/posts/`
- Drafts/private notes: `content/drafts/`, `content/private/`
- Post assets: `public/notes/assets/posts/{slug}/`
- Layout and design: `src/layouts/`, `src/components/`, `src/styles/`
- Site config: `src/config/site.config.json`
- The canonical runtime footer for `https://yioo.link/notes/...` is the
  `yioo-link`-owned `/global-footer.html`, `.css`, and `.js` asset set. Keep the
  local `SiteFooter.astro`, manual `renderFooter()`, and config entries aligned
  as the Tools-style failure/no-JavaScript fallback.
- Implementation logs: `docs/progress.md`, `docs/findings.md`
- Korean editorial and terminology guidance: `docs/korean-editorial-guide.md`
- Design guidance and design audits: `design-docs/`

## Research Essay Workflow

- For requests to turn a topic, conversation excerpt, memo, research TODO, or
  existing note into a researched essay, use the repository skill at
  `.agents/skills/research-essay-publisher/SKILL.md`.
- Keep working articles under `content/drafts/` and unapproved assets under
  `content/drafts/assets/{slug}/`. Do not place either in public paths before
  final approval.
- After the first complete Korean draft, run `humanize-korean` on the article
  body before author feedback. Keep frontmatter and the planned AI disclosure
  outside the humanization input, then recheck claims, links, names, numbers,
  quotations, code, and tables against the pre-edit draft.
- Apply `docs/korean-editorial-guide.md` during drafting and final verification.
  Treat terminology review as separate from `humanize-korean`: verify whether
  an English technical term is established, emerging, product-specific, or an
  editorial synthesis, then choose natural Korean without erasing technical
  distinctions.
- Use subagents only for independent topic framing, evidence research,
  counter-research, and final verification. One primary agent owns all draft
  edits.
- Require author feedback after the first complete draft and separate explicit
  publish approval after the verified revision. Praise alone is not publish
  approval.
- Record the actual drafting model and the proposed public AI disclosure in the
  private source ledger. Show that exact line at the publish-approval gate, but
  add it to the article only during the approved production handoff.
- After explicit approval, use `yioo-notes-apply` for production content
  promotion, deployment, live verification, and its safe git workflow.

## Design Guidance

- Every design verification must include mobile and desktop checks. Mobile is
  not optional, even for CSS-only changes.
- Minimum visual evidence for a design change is:
  - notes index at desktop width
  - representative post at desktop width
  - notes index at mobile width
  - representative post at mobile width
- Mobile checks must confirm no horizontal overflow, no clipped navigation or
  article text, and no missing post images.
- Structural design changes must keep `src/layouts/`,
  `src/components/`, and the manual renderer in `scripts/publish-posts.mjs`
  aligned, because routine post publishing can regenerate HTML without a full
  Astro build.

Before starting a phase, read `docs/notes-implementation-plan.md`,
`docs/progress.md`, and `docs/findings.md`.
