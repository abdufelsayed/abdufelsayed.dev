import type { CollectionEntry } from "astro:content";
import { ChevronDown, ChevronUp } from "lucide-preact";
import { useState } from "preact/hooks";
import { Pill } from "@/components/pill";
import { cn } from "@/lib/utils";

interface Props {
  series: CollectionEntry<"series">;
  posts: CollectionEntry<"blog">[];
  current?: number;
}

export function SeriesAccordion({ series, posts, current }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="rounded-lg border bg-card">
      <button
        type="button"
        class={cn("space-y-2 rounded-lg p-6 text-left hover:bg-muted", {
          "rounded-b-lg border-primary border-b-4 bg-muted": isOpen,
        })}
        onClick={handleOnClick}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <h3 class="font-semibold text-xl leading-none tracking-tight">
              {series.data.title}
            </h3>
            <span>{`${
              current
                ? ` • ${current} of ${posts.length}`
                : ` • ${posts.length} Posts`
            }`}</span>
          </div>
          <div>
            {isOpen ? (
              <ChevronUp class="h-4 w-4 rotate-180 transition-all" />
            ) : (
              <ChevronDown class="-rotate-180 h-4 w-4 transition-all" />
            )}
          </div>
        </div>
        <p class="text-muted-foreground text-sm">{series.data.description}</p>
      </button>
      {isOpen && (
        <ul class="space-y-1 p-5">
          {posts.map((post, index) => (
            <li
              key={post.id}
              class={cn(
                "relative pl-4 before:absolute before:top-[0.7rem] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-black dark:before:bg-white",
                {
                  "before:bg-blue-600 before:ring-[2.5px] before:ring-blue-600/40 dark:before:bg-blue-600":
                    current === index + 1,
                  "before:bg-muted-foreground": post.data.planned,
                }
              )}
            >
              <a
                href={!post.data.planned ? `/blog/${post.slug}` : undefined}
                class={cn("font-medium text-sm", {
                  "underline-offset-2 hover:underline": !post.data.planned,
                  "space-x-2 text-muted-foreground": post.data.planned,
                })}
              >
                <span>{post.data.title}</span>
                {post.data.planned && (
                  <Pill variant="warning" content="Planned" />
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
