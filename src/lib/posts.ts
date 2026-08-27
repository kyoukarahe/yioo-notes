import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { assertActiveCategory, type Category } from "./categories";
import { renderMarkdownDocumentSafely, type MarkdownHeading } from "./content-security.mjs";

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  status?: "published" | "draft";
  category: string;
  tags?: string[];
  related?: string[];
  summary: string;
  cover?: string;
  socialImage?: string;
  canonical?: string;
};

export type Post = Omit<PostFrontmatter, "category"> & {
  status: "published" | "draft";
  category: Category;
  tags: string[];
  related: string[];
  sourcePath: string;
  body: string;
  html: string;
  headings: MarkdownHeading[];
  url: string;
  canonicalUrl: string;
  coverUrl?: string;
  socialImageUrl?: string;
};

export type PublicPostManifestItem = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: {
    id: string;
    label: string;
    url: string;
    canonicalUrl: string;
  };
  tags: string[];
  related: string[];
  summary: string;
  cover?: string;
  socialImage?: string;
  url: string;
  canonicalUrl: string;
};

const siteUrl = "https://yioo.link";

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).toString();
}

const postsDirectory = path.join(process.cwd(), "content", "posts");

function assertString(value: unknown, field: string, filePath: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${filePath} is missing required frontmatter field: ${field}`);
  }

  return value.trim();
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeRelated(value: unknown, filePath: string): string[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${filePath} frontmatter field related must be an array`);
  }

  const related = value.map((slug) => assertString(slug, "related", filePath));
  if (related.some((slug) => !/^[a-z0-9][a-z0-9-]*$/.test(slug))) {
    throw new Error(`${filePath} contains an invalid related post slug`);
  }
  if (new Set(related).size !== related.length) {
    throw new Error(`${filePath} contains a duplicate related post slug`);
  }
  return related;
}

function markdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

function readPost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;
  const slug = assertString(data.slug, "slug", filePath);
  const status = data.status === "draft" ? "draft" : "published";
  const url = `/notes/${slug}/`;
  const canonicalPath = typeof data.canonical === "string" ? data.canonical : url;
  const cover = typeof data.cover === "string" ? data.cover : undefined;
  const socialImage = typeof data.socialImage === "string" ? data.socialImage : undefined;
  const categoryId = assertString(data.category, "category", filePath);
  const rendered = renderMarkdownDocumentSafely(parsed.content);

  return {
    title: assertString(data.title, "title", filePath),
    slug,
    date: assertString(data.date, "date", filePath),
    updated: typeof data.updated === "string" ? data.updated : undefined,
    status,
    category: assertActiveCategory(categoryId, filePath),
    tags: normalizeTags(data.tags),
    related: normalizeRelated(data.related, filePath),
    summary: assertString(data.summary, "summary", filePath),
    cover,
    socialImage,
    canonical: canonicalPath,
    sourcePath: filePath,
    body: parsed.content,
    html: rendered.html,
    headings: rendered.headings,
    url,
    canonicalUrl: absoluteUrl(canonicalPath),
    coverUrl: cover ? absoluteUrl(cover) : undefined,
    socialImageUrl: socialImage ? absoluteUrl(socialImage) : undefined,
  };
}

export function getAllPosts(): Post[] {
  const posts = markdownFiles(postsDirectory)
    .map(readPost)
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

  const publishedSlugs = new Set(posts.map((post) => post.slug));
  for (const post of posts) {
    for (const relatedSlug of post.related) {
      if (relatedSlug === post.slug) {
        throw new Error(`${post.sourcePath} cannot relate to itself`);
      }
      if (!publishedSlugs.has(relatedSlug)) {
        throw new Error(`${post.sourcePath} references unpublished or missing related post: ${relatedSlug}`);
      }
    }
  }
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategoryId(categoryId: string): Post[] {
  return getAllPosts().filter((post) => post.category.id === categoryId);
}

export function getRelatedPosts(post: Post): Post[] {
  const postsBySlug = new Map(getAllPosts().map((candidate) => [candidate.slug, candidate]));
  return post.related.map((slug) => postsBySlug.get(slug)).filter((candidate): candidate is Post => Boolean(candidate));
}

export function getPublicPostManifest(): PublicPostManifestItem[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    updated: post.updated,
    category: {
      id: post.category.id,
      label: post.category.label,
      url: post.category.url,
      canonicalUrl: post.category.canonicalUrl,
    },
    tags: post.tags,
    related: post.related,
    summary: post.summary,
    cover: post.cover,
    socialImage: post.socialImage,
    url: post.url,
    canonicalUrl: post.canonicalUrl,
  }));
}
