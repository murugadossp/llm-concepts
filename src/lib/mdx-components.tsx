import type { MDXComponents } from "mdx/types";
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
import { RememberCard } from "@/components/learn/RememberCard";
import { ComicPanel } from "@/components/comic/ComicPanel";
import { ComicStrip } from "@/components/comic/ComicStrip";
import { PersonaStrip } from "@/components/comic/PersonaStrip";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import { TokenizerDemo } from "@/components/interactive/TokenizerDemo";

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
  h1: (props) => (
    <h1
      className="font-display mt-12 scroll-mt-24 text-3xl font-bold first:mt-0"
      style={{ color: "var(--ink)" }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-display mt-10 scroll-mt-24 text-2xl font-semibold"
      style={{ color: "var(--ink)" }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 scroll-mt-24 text-xl font-semibold" style={{ color: "var(--ink)" }} {...props} />
  ),
  // Use div — MDX often nests block components inside paragraph nodes.
  p: (props) => (
    <div className="mdx-p mt-4 leading-7" style={{ color: "var(--ink-soft)" }} {...props} />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6" style={{ color: "var(--ink-soft)" }} {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6" style={{ color: "var(--ink-soft)" }} {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  strong: (props) => <strong className="font-semibold" style={{ color: "var(--ink)" }} {...props} />,
  code: (props) => (
    <code
      className="rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      style={{ background: "var(--surface-strong)", color: "var(--accent)" }}
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
