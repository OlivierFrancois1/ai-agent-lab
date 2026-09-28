import OpenAI from "openai";
import { calculate, parseCalculatorArguments } from "@/lib/tools/calculator";
import type { ChatResult } from "@/lib/chat";

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
      instructions: "You may request the calculator tool when a question needs arithmetic. The application executes the tool and returns its result. For other questions, answer directly.",
      tools: [calculatorTool],
      tool_choice: "auto",
      parallel_tool_calls: false,
    });

    const toolCall = response.output.find((item) => item.type === "function_call");
    if (!toolCall) {
      const result: ChatResult = { answer: response.output_text, toolUsed: null };
      return Response.json(result);
    }

    if (toolCall.name !== "calculator") {
      return Response.json({ error: "The model requested an unsupported tool." }, { status: 502 });
    }

    const args = parseCalculatorArguments(JSON.parse(toolCall.arguments) as unknown);
    let toolResult: number | undefined;
    let toolError: string | undefined;

    try {
      toolResult = calculate(args);
    } catch (error) {
      toolError = error instanceof Error ? error.message : "The calculator could not complete this operation.";
    }

    const toolOutput = toolError
      ? JSON.stringify({ error: toolError })
      : JSON.stringify({ result: toolResult });

    const finalResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      previous_response_id: response.id,
      input: [{
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: toolOutput,
      }],
      instructions: "Use the calculator result provided by the application to answer the user. If the tool returned an error, explain it clearly. Do not claim to have used any other tools.",
      tools: [calculatorTool],
      tool_choice: "none",
    });

    const result: ChatResult = {
      answer: finalResponse.output_text,
      toolUsed: "calculator",
      toolArguments: args,
      ...(toolResult === undefined ? { toolError } : { toolResult }),
    };
    return Response.json(result);
  } catch {
    return Response.json({ error: "The LLM request could not be completed. Please try again." }, { status: 502 });
  }
}
