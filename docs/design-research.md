# Yioo Notes Design Research

Date: 2026-06-26
Phase: 9. Design pass

## Research Sources

- OpenAI Codex product page:
  https://openai.com/codex/
- OpenAI Developer Blog, "Designing delightful frontends with GPT-5.4":
  https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4
- OpenAI Developer Blog, "Building frontend UIs with Codex and Figma":
  https://developers.openai.com/blog/building-frontend-uis-with-codex-and-figma
- OpenAI Developer Blog, "Mastering Codex Remote for engineering":
  https://developers.openai.com/blog/mastering-codex-remote-for-engineering
- OpenAI, "Codex for every role, tool, and workflow":
  https://openai.com/index/codex-for-every-role-tool-workflow/
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world":
  https://openai.com/index/harness-engineering/

## Useful Observations

- Codex is framed as a command center for agentic coding and multi-agent work.
  This supports a design language that feels like a focused workbench, not a
  marketing splash page.
- OpenAI's frontend guidance emphasizes defining typography, palette, layout,
  and constraints before implementation. For notes, the constraints should be
  reading quality, calm hierarchy, and static-site simplicity.
- The same guidance warns against generic, overbuilt layouts. For this blog,
  avoid a dashboard, decorative card stacks, oversized marketing sections, and
  visual noise.
- Playwright and visual inspection are part of the design loop. The final
  design must be judged from rendered desktop and mobile screenshots, not from
  CSS intent alone.
- The Figma/Codex workflow highlights round-tripping real running UI into a
  design surface. This project does not need Figma yet, but live screenshots
  should act as the design artifact for review and future iterations.
- Codex Remote guidance stresses boundaries, review loops, and control. The
  design pass should be scoped like a subagent task with explicit files, clear
  rollback, and no content/SEO/AWS changes.
- Harness engineering guidance treats documentation and design history as
  first-class agent output. The design scorecard should explain why the result
  was accepted, not only that it passed tests.

## Design Brief

Design candidate name: `Workbench Notes`

Goal:

- Upgrade the first live blog design from "plain but usable" to a deliberate,
  calm reading surface for essays, research notes, and implementation logs.
- Keep the page recognizably under `yioo.link/notes` and suitable for SEO
  indexing.
- Make the interface feel like a compact agent workbench: precise, readable,
  quietly technical, and not like a SaaS landing page.

Audience:

- The primary reader is the user and future collaborators/agents reviewing
  notes, research, and implementation decisions.
- Secondary readers are search visitors arriving through `yioo.link/notes/...`.

Visual direction:

- Use a restrained editorial/workbench look.
- Favor strong typography, clear whitespace, thin separators, small metadata,
  and a stable max-width reading column.
- Use a mixed palette rather than a one-note beige, purple, dark-blue, or
  orange/brown theme.
- Accent colors may be teal/green and red/blue details, but the page should be
  mostly neutral and text-forward.

Implementation constraints:

- Keep source/content separation intact.
- Do not edit `content/posts/`, `content/drafts/`, or `content/private/`.
- Do not change canonical URL, sitemap, slug, manifest, analytics, deploy, or
  AWS behavior.
- Prefer changes in:
  - `src/styles/global.css`
  - `src/layouts/BaseLayout.astro`
  - `src/components/PostList.astro`
  - `src/config/site.config.json`
- Avoid adding runtime JavaScript.
- Keep the existing test post and image references working.

Acceptance checks:

- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run verify:build`
- Local Playwright screenshots for:
  - `/notes/` desktop and mobile
  - `/notes/2026-06-26-test-note/` desktop and mobile
- Main-agent vision inspection of screenshots.
- No console errors or warnings in Playwright.
- No horizontal overflow at 390px width.
- Design score in `docs/design-scorecard.md` must be 90 or higher before
  deploy.

Rollback:

- Revert Phase 9 design-owned files and docs.
- Do not touch Phase 5/6 AWS routing, S3 objects, deploy scripts, or
  `yioo-link` sitemap unless a separate SEO issue is discovered.
