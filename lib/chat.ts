import type { CalculatorArguments } from "@/lib/tools/calculator";

export type ChatResult = {
  answer: string;
  toolUsed: "calculator" | null;
  toolArguments?: CalculatorArguments;
  toolResult?: number;
  toolError?: string;
};

const calculatorOperations: CalculatorArguments["operation"][] = [
  "add",
  "subtract",
  "multiply",
  "divide",
];

export function parseChatResult(value: unknown): ChatResult {
  if (typeof value !== "object" || value === null) {
    throw new Error("The server returned an unexpected response.");
  }

  const result = value as Record<string, unknown>;
  if (typeof result.answer !== "string") {
    throw new Error("The server response is missing its answer.");
  }

  if (result.toolUsed === null) {
    return { answer: result.answer, toolUsed: null };
  }

  if (result.toolUsed !== "calculator") {
    throw new Error("The server response contains an unknown tool.");
  }

  const args = result.toolArguments;
  if (
    typeof args !== "object" ||
    args === null ||
    !("operation" in args) ||
    typeof args.operation !== "string" ||
    !calculatorOperations.includes(args.operation as CalculatorArguments["operation"]) ||
    !("a" in args) ||
    typeof args.a !== "number" ||
    !Number.isFinite(args.a) ||
    !("b" in args) ||
    typeof args.b !== "number" ||
    !Number.isFinite(args.b)
  ) {
    throw new Error("The calculator response is missing valid arguments.");
  }

  if (typeof result.toolResult === "number" && Number.isFinite(result.toolResult)) {
    return {
      answer: result.answer,
      toolUsed: "calculator",
      toolArguments: {
        operation: args.operation as CalculatorArguments["operation"],
        a: args.a,
        b: args.b,
      },
      toolResult: result.toolResult,
    };
  }

  if (typeof result.toolError === "string") {
    return {
      answer: result.answer,
      toolUsed: "calculator",
      toolArguments: {
        operation: args.operation as CalculatorArguments["operation"],
        a: args.a,
        b: args.b,
      },
      toolError: result.toolError,
    };
  }

  throw new Error("The calculator response is missing its result.");
}
