const siteUrl = "https://yioo.link";
const tagPattern = /^[a-z0-9][a-z0-9-]*$/;

export function tagSlug(tag) {
  const slug = String(tag).trim().toLowerCase();
  if (!tagPattern.test(slug)) {
    throw new Error(`Invalid public tag: ${tag}`);
  }
  return slug;
}

export function buildTagCollections(posts) {
  const collections = new Map();

  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      const slug = tagSlug(tag);
      const current = collections.get(slug) ?? {
        canonicalUrl: new URL(`/notes/tags/${slug}/`, siteUrl).toString(),
        posts: [],
        slug,
        tag,
        url: `/notes/tags/${slug}/`,
      };
      current.posts.push(post);
      collections.set(slug, current);
    }
  }

  return [...collections.values()].sort(
    (left, right) => right.posts.length - left.posts.length || left.tag.localeCompare(right.tag),
  );
}

export function getNavigableTagCollections(posts) {
  return buildTagCollections(posts).filter((collection) => collection.posts.length >= 2);
}
