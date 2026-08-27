import type { APIRoute } from "astro";
import siteConfig from "../../config/site.config.json";
import { renderRssFeed } from "../../lib/feed.mjs";
import { getAllPosts } from "../../lib/posts";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(renderRssFeed(getAllPosts(), siteConfig), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
