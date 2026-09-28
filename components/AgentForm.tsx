"use client";

import { FormEvent, useState } from "react";

export default function AgentForm() {
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("AI is not connected yet. We will connect the model in Checkpoint 1.");
  }

  return (
    <section className="rounded-3xl border border-white/[0.1] bg-slate-900/80 p-5 shadow-xl shadow-black/20 sm:p-7" aria-labelledby="ask-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Your first prompt</p>
          <h2 id="ask-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Ask the agent something</h2>
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
          placeholder="Example: Explain what an AI agent is."
          className="w-full resize-y rounded-2xl border border-slate-700/80 bg-[#0b1422] px-4 py-3.5 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-400/10"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">Your prompt stays in this browser for now.</p>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-[#06231a] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 active:translate-y-px"
          >
            Ask AI <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
      <div aria-live="polite" role="status" className={`mt-5 flex gap-3 rounded-xl border px-3.5 py-3 text-sm leading-5 ${notice ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-100" : "border-white/[0.07] bg-white/[0.025] text-slate-400"}`}>
        <span className="mt-0.5 text-amber-300" aria-hidden="true">ⓘ</span>
        <p>{notice || "Checkpoint 0 · The interface is ready. The AI model will be connected in the next checkpoint."}</p>
      </div>
    </section>
  );
}
