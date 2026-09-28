export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

export const workshopKnowledge: KnowledgeItem[] = [
  {
    id: "ai-agent",
    title: "What is an AI agent?",
    content:
      "An AI agent is a software system in which a model can participate in deciding what actions to take toward a goal, using capabilities exposed by the application.",
    keywords: ["agent", "model", "actions", "goal", "software system"],
  },
  {
    id: "agent-tools",
    title: "Agent tools",
    content:
      "Tools give a model controlled access to external capabilities such as calculations, APIs, search, databases, or application functions. The developer defines the tools and the application executes them.",
    keywords: ["tools", "capabilities", "developer", "execute", "functions", "API"],
  },
  {
    id: "agent-safety",
    title: "Agent safety",
    content:
      "Build safer agents by validating tool inputs, restricting available capabilities, protecting secrets, limiting execution loops, and handling failures. Use human approval for sensitive or irreversible actions when appropriate.",
    keywords: ["safety", "validate", "restrict", "secrets", "limits", "human approval", "failures"],
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation (RAG)",
    content:
      "Retrieval-Augmented Generation (RAG) retrieves relevant external information at runtime and provides it to a language model when it generates a response. It does not retrain the model or change its training data. This workshop's local keyword search demonstrates the retrieval-and-generation pattern. Production systems may later use embeddings, semantic search, or vector databases.",
    keywords: ["RAG", "retrieval", "external information", "runtime", "generation", "training data", "embeddings"],
  },
  {
    id: "hackathon-guidance",
    title: "Hackathon project guidance",
    content:
      "For a workshop project, start with a clear user problem. Identify the information and actions needed, define tool boundaries, and decide where human approval is appropriate. This is general workshop guidance, not official hackathon rules.",
    keywords: ["hackathon", "project", "user problem", "information", "actions", "tool boundaries", "approval"],
  },
];
