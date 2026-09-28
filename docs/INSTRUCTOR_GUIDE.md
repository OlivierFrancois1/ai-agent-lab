# Instructor Guide

## AI Agent Lab · 1:30 PM–3:30 PM

Use the checkpoint tags as stable recovery points. Keep the distinction clear throughout: a direct model call is an LLM-powered application; the later stages add controlled tool use and an agent loop.

| Time | Segment | Checkpoint |
| --- | --- | --- |
| 1:30–1:40 | Welcome + what is an LLM? | — |
| 1:40–1:50 | Starter interface | 0 |
| 1:50–2:05 | First LLM request | 1 |
| 2:05–2:20 | Calculator tool | 2 |
| 2:20–2:35 | Multiple tools | 3 |
| 2:35–2:55 | Agent loop | 4 |
| 2:55–3:10 | External knowledge / RAG | 5 |
| 3:10–3:25 | Student challenge | 5 + student work |
| 3:25–3:30 | Wrap-up | Review all |

## Run of Show

### 1:30–1:40 — Welcome + What Is an LLM?

- **Teaching objective:** Establish that an LLM generates text from an input and context; it does not inherently run application code.
- **Checkpoint/tag:** Intro; no checkpoint tag.
- **What to show:** The finished AI Agent Lab interface and the architecture diagram in the README.
- **Demo prompt:** “Explain what an AI agent is in one sentence.”
- **Ask students:** “What did the model return?” “Did it run an action in our application?”
- **Key teaching statement:** “A model can generate a response, but tools and actions are provided and executed by the application.”
- **Common mistake:** Calling every application that makes an LLM request an AI agent.

### 1:40–1:50 — Checkpoint 0: Starter Interface

- **Teaching objective:** Identify the UI pieces before connecting a model.
- **Checkpoint/tag:** `checkpoint-0-starter`.
- **What to show:** Prompt form, disconnected capability cards, empty Agent Activity panel, and the checkpoint message.
- **Demo prompt:** Enter “Explain what an AI agent is in one sentence.” The UI should explain that AI is not connected yet; it should not invent an answer.
- **Ask students:** “Which parts are interface only?” “What would need to happen before this could return a model answer?”
- **Key teaching statement:** “A polished interface does not mean an AI integration is present.”
- **Common mistake:** Treating the placeholder instructional state as an AI response.

### 1:50–2:05 — Checkpoint 1: First LLM Request

- **Teaching objective:** Trace a user message through a server route to a direct model answer.
- **Checkpoint/tag:** `checkpoint-1-llm`.
- **What to show:** `components/AgentForm.tsx`, `app/api/chat/route.ts`, and the answer in the UI. Point out that the key is server-side in `.env.local`.
- **Demo prompt:** “Explain what an AI agent is in one sentence.”
- **Ask students:** “Where does the API key stay?” “Has the model been given any tools?”
- **Key teaching statement:** “This is an LLM-powered application, not yet the multi-step agent we will build later.”
- **Common mistake:** Putting an API key in browser code or calling a direct response an agent loop.

### 2:05–2:20 — Checkpoint 2: Calculator Tool

- **Teaching objective:** Show the model requesting a function and the application executing it.
- **Checkpoint/tag:** `checkpoint-2-calculator`.
- **What to show:** Calculator definition in `app/api/chat/route.ts`, implementation in `lib/tools/calculator.ts`, and its visible activity result.
- **Demo prompt:** “What is 47 multiplied by 83?” Expected calculator result: `3901`.
- **Ask students:** “Who runs the calculator function?” “What structured arguments did the application receive?”
- **Key teaching statement:** “The model requests the calculator; application code validates and executes it.”
- **Common mistake:** Assuming the model ran JavaScript or inferring the tool call from prompt keywords in application logic.

### 2:20–2:35 — Checkpoint 3: Multiple Tools

- **Teaching objective:** Compare model selection between calculator, weather, and no tool.
- **Checkpoint/tag:** `checkpoint-3-tools`.
- **What to show:** The two tool definitions and the tool activity panel.
- **Demo prompts:** “What is 47 multiplied by 83?” then “What is the weather in Boston right now?” Ask one unrelated question and observe whether a tool is needed.
- **Ask students:** “Who defines the capabilities?” “Who chooses a relevant tool, and who executes it?”
- **Key teaching statement:** “The developer defines the choices; the model can request a relevant choice; the application performs it.”
- **Common mistake:** Adding manual keyword routing or claiming that every prompt must use a tool.

