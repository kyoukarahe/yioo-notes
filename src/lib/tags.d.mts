export type TagPost = {
  tags: string[];
  date: string;
  updated?: string;
};

export type TagCollection<TPost extends TagPost = TagPost> = {
  canonicalUrl: string;
  posts: TPost[];
  slug: string;
  tag: string;
  url: string;
};

export function tagSlug(tag: string): string;
export function buildTagCollections<TPost extends TagPost>(posts: TPost[]): TagCollection<TPost>[];
export function getNavigableTagCollections<TPost extends TagPost>(posts: TPost[]): TagCollection<TPost>[];
