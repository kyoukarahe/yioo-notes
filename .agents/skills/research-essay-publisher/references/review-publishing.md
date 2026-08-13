# Review and publishing gates

## Draft handoff

At `DRAFT_READY`, give the author a self-contained package containing:

1. three title candidates and the recommended title;
2. target reader, angle, and one-sentence conclusion;
3. the complete draft or a direct link to the local draft file;
4. SEO package: slug, summary, category, tags, canonical, internal links;
5. source notes and the important uncertainty or counterargument;
6. cover and body-image plan, including what is already staged;
7. at most three questions that would materially improve or change the piece.

State that the Korean editorial pass and invariant checks are complete, the public AI disclosure has not been inserted, and nothing has been published. Enter `WAITING_FOR_AUTHOR_FEEDBACK`.

## AI disclosure record

At first-draft completion, keep a private record in `content/drafts/{slug}.sources.md`:

```markdown
## AI disclosure record

- status: proposed
- drafting tool: OpenAI Codex
- drafting model: {actual model used for the canonical prose draft}
- reasoning level: {actual level, or omitted when unavailable}
- editorial reviewer: Yioo
- proposed public line: {exact proposed sentence}
- insertion owner: yioo-notes-apply
```

Record actual drafting provenance, not the model that happens to run the later publishing task. If the model or contribution record is ambiguous, ask the author and leave publication blocked rather than guessing. Keep this record and the public disclosure out of the `$humanize-korean` input. At the explicit publish-approval gate, replace `status: proposed` with `status: approved` and rename `proposed public line` to `approved public line` without changing the approved wording.

The default public form is:

```markdown
---

> **AI disclosure**
>
> Researched and drafted with OpenAI Codex using {model and optional reasoning level}. Editorial review and final approval by Yioo.
```

Use `Editorial review` for the essay-level `감수`. Do not replace it with `Fact-checked by` unless a separate factual verification contract was actually completed. The author may approve a shorter or different line; store and publish the exact approved wording.

Use `Yioo` as the default public editorial identity so the disclosure matches the site byline. Change it only when the author explicitly approves a different public name for that article.

## Revision and verifier

Resolve the author's feedback into explicit changes, update the one canonical draft, and preserve declined suggestions as author decisions when useful. Then have a separate read-only verifier check:

- each consequential factual claim against its cited source;
- names, dates, quotations, numbers, links, and freshness;
- inference and opinion labels;
- counterarguments, uncertainty, and overclaiming;
- privacy, secrets, identifying details, and rights to included media;
- invented first-person claims or credentials;
- unfinished TODOs, placeholders, broken Markdown, and inconsistent terms;
- thesis, summary, and bold conclusions that use stacked modifiers, abstract-noun chains, or translated English clause order and therefore require a second reading;
- required frontmatter, active category, slug, canonical, summary, and image paths;
- title/summary accuracy and internal-link validity.

The verifier must not edit the draft. The primary agent fixes findings and reports any residual uncertainty. Then show the final title, summary, slug, category, asset list, material changes, exact target URL, and exact proposed AI disclosure line. Confirm that the article body still contains no disclosure block before production. Enter `WAITING_FOR_PUBLISH_APPROVAL`.

## Approval test

Clear commands such as `게시해`, `업로드해`, `배포해`, `이 버전으로 확정`, and `이 내용으로 올려` authorize the publishing operation described in the handoff. Positive reactions such as `좋다`, `괜찮다`, or `잘 썼다` do not.

If later feedback changes the article after approval, apply the change, rerun verification, show the changed publish set, and request approval again when the change is material.

## Production handoff

After explicit approval, use `$yioo-notes-apply` as the authoritative production workflow. It owns disclosure insertion, post promotion, validation, generated artifacts, upload to `s3://yioo-notes/notes`, CloudFront invalidation, live URL verification, implementation logging, and safe commit/push behavior.

The expected local dry run includes the equivalent of:

```powershell
npm.cmd run check
npm.cmd run publish:posts -- --slug {slug} --no-upload
npm.cmd run verify:build
git diff --check
```

Do not use these commands as a substitute for the existing publishing skill, and do not run the upload form before approval. Confirm the promoted Markdown has `status: published`, the approved disclosure appears exactly once at the article end, the category is active, only approved assets entered `public/`, and no private or draft file entered the build.

After upload, inspect the canonical post URL plus affected index/category pages from the live site. Set `PUBLISHED` only when authoritative readback shows the expected title, content, metadata, images, links, and exact disclosure. Report failures truthfully; a successful local build is not a successful publication.

If the author asked only for setup, research, drafting, or review, stop at the corresponding state. Do not infer authorization to deploy, commit, or push.
