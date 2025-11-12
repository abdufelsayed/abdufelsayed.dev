import { ClipboardCheck, Copy } from "lucide-preact";
import { useState } from "preact/hooks";
import { type BundledLanguage, createHighlighter } from "shiki";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/lib/button-utils";
import { cn } from "@/lib/utils";

const highlighter = await createHighlighter({
  themes: ["dracula"],
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
  lang: BundledLanguage;
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
              ).forEach((line) => {
                acc.add(line);
              });
            } else {
              acc.add(value);
            }
            return acc;
          }, new Set<number>())
        );

      const html = highlighter.codeToHtml(code, {
        lang,
        theme: "dracula",
        transformers: [
          {
            name: "custom-line-numbers",
            pre(node) {
              this.addClassToHast(node, "flex w-full text-sm !bg-background");
            },
            code(node) {
              this.addClassToHast(node, "flex flex-col w-full");
            },
            line(node, line) {
              const isHighlighted = flatLinesToHighlight?.includes(line);

              this.addClassToHast(
                node,
                "inline-flex w-full py-0.5 before:pl-3 before:pr-4 before:w-10 before:text-muted-foreground before:content-[attr(before)]"
              );

              if (isHighlighted) {
                this.addClassToHast(
                  node,
                  "bg-primary/20 border-l-4 border-l-primary!"
                );
              }

              node.properties.before = line.toString();
            },
          },
        ],
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
    <Tabs defaultValue={"0"} className="mt-4 flex flex-col rounded-lg border">
      <TabsList className="h-10 justify-between rounded-t-md rounded-b-none border-b px-4">
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
          type="button"
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
          className="not-prose scrollbar-thin scrollbar-track-muted/30 scrollbar-thumb-muted m-0 max-h-96 overflow-auto py-2"
          value={idx.toString()}
          dangerouslySetInnerHTML={{ __html: highlightedCodes[idx] }}
        />
      ))}
    </Tabs>
  );
}
