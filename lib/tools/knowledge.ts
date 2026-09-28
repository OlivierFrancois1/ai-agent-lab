import { workshopKnowledge } from "@/data/workshopKnowledge";

export type KnowledgeArguments = {
  query: string;
};

export type KnowledgeResult = {
  id: string;
  title: string;
  content: string;
  score: number;
};

export function parseKnowledgeArguments(value: unknown): KnowledgeArguments {
  if (
    typeof value !== "object" ||
    value === null ||
    !("query" in value) ||
    typeof value.query !== "string" ||
    value.query.trim().length === 0
  ) {
    throw new Error("Knowledge search arguments must include a non-empty query.");
  }

  return { query: value.query.trim() };
}

function normalizeText(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function searchKnowledge(query: string): KnowledgeResult[] {
  const queryTokens = [...new Set(normalizeText(query))];
  if (queryTokens.length === 0) return [];

  return workshopKnowledge
    .map((item) => {
      const titleTokens = new Set(normalizeText(item.title));
      const contentTokens = new Set(normalizeText(item.content));
      const keywordTokens = new Set(normalizeText(item.keywords.join(" ")));
      const score = queryTokens.reduce(
        (total, token) =>
          total +
          (titleTokens.has(token) ? 3 : 0) +
          (keywordTokens.has(token) ? 2 : 0) +
          (contentTokens.has(token) ? 1 : 0),
        0,
      );

      return { id: item.id, title: item.title, content: item.content, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
