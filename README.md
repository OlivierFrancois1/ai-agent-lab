# AI Agent Lab

**AI Demo Day 1: Building with LLMs and AI Agents**

This beginner workshop builds one idea in stages: start with an LLM-powered interface, then give the application a few controlled tools, and finally let the model use retrieved workshop information. Each checkpoint is saved as a Git tag so you can compare the progression.

## What You Will Build

You will progressively turn a basic interface into an application that can:

- send a user message to an LLM and display its answer
- expose a calculator and a weather lookup as controlled tools
- let the model select between tools or answer directly
- run a bounded sequence of tool calls when a request needs multiple steps
- retrieve relevant workshop knowledge and give it to the model as context

An LLM request by itself is not an agent loop. The later checkpoints add tools and a controlled decide–act–observe cycle.

## Architecture

```text
User
  ↓
Next.js UI
  ↓
/api/chat
  ↓
OpenAI model
  ↓
Tool decision (or direct answer)
  ↓
Application validates and executes the requested tool
  ↓
Tool result (observation)
  ↓
Model
  ↓
Final answer
```

The model does **not** run JavaScript or call APIs directly. It can request a tool by returning a structured function call. The application checks that request, runs an approved function, and sends the result back to the model. The application—not the model—controls available tools and execution limits.

## Technology

The repository uses:

| Technology | Role in this project |
| --- | --- |
| Next.js 16 (App Router) | Web application and `/api/chat` route handler |
| React 19 | Interactive user interface |
| TypeScript 5 | Types for requests, results, and tools |
| Tailwind CSS 4 | Interface styling |
| OpenAI JavaScript SDK (`openai`) | Server-side access to the OpenAI Responses API |
| OpenAI Responses API | Generates answers and requests available tools |
| Open-Meteo | No-key geocoding and current-weather data |
| Local workshop knowledge | Small keyword-searchable teaching collection; no external knowledge service |

The server route currently uses `gpt-4.1-mini`. Dependency ranges and exact declarations are in `package.json`.

## Prerequisites

- Node.js and npm
- Git
- A code editor
- An OpenAI API key for checkpoints that send model requests

You do not need a database or a separate weather API key for this workshop.

## Setup

Clone the workshop repository and install its dependencies:

```bash
git clone https://github.com/OlivierFrancois1/ai-agent-lab.git
cd ai-agent-lab
npm install
```

Create a file named `.env.local` in the project root and add your key:

```text
OPENAI_API_KEY=your_key_here
```

Replace `your_key_here` locally with your own key. **Never commit `.env.local`, paste an API key into source code, or share your key in screenshots or messages.** The repository ignores `.env.local`; keep it on your computer.

Start the development server:

```bash
npm run dev
```

Open the localhost URL printed in your terminal. If the default port is busy, Next.js may offer another port; use the URL it prints.

## Workshop Checkpoints

Each tag is a preserved snapshot of the project at that stage.

### Checkpoint 0 — Starter Interface

**Tag:** `checkpoint-0-starter`

**Teaches:** the interface only. There is no LLM request, tool, or agent loop.

```text
User → UI
```

The form shows a teaching message instead of pretending to generate an answer.

### Checkpoint 1 — First LLM Request

**Tag:** `checkpoint-1-llm`

**Teaches:** a server-side request to the LLM and a direct text response.

```text
User → UI → /api/chat → LLM → Answer
```

This is an **LLM-powered application**. It is not yet the multi-step agent built later in the workshop.

### Checkpoint 2 — Calculator Tool

**Tag:** `checkpoint-2-calculator`

**Teaches:** the model can request one controlled calculator function.

```text
User
→ Model
→ Calculator request
→ Application executes calculator
→ Result returned to model
→ Final answer
```

The model does not execute the calculator itself. The application defines and runs the function.

### Checkpoint 3 — Multiple Tools

**Tag:** `checkpoint-3-tools`

**Tools:** `calculator` and `get_weather`.

The developer defines the available capabilities, the model selects a relevant one (or answers without a tool), and the application executes a requested tool.

Try:

```text
What is 47 multiplied by 83?
What is the weather in Boston right now?
```

An unrelated question may receive a direct answer with no tool call.

### Checkpoint 4 — Agent Loop

**Tag:** `checkpoint-4-agent-loop`

**Teaches:** a bounded sequence of observable tool calls and results:

```text
DECIDE → ACT → OBSERVE → DECIDE AGAIN
```

The route sets `MAX_AGENT_STEPS = 5`. This limits how many model turns the application will process. Tool availability, validation, execution, and stopping are controlled by application code: **autonomy within constraints**.

