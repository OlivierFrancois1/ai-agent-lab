# Checkpoint Cheat Sheet

| Tag | Concept | Connected tools | Best demo prompt | Expected observable behavior |
| --- | --- | --- | --- | --- |
| `checkpoint-0-starter` | UI only | None | “Explain what an AI agent is in one sentence.” | No API request; instructional not-connected message. |
| `checkpoint-1-llm` | Direct LLM request | None | “Explain what an AI agent is in one sentence.” | `/api/chat` returns a direct answer; no tool call. |
| `checkpoint-2-calculator` | One controlled tool | `calculator` | “What is 47 multiplied by 83?” | Calculator request, application result `3901`, final answer. |
| `checkpoint-3-tools` | Multiple tool selection | `calculator`, `get_weather` | “What is the weather in Boston right now?” | Model requests weather; application returns current conditions. |
| `checkpoint-4-agent-loop` | Bounded decide–act–observe loop | `calculator`, `get_weather` | “What is the current temperature in Boston, and multiply it by 2?” | Weather then calculator, with each result shown; maximum 5 model steps. |
| `checkpoint-5-knowledge` | Local retrieval / RAG pattern | `calculator`, `get_weather`, `search_knowledge` | “What is RAG?” | Local keyword results are supplied as context; retrieved results appear in activity. |

The model requests tools; application code validates and executes them. Checkpoint 5 uses local keyword retrieval and does not retrain the model.
