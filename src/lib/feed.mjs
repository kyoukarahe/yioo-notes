function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rssDate(value) {
  const date = new Date(`${value}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid RSS date: ${value}`);
  }
  return date.toUTCString();
}

export function renderRssFeed(posts, site) {
  const feedUrl = new URL("/notes/rss.xml", site.baseUrl).toString();
  const notesUrl = new URL("/notes/", site.baseUrl).toString();
  const lastDate = posts
    .map((post) => post.updated ?? post.date)
    .sort((left, right) => right.localeCompare(left))[0];

  const items = posts
    .map(
      (post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(post.canonicalUrl)}</link>
      <guid isPermaLink="true">${xmlEscape(post.canonicalUrl)}</guid>
      <pubDate>${rssDate(post.date)}</pubDate>
      <description>${xmlEscape(post.summary)}</description>
${post.tags.map((tag) => `      <category>${xmlEscape(tag)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(site.title)}</title>
    <link>${xmlEscape(notesUrl)}</link>
    <description>${xmlEscape(site.description)}</description>
    <language>ko</language>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml"/>
${lastDate ? `    <lastBuildDate>${rssDate(lastDate)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
}
