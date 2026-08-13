# Yioo Notes site profile

## Editorial identity

Yioo Notes is a Korean personal notes and essay site at `https://yioo.link/notes/`. Favor useful explanations, researched essays, and implementation records that reveal mechanisms, misconceptions, tradeoffs, or failure modes. Do not turn an arbitrary trend into content merely because it may attract search traffic.

Write for a curious reader who wants a clear conclusion and enough evidence to inspect it. Default to calm Korean prose in the `-다` style unless the author asks for another voice. Avoid generic AI introductions, exaggerated certainty, excessive headings, and repeated conclusions.

The public byline is `yioo`. Do not infer the author's job, expertise, personal history, hands-on experience, or opinion. First-person claims must come from author-provided material or explicit confirmation. Existing test posts are schema examples, not voice exemplars.

## Content locations

- Working drafts: `content/drafts/{slug}.md`
- Draft research notes: `content/drafts/{slug}.sources.md`
- Unapproved assets: `content/drafts/assets/{slug}/`
- Published posts: `content/posts/{slug}.md`
- Approved public assets: `public/notes/assets/posts/{slug}/`
- Research prompts and TODOs: `docs/post-todos/`

Files in `docs/post-todos/` are leads, not verified facts or publish-ready copy. Repair encoding damage when necessary and verify every claim independently.

## Frontmatter contract

Use explicit values for:

```yaml
---
title: "Article title"
slug: "yyyy-mm-dd-lowercase-kebab-slug"
date: "yyyy-mm-dd"
updated: "yyyy-mm-dd"
status: draft
category: implementation
tags:
  - tag-one
summary: "A concise, accurate description used on indexes and in metadata."
cover: "/notes/assets/posts/{slug}/cover.webp"
canonical: "/notes/{slug}/"
---
```

Always set `status` explicitly; never rely on a renderer default. Use only an active category from `src/config/categories.json`. At the time this profile was written, the only active category was `implementation`, but inspect the live config before drafting because categories can change.

Use one stable lowercase ASCII slug with a date prefix. Keep public URLs under `https://yioo.link/notes/...`. The canonical post URL is `https://yioo.link/notes/{slug}/`; store the frontmatter value as `/notes/{slug}/` to match the current renderer and existing posts.

Omit `cover` only when the approved article genuinely has no cover. A draft may reference the intended final public path while the physical asset remains safely under `content/drafts/assets/{slug}/`.

## Repository boundaries

This repository owns the static notes implementation only. Do not modify `yioo-link`, `yioo-tools`, EC2, nginx, PM2, or mail-service behavior. Keep drafts and private notes out of all builds and deploys.
