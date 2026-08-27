export type RssPost = {
  title: string;
  date: string;
  updated?: string;
  summary: string;
  tags: string[];
  canonicalUrl: string;
};

export type RssSite = {
  title: string;
  description: string;
  baseUrl: string;
};

export function renderRssFeed(posts: RssPost[], site: RssSite): string;
