import { useEffect, useState, useCallback } from "preact/hooks";
import { Check } from "lucide-preact";
import { cn } from "@/lib/utils";

type Heading = {
  depth: number;
  slug: string;
  text: string;
};

interface Props {
  headings: Heading[];
}

export function Toc({ headings }: Props) {
  const sections = headings.filter((heading) => heading.depth <= 2);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sectionHeights, setSectionHeights] = useState<{
    [key: string]: number;
  }>(
    sections.reduce((obj: { [key: string]: number }, heading) => {
      obj[heading.slug] = 0;
      return obj;
    }, {})
  );

  const getSectionHeights = useCallback(() => {
    const documentEl = document.documentElement;
    const scrollHeight = documentEl.scrollHeight || document.body.scrollHeight;
    const headingElements = document.querySelectorAll("h2");

    const heights: {
      [key: string]: number;
    } = {};

    for (let i = 0; i < headingElements.length; i++) {
      const sectionName = headingElements[i].id;
      const section1Top = headingElements[i].offsetTop;
      const section2Top =
        i < headingElements.length - 1
          ? headingElements[i + 1].offsetTop
          : scrollHeight;

      if (i === 0) heights["before"] = (section1Top / scrollHeight) * 100;

      heights[sectionName] = ((section2Top - section1Top) / scrollHeight) * 100;
    }

    setSectionHeights(heights);
  }, []);

  const updateProgressBar = useCallback(() => {
    let handleScroll = () => {
      const documentEl = document.documentElement;
      const headingElements = document.querySelectorAll("h2");
      const scrollHeight =
        documentEl.scrollHeight || document.body.scrollHeight;
      const scrollPosition = window.scrollY;
      const progress =
        (scrollPosition / (scrollHeight - documentEl.clientHeight)) * 100;
      setProgress(Math.round(progress));

      const headingTops = Array.from(headingElements).reduce(
        (acc: number[], e) => {
          acc.push((e.offsetTop / scrollHeight) * 100);
          return acc;
        },
        []
      );

      for (let i = 0; i < headingTops.length; i++) {
        if (i >= 0 && headingTops[i] <= progress) {
          setCurrentSection(i + 1);
        } else if (i === 0 && headingTops[i] > progress) {
          setCurrentSection(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setProgress]);

  useEffect(() => {
    getSectionHeights();
    updateProgressBar();
  }, [getSectionHeights, updateProgressBar]);

  return (
    <ul
      aria-label="Steps"
      class="relative flex h-full flex-col font-semibold text-foreground"
    >
      {sections.map((section, idx) => (
        <>
          {idx === 0 && (
            <li
              class="flex w-full gap-x-4"
              style={{ height: `${sectionHeights["before"]}%` }}
            >
              <div class="ml-[0.44rem] border-l-2"></div>
            </li>
          )}
          <li
            class="flex w-full gap-x-4"
            style={{ height: `${sectionHeights[section.slug]}%` }}
            aria-current={currentSection === idx + 1 ? "step" : false}
          >
            <div class="flex flex-col items-start ">
              <a
                class="z-10 hidden h-4 items-center justify-center gap-x-4 text-xs xl:flex"
                href={`#${section.slug}`}
              >
                <div
                  class={cn(
                    "flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 bg-background",
                    {
                      "border-primary bg-primary":
                        currentSection > idx + 1 || progress === 100,
                      "border-primary": currentSection === idx + 1,
                    }
                  )}
                >
                  <span
                    class={cn("h-1 w-1 rounded-full bg-primary", {
                      hidden: currentSection !== idx + 1 || progress === 100,
                    })}
                  ></span>
                  {(currentSection > idx + 1 || progress === 100) && <Check />}
                </div>
                <p
                  class={cn({
                    "text-primary": currentSection === idx + 1,
                  })}
                >
                  {section.text}
                </p>
              </a>
              <div class="ml-[0.44rem] h-full border-l-2"></div>
            </div>
          </li>
        </>
      ))}
      <div
        class={"absolute left-[0.44rem] top-0 z-0 border-l-2 border-primary"}
        style={{ height: `${progress}%` }}
      ></div>
    </ul>
  );
}
