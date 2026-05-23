import { getAllChapters } from "@/lib/chapters";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET() {
  const chapters = getAllChapters();
  const items = chapters
    .map(
      (chapter) => `
    <item>
      <title>${escapeXml(chapter.title)}</title>
      <link>${baseUrl}/chapters/${chapter.slug}</link>
      <guid>${baseUrl}/chapters/${chapter.slug}</guid>
      <description>${escapeXml(chapter.summary)}</description>
      <pubDate>${new Date(chapter.updatedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LLM → Agent</title>
    <link>${baseUrl}</link>
    <description>Interactive chapters from tokens to agents.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
