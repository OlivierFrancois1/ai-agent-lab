"use client";

import { FormEvent, useState } from "react";
import { parseChatResult, type ChatResult } from "@/lib/chat";

type AgentFormProps = {
  onAnswer: (result: ChatResult | null) => void;
};

export default function AgentForm({ onAnswer }: AgentFormProps) {
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = prompt.trim();
    setAnswer("");

    if (!message) {
      setNotice("Enter a message before asking the model.");
      return;
    }

    setIsLoading(true);
    setNotice("");
    onAnswer(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "The request could not be completed. Please try again.";
        throw new Error(errorMessage);
      }

      const result = parseChatResult(payload);
      setAnswer(result.answer);
      onAnswer(result);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/[0.1] bg-slate-900/80 p-5 shadow-xl shadow-black/20 sm:p-7" aria-labelledby="ask-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Your first prompt</p>
          <h2 id="ask-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Ask the model something</h2>
        </div>
        <span className="hidden rounded-lg border border-white/[0.08] px-2.5 py-1.5 font-mono text-[11px] text-slate-500 sm:inline">01 / 04</span>
      </div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <label htmlFor="agent-prompt" className="mb-2 block text-sm font-medium text-slate-300">Message</label>
        <textarea
          id="agent-prompt"
          name="prompt"
          rows={5}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onFocus={() => setNotice("")}
          disabled={isLoading}
          placeholder="Example: Explain what an AI agent is."
          className="w-full resize-y rounded-2xl border border-slate-700/80 bg-[#0b1422] px-4 py-3.5 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-400/10"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">Your prompt stays in this browser for now.</p>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-[#06231a] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 active:translate-y-px"
          >
            {isLoading ? "Thinking..." : "Ask AI"} {!isLoading && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>
      {notice && (
        <div aria-live="polite" role="alert" className="mt-5 flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3.5 py-3 text-sm leading-5 text-amber-100">
          <span className="mt-0.5 text-amber-300" aria-hidden="true">ⓘ</span>
          <p>{notice}</p>
        </div>
      )}
      {answer && (
        <div aria-live="polite" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-4 text-sm leading-6 text-slate-200">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">LLM response</p>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
      {!notice && !answer && (
        <div aria-live="polite" className="mt-5 flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 text-sm leading-5 text-slate-400">
          <span className="mt-0.5 text-emerald-300" aria-hidden="true">ⓘ</span>
          <p>Checkpoint 3 · The developer defines the available capabilities. The model selects the relevant one; the application executes it and returns the result.</p>
        </div>
      )}
    </section>
  );
}
