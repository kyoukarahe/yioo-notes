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
npm.cmd run publish:posts -- --require-slug 2026-08-11-how-to-use-llm-wiki
npm.cmd run publish:posts -- --require-slug 2026-08-11-how-to-use-llm-wiki --dry-run
npm.cmd run publish:posts -- --require-slug 2026-08-11-how-to-use-llm-wiki --upload --confirm-full-release
```

The publish script regenerates the notes index, post pages, manifest, sitemap,
fixed `/notes/styles.css`, favicon, and post assets from the current Markdown
files. It always treats this output as one complete release: `--require-slug`
only confirms that the requested post is present; it does not limit the upload
to that post. With no upload option the command stays local. `--dry-run`
validates the AWS account, bucket, region, S3 versioning, CloudFront routing,
and shows the S3 sync/delete preview without changing production. A real upload requires both
`--upload` and `--confirm-full-release`.

The full Astro deployment entry point follows the same contract:

```powershell
powershell.exe -File scripts\deploy.ps1 -DryRun
powershell.exe -File scripts\deploy.ps1 -ConfirmFullRelease
```

Both publishing entry points stop on build or verification failure. Markdown
raw HTML is rendered as text, unsafe link/image schemes are removed, and
structured JSON embedded in scripts is escaped before either renderer emits
HTML.

## Content

- Published Markdown posts live in `content/posts/`.
- Drafts and private notes live in `content/drafts/` and `content/private/` and
  are not read by the build.
- Published posts must include one `category` frontmatter value from
  `src/config/categories.json`.
- Public post assets live under `public/notes/assets/posts/{slug}/`.
- Markdown should reference images with `/notes/assets/posts/{slug}/...` paths.
- Category pages are generated at `/notes/categories/` and
  `/notes/categories/{category-id}/`.

## Project State

Use these files as the source of truth for implementation state:

- `docs/notes-implementation-plan.md`
- `docs/progress.md`
- `docs/findings.md`
