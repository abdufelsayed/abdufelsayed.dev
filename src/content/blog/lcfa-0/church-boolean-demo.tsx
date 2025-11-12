import { useState } from "react";

type Bool<T> = (x: T, y: T) => T;

const _true = <T,>(t: T, _f: T) => t;
const _false = <T,>(_t: T, f: T) => f;

export function ChurchBooleanDemo() {
  const [selectedBoolean, setSelectedBoolean] = useState<"true" | "false">(
    "true"
  );
  const firstArg = "x";
  const secondArg = "y";

  const churchBool: Bool<string> = selectedBoolean === "true" ? _true : _false;
  const result = churchBool(firstArg, secondArg);

  const isFirstSelected = selectedBoolean === "true";

  return (
    <div className="not-prose mx-auto my-8 max-w-2xl">
      {/* Boolean Selector */}
      <div className="mb-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedBoolean("true")}
          className={`rounded px-4 py-1.5 font-mono text-sm transition-colors ${
            selectedBoolean === "true"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          true
        </button>
        <button
          type="button"
          onClick={() => setSelectedBoolean("false")}
          className={`rounded px-4 py-1.5 font-mono text-sm transition-colors ${
            selectedBoolean === "false"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          false
        </button>
      </div>

      {/* Visual Representation - Function First */}
      <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary/40 bg-linear-to-r from-primary/5 to-green-500/5 px-8 py-5">
        {/* Function Box - At the Beginning */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-primary/60 bg-primary/5 font-mono text-3xl text-primary italic">
            f
          </div>
          <span className="font-mono text-muted-foreground text-xs">
            function
          </span>
        </div>

        {/* First Argument */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-center font-bold text-2xl transition-all ${
              isFirstSelected
                ? "border-primary bg-primary/20 text-foreground shadow-lg shadow-primary/20"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {firstArg}
          </div>
          <span className="font-mono text-muted-foreground text-xs">x</span>
        </div>

        {/* Second Argument */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-center font-bold text-2xl transition-all ${
              !isFirstSelected
                ? "border-primary bg-primary/20 text-foreground shadow-lg shadow-primary/20"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {secondArg}
          </div>
          <span className="font-mono text-muted-foreground text-xs">y</span>
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-border" />

        {/* Result */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 font-bold text-2xl shadow-lg ${
              result === firstArg
                ? "border-green-500 bg-green-500/20 text-green-500 shadow-green-500/20"
                : "border-red-500 bg-red-500/20 text-red-500 shadow-red-500/20"
            }`}
          >
            {result}
          </div>
          <span className="font-mono text-muted-foreground text-xs">
            result
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 text-center text-muted-foreground text-sm">
        {selectedBoolean === "true"
          ? "true' selects the first argument (x)"
          : "false' selects the second argument (y)"}
      </div>
    </div>
  );
}
