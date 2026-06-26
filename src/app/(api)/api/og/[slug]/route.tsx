import { getChapter } from "@/lib/chapters";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const chapter = getChapter(slug);

  const title = chapter?.title ?? "LLM → Agent";
  const subtitle = chapter?.summary ?? "Interactive learning from tokens to agents.";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(135deg, #0A0B1A 0%, #3B2A78 45%, #0F4D49 100%)",
        color: "#F2F3FB",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.85 }}>LLM → Agent</div>
      <div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.85, maxWidth: 900 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: 24, opacity: 0.7 }}>llm-concepts · glass learning site</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
