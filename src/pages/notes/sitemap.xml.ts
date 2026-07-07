import type { APIRoute } from "astro";
import { getActiveCategories } from "../../lib/categories";
import { absoluteUrl, getAllPosts } from "../../lib/posts";

export const prerender = true;

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = () => {
  const posts = getAllPosts();
  const activeCategories = getActiveCategories().filter((category) =>
    posts.some((post) => post.category.id === category.id),
  );
  const urls = [
    {
      loc: absoluteUrl("/notes/"),
      lastmod: posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10),
    },
    {
      loc: absoluteUrl("/notes/categories/"),
      lastmod: posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10),
    },
    ...activeCategories.map((category) => {
      const categoryPosts = posts.filter((post) => post.category.id === category.id);
      return {
        loc: category.canonicalUrl,
        lastmod: categoryPosts[0]?.updated ?? categoryPosts[0]?.date ?? new Date().toISOString().slice(0, 10),
      };
    }),
    ...posts.map((post) => ({
      loc: post.canonicalUrl,
      lastmod: post.updated ?? post.date,
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) =>
        `  <url>\n    <loc>${xmlEscape(url.loc)}</loc>\n    <lastmod>${xmlEscape(url.lastmod)}</lastmod>\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};
