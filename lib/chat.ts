import type { CalculatorArguments } from "@/lib/tools/calculator";
import type { WeatherArguments, WeatherResult } from "@/lib/tools/weather";

export type ToolExecution = {
  step: number;
  name: "calculator";
  arguments: CalculatorArguments;
  result: number | null;
  error?: string;
} | {
  step: number;
  name: "get_weather";
  arguments: WeatherArguments;
  result: WeatherResult | null;
  error?: string;
};

export type ChatResult = {
  answer: string;
  tools: ToolExecution[];
  steps: number;
  complete: boolean;
};

function parseWeatherResult(value: unknown): WeatherResult {
  if (typeof value !== "object" || value === null) {
    throw new Error("The weather tool result is missing.");
  }

  const weather = value as Record<string, unknown>;
  if (
    typeof weather.city !== "string" ||
    typeof weather.temperature !== "number" ||
    !Number.isFinite(weather.temperature) ||
    typeof weather.temperatureUnit !== "string" ||
    typeof weather.windSpeed !== "number" ||
    !Number.isFinite(weather.windSpeed) ||
    typeof weather.condition !== "string"
  ) {
    throw new Error("The weather tool returned incomplete data.");
  }

  return {
    city: weather.city,
    temperature: weather.temperature,
    temperatureUnit: weather.temperatureUnit,
    windSpeed: weather.windSpeed,
    condition: weather.condition,
  };
}

function parseCalculatorActivityArguments(value: unknown): CalculatorArguments {
  if (typeof value !== "object" || value === null) {
    throw new Error("The calculator tool arguments are missing.");
  }

  const args = value as Record<string, unknown>;
  const operations: CalculatorArguments["operation"][] = ["add", "subtract", "multiply", "divide"];
  if (
    typeof args.operation !== "string" ||
    !operations.includes(args.operation as CalculatorArguments["operation"]) ||
    typeof args.a !== "number" ||
    !Number.isFinite(args.a) ||
    typeof args.b !== "number" ||
    !Number.isFinite(args.b)
  ) {
    throw new Error("The calculator tool arguments are invalid.");
  }

  return {
    operation: args.operation as CalculatorArguments["operation"],
    a: args.a,
    b: args.b,
  };
}

function parseWeatherActivityArguments(value: unknown): WeatherArguments {
  if (
    typeof value !== "object" ||
    value === null ||
    !("city" in value) ||
    typeof value.city !== "string" ||
    value.city.trim().length === 0
  ) {
    throw new Error("The weather tool arguments are invalid.");
  }

  return { city: value.city.trim() };
}

function parseToolExecution(value: unknown): ToolExecution {
  if (typeof value !== "object" || value === null) {
    throw new Error("The server returned an invalid tool result.");
  }

  const tool = value as Record<string, unknown>;
  const error = typeof tool.error === "string" ? tool.error : undefined;
  if (typeof tool.step !== "number" || !Number.isInteger(tool.step) || tool.step < 1) {
    throw new Error("The server returned an invalid tool step.");
  }

  if (tool.name === "calculator") {
    const args = parseCalculatorActivityArguments(tool.arguments);
    if (typeof tool.result === "number" && Number.isFinite(tool.result)) {
      return { step: tool.step, name: "calculator", arguments: args, result: tool.result };
    }
    if (error) return { step: tool.step, name: "calculator", arguments: args, result: null, error };
  }

  if (tool.name === "get_weather") {
    const args = parseWeatherActivityArguments(tool.arguments);
    if (tool.result !== null && tool.result !== undefined) {
      return { step: tool.step, name: "get_weather", arguments: args, result: parseWeatherResult(tool.result) };
    }
    if (error) return { step: tool.step, name: "get_weather", arguments: args, result: null, error };
  }

  throw new Error("The server returned an incomplete tool result.");
}

export function parseChatResult(value: unknown): ChatResult {
  if (typeof value !== "object" || value === null) {
    throw new Error("The server returned an unexpected response.");
  }

  const result = value as Record<string, unknown>;
  if (
    typeof result.answer !== "string" ||
    !Array.isArray(result.tools) ||
    typeof result.steps !== "number" ||
    !Number.isInteger(result.steps) ||
    result.steps < 1 ||
    typeof result.complete !== "boolean"
  ) {
    throw new Error("The server response is missing its answer, trace, or step count.");
  }

  return {
    answer: result.answer,
    tools: result.tools.map(parseToolExecution),
    steps: result.steps,
    complete: result.complete,
  };
}
