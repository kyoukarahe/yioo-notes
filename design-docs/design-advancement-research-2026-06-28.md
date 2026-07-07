# Design Advancement Research

Date: 2026-06-28
Purpose: identify ways to advance `yioo-notes` design before the next visual
implementation pass.

## Sources Checked

- W3C WCAG 2.2, Reflow:
  https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- W3C WCAG 2.2, Target Size Minimum:
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C WCAG 2.2, Contrast Minimum:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C WCAG 2.2, Text Spacing:
  https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- MDN, Responsive Design:
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- web.dev, Core Web Vitals:
  https://web.dev/articles/vitals
- web.dev, Interaction to Next Paint:
  https://web.dev/articles/inp
- Material Design 3, Adaptive Design:
  https://m3.material.io/foundations/adaptive-design/overview

## Research Takeaways

- Mobile cannot be treated as a cropped desktop view. It needs its own
  screenshot, overflow, navigation, and text-fit checks.
- Reflow and text-spacing constraints are directly relevant to notes pages
  because article content may include long paths, inline code, lists, tables,
  and mixed-language paragraphs.
- Minimum touch target and link spacing matter even on a mostly static site
  because the header, post list, tags, and back link are all navigation targets.
- Contrast should be treated as a design token check, not only a final visual
  opinion.
- Performance should stay part of the design brief. Static notes pages should
  avoid new runtime JavaScript unless the interaction clearly earns it.
- Adaptive layout thinking is useful even if the site remains simple: compact,
  medium, and expanded widths can use the same content but different density.

## Advanced Design Directions

### 1. Add A Design Token Layer

Current CSS already uses variables. The next pass should formalize token roles:

- text roles: primary, body, muted, metadata, link, code.
- surface roles: page, article, inset, code, media frame.
- line roles: strong divider, soft divider, focus outline.
- spacing roles: shell padding, article rhythm, list item rhythm.

This would make contrast and mobile density changes safer.

### 2. Build A Stress Fixture Before Redesign

Create or keep a non-public fixture post that exercises:

- Korean and English paragraphs.
- Long title and long summary.
- Long inline code and path strings.
- Code block.
- Ordered and unordered lists.
- Blockquote.
- Table.
- Multiple images with different aspect ratios.

Do not rely only on the current two test posts when judging a design.

### 3. Make Mobile A First-Class Design Surface

Minimum future viewport matrix:

- 360x740 for narrow mobile stress.
- 390x844 for common mobile QA.
- 768x1024 for tablet or small desktop transition.
- 1440x1000 for desktop.

For each viewport, check index and one representative post.

### 4. Improve Accessibility Tooling

Add repeatable checks before a serious redesign:

- contrast script for CSS token pairs.
- Playwright overflow check for index and representative post.
- image completeness check.
- optional axe or Lighthouse accessibility pass if the dependency cost is
  acceptable.

### 5. Strengthen Article UX

Potential enhancements, only after real content exists:

- reading time and updated date treatment.
- optional table of contents for long posts.
- related notes or next/previous post links.
- richer tag presentation.
- better styling for tables, footnotes, callouts, and code-heavy posts.

### 6. Reconsider Desktop Index Composition

The current desktop index is intentionally quiet. Future options:

- keep the sparse editorial layout if post volume stays low.
- add a right-side metadata rail for recent tags, updated notes, or project
  context once the list grows.
- add compact year grouping when there are enough posts.

Do not add dashboard-like panels just to fill space. The index should stay
reading-oriented.

### 7. Preserve Static Simplicity

Avoid design features that require client-side state unless they create clear
reader value. Prefer HTML/CSS solutions for:

- responsive layout.
- print styles.
- dark mode through `prefers-color-scheme`, if added.
- focus states and skip link behavior.

## Pre-Implementation Checklist

Before the next design implementation:

- Read `design-docs/design-guidelines.md`.
- Pick the target content scenario: short notes, long essays, code-heavy logs,
  or mixed-language posts.
- Capture baseline desktop and mobile screenshots.
- Run a contrast token check.
- Confirm whether `scripts/publish-posts.mjs` needs HTML updates.
- Define the acceptance score target and screenshot list before editing CSS.
