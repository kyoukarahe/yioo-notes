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

For content-only publishing without a full Astro build:

```powershell
npm.cmd run publish:posts -- --no-upload
npm.cmd run publish:posts -- --slug 2026-06-26-script-publish-test
```

The publish script regenerates the notes index, post pages, manifest, sitemap,
fixed `/notes/styles.css`, favicon, and post assets from the current Markdown
files.

## Content

- Published Markdown posts live in `content/posts/`.
- Drafts and private notes live in `content/drafts/` and `content/private/` and
  are not read by the build.
- Public post assets live under `public/notes/assets/posts/{slug}/`.
- Markdown should reference images with `/notes/assets/posts/{slug}/...` paths.

## Project State

Use these files as the source of truth for implementation state:

- `docs/notes-implementation-plan.md`
- `docs/progress.md`
- `docs/findings.md`
