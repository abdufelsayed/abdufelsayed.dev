import type { CollectionEntry } from "astro:content";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
    <div className="rounded-lg border border-border bg-card">
      <button
        className={cn("space-y-2 rounded-lg p-6 text-left hover:bg-muted", {
          "rounded-b-lg border-b-4 border-blue-600 bg-muted": isOpen,
        })}
        onClick={handleOnClick}
      >
        <div className="flex items-center justify-between text-black dark:text-white">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
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
              <ChevronUp className="h-4 w-4 rotate-180 transition-all" />
            ) : (
              <ChevronDown className="h-4 w-4 -rotate-180 transition-all" />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {series.data.description}
        </p>
      </button>
      {isOpen && (
        <ul className="space-y-1 p-5">
          {posts.map((post, index) => (
            <li
              key={post.id}
              className={cn(
                "relative pl-4 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-black dark:before:bg-white",
                {
                  "before:bg-blue-600 before:ring-[2.5px] before:ring-blue-600/40 dark:before:bg-blue-600":
                    current === index + 1,
                  "before:bg-muted-foreground": post.data.planned,
                }
              )}
            >
              <a
                href={!post.data.planned ? `/blog/${post.slug}` : undefined}
                className={cn("text-sm font-medium", {
                  "underline-offset-2 hover:underline": !post.data.planned,
                  "space-x-2 text-muted-foreground": post.data.planned,
                })}
              >
                <span>{post.data.title}</span>
                {post.data.planned && (
                  <span className="inline-flex items-center justify-center rounded-full bg-yellow-400 p-0.5 px-2 text-xs text-black">
                    Planned
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