### 2:35–2:55 — Checkpoint 4: Agent Loop

- **Teaching objective:** Follow observable decisions and results across more than one tool step.
- **Checkpoint/tag:** `checkpoint-4-agent-loop`.
- **What to show:** The loop in `app/api/chat/route.ts`, the `MAX_AGENT_STEPS = 5` guard, and the ordered Agent Activity trace.
- **Demo prompt:** “What is the current temperature in Boston, and multiply it by 2?” Expected: weather request/result, calculator request/result, final answer.
- **Ask students:** “What does the application send back after a tool runs?” “What stops the loop from running indefinitely?”
- **Key teaching statement:** “The model can decide again after an observation, within limits set by the application.”
- **Common mistake:** Describing hidden chain-of-thought or presenting the loop as unrestricted autonomy. Discuss only visible tool calls, arguments, results, and application controls.

### 2:55–3:10 — Checkpoint 5: External Knowledge / RAG

- **Teaching objective:** Explain runtime retrieval and how retrieved content can provide context for generation.
- **Checkpoint/tag:** `checkpoint-5-knowledge`.
- **What to show:** `data/workshopKnowledge.ts`, `lib/tools/knowledge.ts`, the `search_knowledge` tool, and retrieved results in activity.
- **Demo prompt:** “What is RAG?” Optionally follow with “What safety measures should I consider when building an AI agent?”
- **Ask students:** “Did retrieval change model training?” “Where did the retrieved information come from in this workshop?”
- **Key teaching statement:** “RAG retrieves relevant information at runtime and supplies it as context; this local keyword-search example does not retrain the model.”
- **Common mistake:** Saying every search tool is automatically RAG, or implying this workshop uses embeddings, a vector database, or official hackathon rules.

### 3:10–3:25 — Student Challenge

- **Teaching objective:** Apply the controlled tool pattern to a new capability.
- **Checkpoint/tag:** Start from `checkpoint-5-knowledge`; students should work on their own branch.
- **What to show:** Tool Reference and Workshop Challenge in the README. Suggest a small, testable tool such as a fixed currency conversion or event lookup.
- **Demo prompt:** Students write one request that should use their tool and one that should not.
- **Ask students:** “What inputs need validation?” “What should happen if the tool fails?”
- **Key teaching statement:** “A useful tool has a clear boundary, validated inputs, controlled execution, and visible results.”
- **Common mistake:** Choosing a tool that needs extensive setup or exposing an API key to the browser.

### 3:25–3:30 — Wrap-up

- **Teaching objective:** Summarize the progression from UI to LLM, tools, bounded loop, and retrieval.
- **Checkpoint/tag:** Review `checkpoint-0-starter` through `checkpoint-5-knowledge`.
- **What to show:** The checkpoint tags and compact `docs/CHECKPOINTS.md` cheat sheet.
- **Demo prompt:** “What is one thing the model requests and one thing the application controls?”
- **Ask students:** “What changed between Checkpoint 1 and Checkpoint 4?” “What would you want to build next?”
- **Key teaching statement:** “Models generate and request; applications define boundaries, execute tools, and handle results.”
- **Common mistake:** Leaving students with the impression that the model has direct access to APIs or tools.

## Instructor Recovery

### If Live Coding Breaks

Pause edits and return to a known-good checkpoint. If students only need to inspect it:

```bash
git switch main
git checkout checkpoint-3-tools
```

The tag checkout is detached and should be treated as read-only. If you need to continue editing from that checkpoint, create a temporary branch instead:

```bash
git switch main
git switch -c instructor-recovery checkpoint-3-tools
```

Choose a different branch name if `instructor-recovery` already exists. To return to the latest workshop branch:

```bash
git switch main
```

Use the next checkpoint tag as a recovery point if it contains the working feature needed for the remaining lesson. Avoid overwriting a student's branch while recovering.

### If the API or Network Fails

Do not make the workshop depend on a live request succeeding. Show the route and tool implementation from the current checkpoint, then use prepared screenshots or a previously captured activity trace to walk through the request, tool result, and final answer. Be clear that screenshots illustrate an earlier response; do not present fabricated live data as current weather.

### API Key Reminder

**Do not accidentally expose the API key.** Keep it in `.env.local`, do not paste it into source files, terminal screenshots, slides, chat, or commits. Do not ask students to share their keys.
