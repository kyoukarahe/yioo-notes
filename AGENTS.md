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
- Implementation logs: `docs/progress.md`, `docs/findings.md`
- Design guidance and design audits: `design-docs/`

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
