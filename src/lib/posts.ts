import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { assertActiveCategory, type Category } from "./categories";

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  status?: "published" | "draft";
  category: string;
  tags?: string[];
  summary: string;
  cover?: string;
  canonical?: string;
};

export type Post = Omit<PostFrontmatter, "category"> & {
  status: "published" | "draft";
  category: Category;
  tags: string[];
  sourcePath: string;
  body: string;
  html: string;
  url: string;
  canonicalUrl: string;
  coverUrl?: string;
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
  summary: string;
  cover?: string;
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
  const categoryId = assertString(data.category, "category", filePath);

  return {
    title: assertString(data.title, "title", filePath),
    slug,
    date: assertString(data.date, "date", filePath),
    updated: typeof data.updated === "string" ? data.updated : undefined,
    status,
    category: assertActiveCategory(categoryId, filePath),
    tags: normalizeTags(data.tags),
    summary: assertString(data.summary, "summary", filePath),
    cover,
    canonical: canonicalPath,
    sourcePath: filePath,
    body: parsed.content,
    html: marked.parse(parsed.content, { async: false }) as string,
    url,
    canonicalUrl: absoluteUrl(canonicalPath),
    coverUrl: cover ? absoluteUrl(cover) : undefined,
  };
}

export function getAllPosts(): Post[] {
  return markdownFiles(postsDirectory)
    .map(readPost)
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategoryId(categoryId: string): Post[] {
  return getAllPosts().filter((post) => post.category.id === categoryId);
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
    summary: post.summary,
    cover: post.cover,
    url: post.url,
    canonicalUrl: post.canonicalUrl,
  }));
}
