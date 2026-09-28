import OpenAI from "openai";
import { calculate, parseCalculatorArguments } from "@/lib/tools/calculator";
import { getWeather, parseWeatherArguments } from "@/lib/tools/weather";
import { parseKnowledgeArguments, searchKnowledge } from "@/lib/tools/knowledge";
import type { ChatResult, ToolExecution } from "@/lib/chat";

const MAX_AGENT_STEPS = 5;

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

const knowledgeTool = {
  type: "function" as const,
  name: "search_knowledge",
  description: "Search the workshop knowledge base for information about AI agents, tools, agent safety, RAG, and hackathon project guidance.",
  strict: true,
  parameters: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
    additionalProperties: false,
  },
};

const availableTools = [calculatorTool, weatherTool, knowledgeTool];
const instructions = "Choose calculator for arithmetic, get_weather for current weather, search_knowledge for questions about workshop knowledge (AI agents, tools, safety, RAG, and project guidance), or answer directly when no tool is needed. After receiving tool results, decide whether another available tool is needed. The application executes tools; you do not execute code yourself.";

async function executeToolCall(
  call: { call_id: string; name: string; arguments: string },
  step: number,
): Promise<{ execution: ToolExecution; output: { type: "function_call_output"; call_id: string; output: string } }> {
  const argsFromModel: unknown = JSON.parse(call.arguments);

  if (call.name === "calculator") {
    const args = parseCalculatorArguments(argsFromModel);
    let execution: ToolExecution;

    try {
      const result = calculate(args);
      execution = { step, name: "calculator", arguments: args, result };
    } catch (error) {
      execution = {
        step,
        name: "calculator",
        arguments: args,
        result: null,
        error: error instanceof Error ? error.message : "The calculator could not complete this operation.",
      };
    }

    return {
      execution,
      output: {
        type: "function_call_output",
        call_id: call.call_id,
        output: execution.error ? JSON.stringify({ error: execution.error }) : JSON.stringify({ result: execution.result }),
      },
    };
  }

  if (call.name === "get_weather") {
    const args = parseWeatherArguments(argsFromModel);
    let execution: ToolExecution;

    try {
      const result = await getWeather(args);
      execution = { step, name: "get_weather", arguments: args, result };
    } catch (error) {
      execution = {
        step,
        name: "get_weather",
        arguments: args,
        result: null,
        error: error instanceof Error ? error.message : "The weather lookup could not be completed.",
      };
    }

    return {
      execution,
      output: {
        type: "function_call_output",
        call_id: call.call_id,
        output: execution.error ? JSON.stringify({ error: execution.error }) : JSON.stringify({ result: execution.result }),
      },
    };
  }

  if (call.name === "search_knowledge") {
    const args = parseKnowledgeArguments(argsFromModel);
    const result = searchKnowledge(args.query);
    const execution: ToolExecution = { step, name: "search_knowledge", arguments: args, result };
    return {
      execution,
      output: {
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify({ results: result }),
      },
    };
  }

  throw new Error("The model requested an unsupported tool.");
}

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
    let response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: body.message.trim(),
      instructions,
      tools: availableTools,
      tool_choice: "auto",
      parallel_tool_calls: true,
    });

    const tools: ToolExecution[] = [];

    for (let step = 1; step <= MAX_AGENT_STEPS; step += 1) {
      const toolCalls = response.output.filter((item) => item.type === "function_call");

      if (toolCalls.length === 0) {
        const result: ChatResult = {
          answer: response.output_text,
          tools,
          steps: step,
          complete: true,
        };
        return Response.json(result);
      }

      // Validate all requested names before running any call from this model step.
      const hasUnknownTool = toolCalls.some(
        (call) => call.name !== "calculator" && call.name !== "get_weather" && call.name !== "search_knowledge",
      );
      if (hasUnknownTool) {
        return Response.json({ error: "The model requested an unsupported tool." }, { status: 502 });
      }

      // A final model turn is needed to produce the answer, so do not execute
      // additional tools once the model has used its full step budget.
      if (step === MAX_AGENT_STEPS) {
        const result: ChatResult = {
          answer: `The agent reached its limit of ${MAX_AGENT_STEPS} model steps before finishing. Please try a shorter request.`,
          tools,
          steps: step,
          complete: false,
        };
        return Response.json(result);
      }

      const outputs: Array<{ type: "function_call_output"; call_id: string; output: string }> = [];
      for (const call of toolCalls) {
        const { execution, output } = await executeToolCall(call, step);
        tools.push(execution);
        outputs.push(output);
      }

      response = await client.responses.create({
        model: "gpt-4.1-mini",
        previous_response_id: response.id,
        input: outputs,
        instructions,
        tools: availableTools,
        tool_choice: "auto",
        parallel_tool_calls: true,
      });
    }

    // The loop always returns an answer or the controlled limit response above.
    return Response.json({ error: "The agent stopped before producing a response." }, { status: 502 });
  } catch {
    return Response.json({ error: "The LLM request could not be completed. Please try again." }, { status: 502 });
  }
}
