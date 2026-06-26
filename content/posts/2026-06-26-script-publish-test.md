---
title: "Script Publish Test Note"
slug: "2026-06-26-script-publish-test"
date: "2026-06-26"
updated: "2026-06-26"
status: "published"
tags:
  - notes
  - publish
summary: "A test note verifying that a post and its image can be reflected through the publish script without a full Astro build."
cover: "/notes/assets/posts/2026-06-26-script-publish-test/script-publish-flow.svg"
canonical: "/notes/2026-06-26-script-publish-test/"
---

This note verifies the content-only publishing path for Yioo Notes.

The intended flow is small and repeatable: create or update Markdown, place post assets under the matching asset folder, run the publish script, then refresh the live page after CloudFront invalidation completes.

![Script publish flow](/notes/assets/posts/2026-06-26-script-publish-test/script-publish-flow.svg)

For a future post-writing agent, the important boundary is that content updates do not require changing the Astro layout or rebuilding the full site. The script regenerates the notes index, each post page, the manifest, and the sitemap from the current Markdown files.
