type AgentActivityProps = {
  hasResponse: boolean;
};

export default function AgentActivity({ hasResponse }: AgentActivityProps) {
  return (
    <section className="flex min-h-[350px] flex-col rounded-3xl border border-white/[0.1] bg-slate-900/55 p-5 shadow-xl shadow-black/15 sm:p-7" aria-labelledby="activity-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live workspace</p>
          <h2 id="activity-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Agent Activity</h2>
        </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1.5 text-xs text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${hasResponse ? "bg-emerald-400" : "bg-slate-500"}`} aria-hidden="true" /> {hasResponse ? "Response ready" : "Idle"}
        </span>
      </div>
      <div className="relative mt-6 flex flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700/80 bg-[#0b1422]/70 px-5 py-8 text-center">
        <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-500" aria-hidden="true">
          <span className="text-xl">⌁</span>
        </div>
        <p className="relative mt-4 text-sm font-semibold text-slate-200">{hasResponse ? "No tools used" : "Waiting for a request..."}</p>
        <p className="relative mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
          {hasResponse ? "This is a direct LLM response. No tools or actions were called." : "This panel will show the request status. Tools are not connected yet."}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="font-mono text-emerald-400/80">&gt;_</span>
        <span>{hasResponse ? "Direct response · 0 tool calls" : "Request status ready"}</span>
      </div>
    </section>
  );
}
