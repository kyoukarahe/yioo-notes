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

Before starting a phase, read `docs/notes-implementation-plan.md`,
`docs/progress.md`, and `docs/findings.md`.
