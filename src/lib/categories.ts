import fs from "node:fs";
import path from "node:path";

export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  label: string;
  description: string;
  status: CategoryStatus;
  sort: number;
  url: string;
  canonicalUrl: string;
};

type RawCategory = {
  id?: unknown;
  label?: unknown;
  description?: unknown;
  status?: unknown;
  sort?: unknown;
};

const siteUrl = "https://yioo.link";
const categoryIdPattern = /^[a-z0-9][a-z0-9-]*$/;
const categoriesPath = path.join(process.cwd(), "src", "config", "categories.json");

function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).toString();
}

function assertString(value: unknown, field: string, categoryIndex: number): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`src/config/categories.json category ${categoryIndex} is missing required field: ${field}`);
  }

  return value.trim();
}

function readRawCategories(): RawCategory[] {
  const parsed = JSON.parse(fs.readFileSync(categoriesPath, "utf8")) as { categories?: unknown };
  if (!Array.isArray(parsed.categories)) {
    throw new Error("src/config/categories.json must contain a categories array");
  }

  return parsed.categories as RawCategory[];
}

function normalizeCategory(raw: RawCategory, index: number): Category {
  const id = assertString(raw.id, "id", index);
  if (!categoryIdPattern.test(id)) {
    throw new Error(`src/config/categories.json category ${index} has an invalid id: ${id}`);
  }

  const status = raw.status === "inactive" ? "inactive" : "active";
  const sort = typeof raw.sort === "number" && Number.isFinite(raw.sort) ? raw.sort : 1000;
  const url = `/notes/categories/${id}/`;

  return {
    id,
    label: assertString(raw.label, "label", index),
    description: assertString(raw.description, "description", index),
    status,
    sort,
    url,
    canonicalUrl: absoluteUrl(url),
  };
}

function compareCategories(a: Category, b: Category): number {
  return a.sort - b.sort || a.label.localeCompare(b.label) || a.id.localeCompare(b.id);
}

export function getAllCategories(): Category[] {
  const categories = readRawCategories().map(normalizeCategory);
  const seen = new Set<string>();

  for (const category of categories) {
    if (seen.has(category.id)) {
      throw new Error(`src/config/categories.json has a duplicate category id: ${category.id}`);
    }
    seen.add(category.id);
  }

  return categories.sort(compareCategories);
}

export function getActiveCategories(): Category[] {
  return getAllCategories().filter((category) => category.status === "active");
}

export function getCategoryById(id: string): Category | undefined {
  return getAllCategories().find((category) => category.id === id);
}

export function assertActiveCategory(id: string, filePath: string): Category {
  if (!categoryIdPattern.test(id)) {
    throw new Error(`${path.relative(process.cwd(), filePath)} has an invalid category id: ${id}`);
  }

  const category = getCategoryById(id);
  if (!category) {
    throw new Error(`${path.relative(process.cwd(), filePath)} references unknown category: ${id}`);
  }

  if (category.status !== "active") {
    throw new Error(`${path.relative(process.cwd(), filePath)} references inactive category: ${id}`);
  }

  return category;
}
