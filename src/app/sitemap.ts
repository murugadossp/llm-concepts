import { getAllChapters } from "@/lib/chapters";
import { standaloneLibraryUrls } from "@/lib/standalone-library";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const chapters = getAllChapters();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/chapters`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chapters/llm-concepts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chapters/langgraph`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...chapters.map((chapter) => ({
      url: `${baseUrl}/chapters/${chapter.slug}`,
      lastModified: new Date(chapter.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...standaloneLibraryUrls.map((url) => ({
      url: `${baseUrl}${url}`,
      lastModified: new Date("2026-06-25"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
