export default function WorkshopHeader() {
  return (
    <header className="flex flex-col gap-8 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-start sm:justify-between sm:pb-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          AI DEMO DAY
        </div>
        <p className="mt-5 text-sm font-medium text-slate-400">AI Demo Day 1 · Building with LLMs and AI Agents</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          AI Agent Lab
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-200 sm:text-xl">Start with an LLM. Turn it into an AI agent.</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Build progressively with language models, tools, agent loops, and retrieval.
        </p>
      </div>
      <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/[0.09] bg-slate-900/70 px-4 py-3 shadow-lg shadow-black/10">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300" aria-hidden="true">◌</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Connection</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-200">Not connected</p>
        </div>
      </div>
    </header>
  );
}
