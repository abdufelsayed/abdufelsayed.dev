import { useState } from "react";

type Bool<K> = (x: K, y: K) => K;

const _true = <K,>(t: K, _f: K) => t;
const _false = <K,>(_t: K, f: K) => f;

const and =
  <K,>(a: Bool<K>, b: Bool<K>) =>
  (x: K, y: K) =>
    a(b(x, y), _false(x, y));

const or =
  <K,>(a: Bool<K>, b: Bool<K>) =>
  (x: K, y: K) =>
    a(_true(x, y), b(x, y));

const not =
  <K,>(a: Bool<K>) =>
  (x: K, y: K) =>
    a(_false(x, y), _true(x, y));

const toNative = (b: Bool<boolean>) => b(true, false);

type Operation = "and" | "or" | "not";

type LambdaArg = {
  type: "simple";
  value: string;
};

type BetaReductionStep = {
  before: string; // Expression before reduction
  after: string; // Expression after reduction
  substitution?: string; // What substitution was made
};

type VisualStep = {
  type: "function_receives" | "picks" | "result" | "equals";
  description: string;
  // Function application
  func?: string;
  args?: LambdaArg[];
  // What was picked
  picked?: LambdaArg;
  result?: string;
  highlight?: boolean;
  // Beta reduction step
  betaStep?: BetaReductionStep;
};

