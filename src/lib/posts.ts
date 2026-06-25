import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  status?: "published" | "draft";
  tags?: string[];
  summary: string;
  cover?: string;
  canonical?: string;
};

export type Post = PostFrontmatter & {
  status: "published" | "draft";
  tags: string[];
  sourcePath: string;
  body: string;
  html: string;
  url: string;
};

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

  return {
    title: assertString(data.title, "title", filePath),
    slug,
    date: assertString(data.date, "date", filePath),
    updated: typeof data.updated === "string" ? data.updated : undefined,
    status,
    tags: normalizeTags(data.tags),
    summary: assertString(data.summary, "summary", filePath),
    cover: typeof data.cover === "string" ? data.cover : undefined,
    canonical: typeof data.canonical === "string" ? data.canonical : undefined,
    sourcePath: filePath,
    body: parsed.content,
    html: marked.parse(parsed.content, { async: false }) as string,
    url,
  };
}

export function getAllPosts(): Post[] {
  return markdownFiles(postsDirectory)
    .map(readPost)
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
