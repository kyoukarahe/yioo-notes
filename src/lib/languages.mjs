export function postLanguage(value) {
  if (value === undefined) return "ko";
  if (value !== "ko" && value !== "en") throw new Error(`Unsupported post language: ${value}`);
  return value;
}

export function translationSource(value) {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(value)) throw new Error("Invalid translationOf slug");
  return value;
}

// Resolve only published peers. A half-published or ambiguous pair must fail the build.
export function attachLanguageAlternates(posts) {
  const bySlug = new Map(posts.map(post => [post.slug, post]));
  const groups = new Map();
  for (const post of posts) {
    if (post.translationOf) {
      const source = bySlug.get(post.translationOf);
      if (!source || source === post || source.translationOf || source.lang === post.lang) {
        throw new Error(`Invalid or unpublished translation source for ${post.slug}`);
      }
    }
    const key = post.translationOf ?? post.slug;
    const group = groups.get(key) ?? [];
    if (group.some(peer => peer.lang === post.lang)) throw new Error(`Duplicate ${post.lang} translation for ${key}`);
    group.push(post);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    const alternates = group.length > 1 ? group.map(post => ({lang: post.lang, url: post.url, canonicalUrl: post.canonicalUrl})).sort((a,b) => a.lang.localeCompare(b.lang)) : [];
    for (const post of group) post.alternates = alternates;
  }
  return posts;
}

export const languageName = lang => lang === "en" ? "English" : "한국어";
export const ogLocale = lang => lang === "en" ? "en_US" : "ko_KR";
export const categoryLabel = (category, lang) => lang === "en" ? ({implementation:"AI & Implementation",finance:"Finance"}[category.id] ?? category.label) : category.label;
export const navLabel = (item, lang) => lang === "en" ? ({"/":"Home","/tools/":"Tools","/notes/":"Notes"}[item.href] ?? item.label) : item.label;
export const footerLabel = (item, lang) => lang === "en" ? ({"/":"Yioo Home","/tools/":"Tools","/notes/":"Notes","/terms.html":"Terms","/privacy_policy.html":"Privacy Policy","/contact.html":"Contact"}[item.href] ?? item.label) : item.label;