export function ChurchOperationsDemo() {
  const [operation, setOperation] = useState<Operation>("and");
  const [x, setX] = useState(true);
  const [y, setY] = useState(false);

  const xChurch = x ? _true : _false;
  const yChurch = y ? _true : _false;

  const getResult = () => {
    switch (operation) {
      case "and":
        return toNative(and(xChurch, yChurch));
      case "or":
        return toNative(or(xChurch, yChurch));
      case "not":
        return toNative(not(xChurch));
    }
  };

  const getVisualSteps = (): VisualStep[] => {
    const xLabel = x ? "T" : "F";

    switch (operation) {
      case "and": {
        // and(x, y) = x(y, false)
        const xSym = x ? "T" : "F";
        const ySym = y ? "T" : "F";
        return [
          {
            type: "equals" as const,
            description: `${operation}(${xSym}, ${ySym}) expands to`,
            func: xSym,
            args: [
              {
                type: "simple" as const,
                value: xSym,
              },
              {
                type: "simple" as const,
                value: ySym,
              },
              {
                type: "simple" as const,
                value: "F" as const,
              },
            ],
          },
          {
            type: "function_receives" as const,
            description: `${xSym} receives two arguments`,
            func: xLabel,
            args: [
              {
                type: "simple" as const,
                value: ySym,
              },
              {
                type: "simple" as const,
                value: "F" as const,
              },
            ],
          },
          {
            type: "picks" as const,
            description: `${xLabel} picks ${x ? "first" : "second"} argument`,
            picked: x
              ? {
                  type: "simple" as const,
                  value: ySym,
                }
              : {
                  type: "simple" as const,
                  value: "F" as const,
                },
          },
        ];
      }
      case "or": {
        // or(x, y) = x(true, y)
        const xSymOr = x ? "T" : "F";
        const ySymOr = y ? "T" : "F";
        return [
          {
            type: "equals" as const,
            description: `${operation}(${xSymOr}, ${ySymOr}) expands to`,
            func: xSymOr,
            args: [
              {
                type: "simple" as const,
                value: xSymOr,
              },
              {
                type: "simple" as const,
                value: "T" as const,
              },
              {
                type: "simple" as const,
                value: ySymOr,
              },
            ],
          },
          {
            type: "function_receives" as const,
            description: `${xSymOr} receives two arguments`,
            func: xLabel,
            args: [
              {
                type: "simple" as const,
                value: "T" as const,
              },
              {
                type: "simple" as const,
                value: ySymOr,
              },
            ],
          },
          {
            type: "picks" as const,
            description: `${xLabel} picks ${x ? "first" : "second"} argument`,
            picked: x
              ? {
                  type: "simple" as const,
                  value: "T" as const,
                }
              : {
                  type: "simple" as const,
                  value: ySymOr,
                },
          },
        ];
      }
      case "not": {
        // not(x) = x(false, true)
        const xSymNot = x ? "T" : "F";
        return [
          {
            type: "equals" as const,
            description: `${operation}(${xSymNot}) expands to`,
            func: xSymNot,
            args: [
              { type: "simple" as const, value: xSymNot },
              { type: "simple" as const, value: "F" as const },
              { type: "simple" as const, value: "T" as const },
            ],
          },
          {
            type: "function_receives" as const,
            description: `${xSymNot} receives two arguments`,
            func: xLabel,
            args: [
              { type: "simple" as const, value: "F" as const },
              { type: "simple" as const, value: "T" as const },
            ],
          },
          {
            type: "picks" as const,
            description: `${xLabel} picks ${x ? "first" : "second"} argument`,
            picked: {
              type: "simple" as const,
              value: (x ? "F" : "T") as "T" | "F",
            },
          },
        ];
      }
    }
  };

  const result = getResult();
  const visualSteps = getVisualSteps();

  const renderValue = (value: string) => {
    const isTrue = value === "T";
    return (
      <div
        className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 font-mono font-semibold text-xs ${
          isTrue
            ? "border-green-500 bg-green-500/20 text-green-500"
            : "border-red-500 bg-red-500/20 text-red-500"
        }`}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="not-prose mx-auto my-8 max-w-2xl">
      {/* Operation tabs */}
      <div className="mb-4 flex justify-center gap-2">
        {(["and", "or", "not"] as Operation[]).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(op)}
            className={`rounded px-4 py-1.5 font-mono text-sm transition-colors ${
              operation === op
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Visual Expression - Operation First */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-primary/40 bg-linear-to-r from-primary/5 to-green-500/5 px-8 py-5">
        {/* Operation/Function - At the Beginning */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-16 min-w-20 items-center justify-center rounded-xl border border-primary bg-primary/10 px-4 font-bold font-mono text-lg text-primary">
            {operation}
          </div>
          <span className="font-mono text-muted-foreground text-xs">
            function
          </span>
        </div>

        {/* First Argument */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => setX(!x)}
            className={`flex h-16 w-16 items-center justify-center rounded-xl border font-bold text-xl transition-all ${
              x
                ? "border-green-500 bg-green-500/20 text-green-500 shadow-green-500/20 shadow-lg"
                : "border-red-500 bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20"
            }`}
          >
            {x ? "T" : "F"}
          </button>
          <span className="font-mono text-muted-foreground text-xs">x</span>
        </div>

        {/* Second Argument (if not NOT operation) */}
        {operation !== "not" && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => setY(!y)}
              className={`flex h-16 w-16 items-center justify-center rounded-xl border font-bold text-xl transition-all ${
                y
                  ? "border-green-500 bg-green-500/20 text-green-500 shadow-green-500/20 shadow-lg"
                  : "border-red-500 bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20"
              }`}
            >
              {y ? "T" : "F"}
            </button>
            <span className="font-mono text-muted-foreground text-xs">y</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-12 w-px bg-border" />

        {/* Result */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-xl border font-bold text-xl transition-all ${
              result
                ? "border-green-500 bg-green-500/20 text-green-500 shadow-green-500/20 shadow-lg"
                : "border-red-500 bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20"
            }`}
          >
            {result ? "T" : "F"}
          </div>
          <span className="font-mono text-muted-foreground text-xs">
            result
          </span>
        </div>
      </div>

      {/* Step-by-step visual evaluation */}
      <div className="mt-6 space-y-3">
        <div className="text-center font-mono font-semibold text-muted-foreground text-xs">
          Evaluation Steps:
        </div>
        {visualSteps.map((step, idx) => {
          if (step.type === "equals") {
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3"
              >
                <div className="text-center font-mono text-muted-foreground text-xs">
                  {step.description}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-12 min-w-16 items-center justify-center rounded-lg border border-primary bg-primary/10 px-3 font-bold font-mono text-primary text-sm">
                    {operation}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background font-mono text-xs">
                    x
                  </div>
                  {operation !== "not" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background font-mono text-xs">
                      y
                    </div>
                  )}
                  <span className="text-lg text-muted-foreground">=</span>
                  <div className="flex items-center gap-1">
                    {step.args?.map((arg, argIdx) => (
                      <div key={argIdx} className="flex items-center gap-1">
                        {renderValue(arg.value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          if (step.type === "function_receives") {
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3"
              >
                <div className="text-center font-mono text-muted-foreground text-xs">
                  {step.description}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-12 min-w-16 items-center justify-center rounded-lg border border-primary bg-primary/10 px-3 font-bold font-mono text-primary text-sm">
                    {step.func}
                  </div>
                  <div className="flex items-center gap-1">
                    {step.args?.map((arg, argIdx) => (
                      <div key={argIdx} className="flex items-center gap-1">
                        {renderValue(arg.value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          if (step.type === "picks") {
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 rounded-xl border bg-primary/10 p-3"
              >
                <div className="text-center font-mono text-muted-foreground text-xs">
                  {step.description}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-muted-foreground">→</span>
                  {step.picked && renderValue(step.picked.value)}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 text-center text-muted-foreground text-xs">
        Click the values to toggle • Watch how the function evaluates
      </div>
    </div>
  );
}
