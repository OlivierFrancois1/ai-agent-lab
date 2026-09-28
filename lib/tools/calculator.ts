export type CalculatorOperation = "add" | "subtract" | "multiply" | "divide";

export type CalculatorArguments = {
  operation: CalculatorOperation;
  a: number;
  b: number;
};

const operations: CalculatorOperation[] = ["add", "subtract", "multiply", "divide"];

export function parseCalculatorArguments(value: unknown): CalculatorArguments {
  if (typeof value !== "object" || value === null) {
    throw new Error("Calculator arguments must be an object.");
  }

  const args = value as Record<string, unknown>;
  if (
    typeof args.operation !== "string" ||
    !operations.includes(args.operation as CalculatorOperation) ||
    typeof args.a !== "number" ||
    !Number.isFinite(args.a) ||
    typeof args.b !== "number" ||
    !Number.isFinite(args.b)
  ) {
    throw new Error("Calculator arguments must include a supported operation and two finite numbers.");
  }

  return {
    operation: args.operation as CalculatorOperation,
    a: args.a,
    b: args.b,
  };
}

export function calculate({ operation, a, b }: CalculatorArguments): number {
  let result: number;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        throw new Error("Cannot divide by zero.");
      }
      result = a / b;
      break;
  }

  if (!Number.isFinite(result)) {
    throw new Error("The result is outside the calculator's supported range.");
  }

  return result;
}
