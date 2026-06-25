import type { APIRoute } from "astro";
import { getPublicPostManifest } from "../../lib/posts";

export const prerender = true;

export const GET: APIRoute = () => {
  const body = JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      posts: getPublicPostManifest(),
    },
    null,
    2,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};
