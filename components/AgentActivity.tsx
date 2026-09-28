import type { ChatResult } from "@/lib/chat";

type AgentActivityProps = {
  result: ChatResult | null;
};

export default function AgentActivity({ result }: AgentActivityProps) {
  const calculatorWasUsed = result?.toolUsed === "calculator";

  return (
    <section className="flex min-h-[350px] flex-col rounded-3xl border border-white/[0.1] bg-slate-900/55 p-5 shadow-xl shadow-black/15 sm:p-7" aria-labelledby="activity-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live workspace</p>
          <h2 id="activity-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Agent Activity</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1.5 text-xs text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${result ? "bg-emerald-400" : "bg-slate-500"}`} aria-hidden="true" />
          {result ? "Response ready" : "Idle"}
        </span>
      </div>
      <div className="relative mt-6 flex flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700/80 bg-[#0b1422]/70 px-5 py-8">
        {calculatorWasUsed ? (
          <div aria-live="polite" className="relative">
            <p className="text-center text-sm font-semibold text-emerald-300">Tool used: calculator</p>
            <dl className="mx-auto mt-5 grid max-w-xs grid-cols-[1fr_auto] gap-x-6 gap-y-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm">
              <dt className="text-slate-400">Operation</dt>
              <dd className="text-right font-mono text-slate-200">{result.toolArguments?.operation}</dd>
              <dt className="text-slate-400">a</dt>
              <dd className="text-right font-mono text-slate-200">{result.toolArguments?.a}</dd>
              <dt className="text-slate-400">b</dt>
              <dd className="text-right font-mono text-slate-200">{result.toolArguments?.b}</dd>
              <dt className="border-t border-white/[0.08] pt-3 font-medium text-slate-300">Result</dt>
              <dd className="border-t border-white/[0.08] pt-3 text-right font-mono font-semibold text-emerald-300">
                {result.toolError ? result.toolError : result.toolResult}
              </dd>
            </dl>
            <p className="mx-auto mt-4 max-w-xs text-center text-xs leading-5 text-slate-500">
              The model requested the tool. The application ran it and sent the result back to the model.
            </p>
          </div>
        ) : result ? (
          <div aria-live="polite" className="relative text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-500" aria-hidden="true">
              <span className="text-xl">⌁</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">No tools used</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">This is a direct LLM response. The model answered without requesting the calculator.</p>
          </div>
        ) : (
          <div className="relative text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-500" aria-hidden="true">
              <span className="text-xl">⌁</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">Waiting for a request...</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">The model can answer directly or request the calculator. The application executes that function.</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="font-mono text-emerald-400/80">&gt;_</span>
        <span>{calculatorWasUsed ? "Calculator executed · one tool call" : result ? "Direct response · 0 tool calls" : "One tool available · no agent loop"}</span>
      </div>
    </section>
  );
}
