import { cn } from "@/lib/utils";

interface Props {
  content: string;
  variant: "primary" | "warning" | "danger";
}

export function Pill({ content, variant }: Props) {
  return (
    <span
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-1.5 py-0.5 font-semibold text-xs",
        {
          "bg-primary": variant === "primary",
          "bg-amber-500 text-black": variant === "warning",
          "bg-destructive": variant === "danger",
        }
      )}
    >
      {content}
    </span>
  );
}
