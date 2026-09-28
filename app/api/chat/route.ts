import OpenAI from "openai";
import { calculate, parseCalculatorArguments } from "@/lib/tools/calculator";
import { getWeather, parseWeatherArguments } from "@/lib/tools/weather";
import type { ChatResult, ToolExecution } from "@/lib/chat";

const calculatorTool = {
  type: "function" as const,
  name: "calculator",
  description: "Perform basic arithmetic using two numbers.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["add", "subtract", "multiply", "divide"],
      },
      a: { type: "number" },
      b: { type: "number" },
    },
    required: ["operation", "a", "b"],
    additionalProperties: false,
  },
};

const weatherTool = {
  type: "function" as const,
  name: "get_weather",
  description: "Get the current weather for a city.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      city: { type: "string" },
    },
    required: ["city"],
    additionalProperties: false,
  },
};

const availableTools = [calculatorTool, weatherTool];

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    return Response.json({ error: "Please provide a non-empty message." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The LLM is not configured on the server yet." }, { status: 503 });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: body.message.trim(),
      instructions: "Choose the calculator for arithmetic, get_weather for a current city weather question, or answer directly without a tool when neither capability is needed. The application executes requested tools and returns their results.",
      tools: availableTools,
      tool_choice: "auto",
      parallel_tool_calls: false,
    });

    const toolCalls = response.output.filter((item) => item.type === "function_call");
    if (toolCalls.length === 0) {
      const result: ChatResult = { answer: response.output_text, tools: [] };
      return Response.json(result);
    }

    // Keep this checkpoint to one tool round. The model is configured for one call;
    // this guard handles an unexpected multi-call response without executing it.
    if (toolCalls.length > 1) {
      return Response.json({ error: "The model requested more than one tool at a time. Please try one request at a time." }, { status: 502 });
    }

    const toolCall = toolCalls[0];
    const parsedArguments: unknown = JSON.parse(toolCall.arguments);
    let execution: ToolExecution;

    if (toolCall.name === "calculator") {
      const args = parseCalculatorArguments(parsedArguments);
      try {
        const value = calculate(args);
        execution = { name: "calculator", arguments: args, result: value };
      } catch (error) {
        execution = {
          name: "calculator",
          arguments: args,
          result: null,
          error: error instanceof Error ? error.message : "The calculator could not complete this operation.",
        };
      }
    } else if (toolCall.name === "get_weather") {
      const args = parseWeatherArguments(parsedArguments);
      try {
        const value = await getWeather(args);
        execution = { name: "get_weather", arguments: args, result: value };
      } catch (error) {
        execution = {
          name: "get_weather",
          arguments: args,
          result: null,
          error: error instanceof Error ? error.message : "The weather lookup could not be completed.",
        };
      }
    } else {
      return Response.json({ error: "The model requested an unsupported tool." }, { status: 502 });
    }

    const toolOutput = execution.error
      ? JSON.stringify({ error: execution.error })
      : JSON.stringify({ result: execution.result });

    const finalResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      previous_response_id: response.id,
      input: [{
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: toolOutput,
      }],
      instructions: "Use the tool result provided by the application to answer the user. If a tool returned an error, explain it clearly. Do not claim to have used any other tools.",
      tools: availableTools,
      tool_choice: "none",
    });

    const result: ChatResult = {
      answer: finalResponse.output_text,
      tools: [execution],
    };
    return Response.json(result);
  } catch {
    return Response.json({ error: "The LLM request could not be completed. Please try again." }, { status: 502 });
  }
}
