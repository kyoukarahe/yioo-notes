# Yioo Notes

Static notes/blog source for `https://yioo.link/notes/`.

## Local Workflow

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run preview
```

The build output is written to `dist/notes/...` so it can be uploaded under the
same prefix in the `yioo-notes` S3 bucket.

## Content

- Published Markdown posts live in `content/posts/`.
- Drafts and private notes live in `content/drafts/` and `content/private/` and
  are not read by the build.
- Public post assets live under `public/notes/assets/posts/{slug}/`.

## Project State

Use these files as the source of truth for implementation state:

- `docs/notes-implementation-plan.md`
- `docs/progress.md`
- `docs/findings.md`
