import type { ChatResult, ToolExecution } from "@/lib/chat";

type AgentActivityProps = {
  result: ChatResult | null;
};

function getToolSections(tool: ToolExecution) {
  const argumentRows: Array<{ label: string; value: string }> = [];
  const resultRows: Array<{ label: string; value: string }> = [];

  if (tool.name === "calculator") {
    const args = tool.arguments;
    argumentRows.push(
      { label: "Operation", value: args.operation },
      { label: "a", value: String(args.a) },
      { label: "b", value: String(args.b) },
    );
    if (typeof tool.result === "number") {
      resultRows.push({ label: "Result", value: String(tool.result) });
    }
  } else {
    const args = tool.arguments;
    argumentRows.push({ label: "City", value: args.city });
    if (tool.result !== null && typeof tool.result === "object") {
      const weather = tool.result;
      resultRows.push(
        { label: "City", value: weather.city },
        { label: "Temperature", value: `${weather.temperature} ${weather.temperatureUnit}` },
        { label: "Wind speed", value: `${weather.windSpeed} km/h` },
        { label: "Condition", value: weather.condition },
      );
    }
  }

  return [
    { title: "Arguments", rows: argumentRows },
    ...(resultRows.length ? [{ title: "Result", rows: resultRows }] : []),
  ];
}

export default function AgentActivity({ result }: AgentActivityProps) {
  const toolCount = result?.tools.length ?? 0;
  const toolsByStep = new Map<number, ToolExecution[]>();
  result?.tools.forEach((tool) => {
    const stepTools = toolsByStep.get(tool.step) ?? [];
    stepTools.push(tool);
    toolsByStep.set(tool.step, stepTools);
  });

  return (
    <section className="flex min-h-[350px] flex-col rounded-3xl border border-white/[0.1] bg-slate-900/55 p-5 shadow-xl shadow-black/15 sm:p-7" aria-labelledby="activity-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live workspace</p>
          <h2 id="activity-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Agent Activity</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1.5 text-xs text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${result?.complete ? "bg-emerald-400" : "bg-slate-500"}`} aria-hidden="true" />
          {result ? (result.complete ? "Response ready" : "Step limit reached") : "Idle"}
        </span>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700/80 bg-[#0b1422]/70 px-5 py-8">
        {!result ? (
          <div className="relative text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-500" aria-hidden="true">
              <span className="text-xl">⌁</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">Waiting for a request...</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">Tool activity will appear here when the model requests a tool.</p>
          </div>
        ) : toolCount === 0 && result.complete ? (
          <div aria-live="polite" className="relative text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-500" aria-hidden="true">
              <span className="text-xl">⌁</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">No tools used</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">This was a direct LLM response.</p>
          </div>
        ) : (
          <div aria-live="polite" className="relative space-y-4">
            {[...toolsByStep.entries()].map(([step, stepTools]) => (
              <section key={step} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Step {step}</h3>
                {stepTools.map((tool, index) => (
                  <article key={`${tool.name}-${index}`} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <h4 className="text-center text-sm font-semibold text-emerald-300">Tool used: {tool.name}</h4>
                    <div className="mx-auto mt-4 max-w-sm space-y-4">
                      {getToolSections(tool).map((section) => (
                        <div key={section.title}>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{section.title}</p>
                          <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
                            {section.rows.map((row) => (
                              <div key={row.label} className="contents">
                                <dt className="text-slate-400">{row.label}</dt>
                                <dd className="text-right font-mono text-slate-200">{row.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                      {tool.error && <p className="text-sm text-amber-200">Tool error: {tool.error}</p>}
                    </div>
                  </article>
                ))}
              </section>
            ))}
            <div className="mx-auto max-w-xs text-center text-xs leading-5 text-slate-500">
              {result.complete ? <p>Final answer ready. Observable tool activity is shown above.</p> : <p>The application stopped at its maximum model step count.</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="font-mono text-emerald-400/80">&gt;_</span>
        <span>
          {result
            ? `${toolCount} tool ${toolCount === 1 ? "call" : "calls"} · ${result.steps} model ${result.steps === 1 ? "step" : "steps"}`
            : "Agent activity ready"}
        </span>
      </div>
    </section>
  );
}