Try:

```text
What is the current temperature in Boston, and multiply it by 2?
```

Expected observable sequence:

```text
get_weather request
→ weather result
→ calculator request
→ calculation result
→ final answer
```

The activity panel shows observable tool names, arguments, results, and errors. It does not show hidden model reasoning.

### Checkpoint 5 — External Knowledge / RAG

**Tag:** `checkpoint-5-knowledge`

**Tool:** `search_knowledge` searches the workshop’s local teaching content using simple keyword matching.

```text
Retrieve → Context → Generate
```

Retrieval-Augmented Generation (RAG) is the pattern of retrieving relevant external information at runtime and supplying it as context while a model generates an answer. It does not retrain the model or change its training data. This workshop demonstrates that pattern with local keyword search. Production systems may use embeddings, semantic search, or vector databases; those are not required here.

Try:

```text
What is RAG?
```

## Moving Between Checkpoints

To inspect a saved checkpoint, you can check out its tag:

```bash
git checkout checkpoint-2-calculator
```

Checking out a tag puts Git in **detached HEAD** state. In plain language, you are viewing a saved snapshot without being on a named working branch. This is fine for inspection, but commits made there are easy to lose track of.

If you want to make and keep changes starting from a checkpoint, create a branch from it instead:

```bash
git switch -c my-checkpoint-2-work checkpoint-2-calculator
```

Use a unique branch name if that name already exists. To return to the latest workshop branch:

```bash
git switch main
```

## Tool Reference

| Tool | Purpose | Data source |
| --- | --- | --- |
| `calculator` | Add, subtract, multiply, and divide two numbers | Application function |
| `get_weather` | Look up current weather for a city | Open-Meteo |
| `search_knowledge` | Retrieve relevant workshop teaching content | Local knowledge base |

All tools are application-controlled: the application exposes their definitions, validates arguments, executes the approved function, and returns the result to the model.

## Suggested Prompts

Try these in order as you reach each checkpoint:

| Prompt | What to look for |
| --- | --- |
| “Explain what an AI agent is in one sentence.” | Direct answer; no tool is necessary |
| “What is 47 multiplied by 83?” | Calculator request and result `3901` |
| “What is the weather in Boston right now?” | Weather lookup and current conditions |
| “What is the current temperature in Boston, and multiply it by 2?” | Weather followed by calculator |
| “What is RAG?” | Workshop knowledge retrieval |
| “What safety measures should I consider when building an AI agent?” | Safety knowledge retrieval |

## Key Concepts

- **LLM:** a large language model that generates text from an input and context.
- **Tool calling:** a model requests a named function with structured arguments; application code decides whether and how to run it.
- **AI agent:** a software system where a model can help choose actions toward a goal using capabilities exposed by the application.
- **Agent loop:** a controlled cycle in which the model requests an action, the application runs it, and the model receives the result and can make another decision.
- **RAG:** retrieving relevant information and providing it to a model as context for generating an answer.
- **Human-in-the-loop:** a person reviews or approves an action, especially when it is sensitive or hard to undo.

## Safety and Control

When building tool-using applications:

- Validate tool inputs before execution.
- Expose only approved capabilities.
- Keep API keys on the server and out of source control.
- Set a maximum number of agent steps.
- Handle tool failures safely.
- Ask for human approval before sensitive or irreversible actions when appropriate.

## Troubleshooting

### Missing `OPENAI_API_KEY`

Check that `.env.local` is in the project root and contains `OPENAI_API_KEY=...`. Restart `npm run dev` after creating or changing the file. Never paste the key into an issue, commit, or screenshot.

### Port already in use

Next.js may automatically choose another available port. Use the localhost URL printed in the terminal.

### `.env.local` changes are not picked up

Stop the development server with `Ctrl+C`, then run `npm run dev` again.

### Git says “detached HEAD”

You are viewing a tag or commit rather than a named branch. To return to the latest workshop branch, run:

```bash
git switch main
```

If you intended to keep edits based on a tag, create a branch from that tag as shown in [Moving Between Checkpoints](#moving-between-checkpoints).

### Build behavior

For a normal local production build, run `npm run build`. The workshop’s day-to-day setup uses `npm run dev`.

## Workshop Challenge

Add your own tool, such as currency conversion, university information, sports scores, or event lookup. Keep the same controlled pattern:

1. Define the tool and its arguments.
2. Validate its arguments.
3. Expose the tool definition to the model.
4. Execute it in the application and return the result.
5. Display its observable activity in the UI.
6. Test when the model should and should not request it.

Keep any API keys server-side, and add only capabilities you can validate and safely control.
