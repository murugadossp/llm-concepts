import { ComicPanel } from "@/components/comic/ComicPanel";
import { ComicStrip } from "@/components/comic/ComicStrip";
import { PersonaStrip } from "@/components/comic/PersonaStrip";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import { TokenizerDemo } from "@/components/interactive/TokenizerDemo";
import { Callout } from "@/components/learn/Callout";
import { Chip } from "@/components/learn/Chip";
import { CodeBlock } from "@/components/learn/CodeBlock";
import { CodeTabs } from "@/components/learn/CodeTabs";
import { CompareTable } from "@/components/learn/CompareTable";
import { DeepDive } from "@/components/learn/DeepDive";
import { ELI5Card } from "@/components/learn/ELI5Card";
import { FlowDiagram } from "@/components/learn/FlowDiagram";
import { FreePreview } from "@/components/learn/FreePreview";
import { Infographic } from "@/components/learn/Infographic";
import { ProOnly } from "@/components/learn/ProOnly";
import { Quiz } from "@/components/learn/Quiz";
import { RememberCard } from "@/components/learn/RememberCard";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  ComicPanel,
  ComicStrip,
  SpeechBubble,
  PersonaStrip,
  ELI5Card,
  DeepDive,
  RememberCard,
  CompareTable,
  FlowDiagram,
  Infographic,
  Callout,
  Chip,
  CodeBlock,
  CodeTabs,
  TokenizerDemo,
  FreePreview,
  ProOnly,
  Quiz,
  h1: (props) => (
    <h1
      className="editorial-title mt-12 scroll-mt-24 text-4xl first:mt-0"
      style={{ color: "var(--ink)" }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="editorial-title mt-16 scroll-mt-24 text-3xl sm:text-4xl"
      style={{ color: "var(--ink)" }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold"
      style={{ color: "var(--ink)" }}
      {...props}
    />
  ),
  // Use div — MDX often nests block components inside paragraph nodes.
  p: (props) => (
    <div
      className="mdx-p mt-4 text-[1.02rem] leading-8"
      style={{ color: "var(--ink-soft)" }}
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6" style={{ color: "var(--ink-soft)" }} {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-6"
      style={{ color: "var(--ink-soft)" }}
      {...props}
    />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  strong: (props) => (
    <strong className="font-semibold" style={{ color: "var(--ink)" }} {...props} />
  ),
  code: (props) => (
    <code
      className="rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      style={{
        background: "var(--surface-muted)",
        border: "1px solid var(--border)",
        color: "var(--ink)",
      }}
      {...props}
    />
  ),
  abbr: (props) => (
    <abbr
      className="cursor-help underline decoration-dotted underline-offset-2"
      style={{ color: "var(--accent)" }}
      {...props}
    />
  ),
};
