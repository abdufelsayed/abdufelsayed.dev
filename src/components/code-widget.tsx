import { useState } from "preact/hooks";
import { getHighlighter, renderToHtml, setCDN, type Lang } from "shiki";
import { Copy, ClipboardCheck } from "lucide-preact";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

setCDN("https://cdn.jsdelivr.net/npm/shiki@0.14.5/");

const highlighter = await getHighlighter({
  theme: "dracula",
  langs: [
    "ocaml",
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "json",
    "python",
    "html",
    "css",
  ],
});

export interface Snippet {
  lang: Lang;
  title?: string;
  code: string;
  linesToHighlight?: (number | [number, number])[];
}

interface CodeWidgetProps {
  snippets: Snippet | Snippet[];
}

export function CodeWidget({ snippets }: CodeWidgetProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const updatesSnippets: Snippet[] = Array.isArray(snippets)
    ? snippets.map((snippet) => ({
        ...snippet,
        code: snippet.code.replace(/^\n+|\n+$/g, ""),
      }))
    : [{ ...snippets, code: snippets.code.replace(/^\n+|\n+$/g, "") }];

  const highlightedCodes = updatesSnippets.reduce(
    (acc: string[], { lang, code, linesToHighlight }) => {
      const flatLinesToHighlight =
        linesToHighlight &&
        Array.from(
          linesToHighlight.reduce((acc: Set<number>, value) => {
            if (Array.isArray(value)) {
              const start = value[0],
                end = value[1];

              Array.from(
                { length: end - start + 1 },
                (_, index) => start + index
              ).forEach((line) => acc.add(line));
            } else {
              acc.add(value);
            }
            return acc;
          }, new Set<number>())
        );

      const tokens = highlighter.codeToThemedTokens(code, lang, "dracula");

      const html = renderToHtml(tokens, {
        elements: {
          pre({ className, children }) {
            return `
              <pre class="flex w-full bg-background text-sm">
                ${children}
              </pre>
            `;
          },
          code({ className, children }) {
            return `
              <code class="flex flex-col w-full">
                ${children}
              </code>
            `;
          },
          line({ className, children, index }) {
            return `
              <line
                before=${index + 1}
                class="${cn(
                  "inline-flex w-full py-0.5 border-transparent border-l-4 before:pl-3 before:pr-4 before:w-10 before:text-muted-foreground before:content-[attr(before)]",
                  className
                )}">
                ${children}
              </line>
            `;
          },
        },
        lineOptions: flatLinesToHighlight?.map((l) => ({
          line: l,
          classes: ["bg-primary/20 border-primary"],
        })),
      });

      acc.push(html);

      return acc;
    },
    []
  );

  const handleCopy = async (idx: number) => {
    setIsCopying(true);
    await navigator.clipboard.writeText(updatesSnippets[idx].code);
    setTimeout(() => {
      setIsCopying(false);
    }, 750);
  };

  return (
    <Tabs defaultValue={"0"} className="flex flex-col rounded-lg border">
      <TabsList className="h-10 justify-between rounded-b-none rounded-t-lg border-b px-4">
        <div class="flex items-center justify-center gap-x-2">
          {updatesSnippets.map(({ title, lang }, idx) => (
            <TabsTrigger
              className="hover:text-foreground"
              value={idx.toString()}
              key={idx}
              onClick={() => {
                setActiveTab(idx);
              }}
            >
              <span>{title ? title : lang}</span>
            </TabsTrigger>
          ))}
        </div>

        <button
          class={cn(buttonVariants({ variant: "ghost" }), "h-7 w-7 p-1.5")}
          onClick={() => handleCopy(activeTab)}
        >
          {!isCopying ? (
            <Copy class="h-3.5 w-3.5" />
          ) : (
            <ClipboardCheck class="h-3.5 w-3.5" />
          )}
        </button>
      </TabsList>

      {updatesSnippets.map((_, idx) => (
        <TabsContent
          className="not-prose m-0 max-h-96 overflow-auto py-2 scrollbar-thin scrollbar-track-muted/30 scrollbar-thumb-muted"
          value={idx.toString()}
          dangerouslySetInnerHTML={{ __html: highlightedCodes[idx] }}
        />
      ))}
    </Tabs>
  );
}
