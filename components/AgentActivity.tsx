import type { ReactNode } from "react";
import { AlertIcon, BookOpenIcon, CalculatorIcon, CheckIcon, CloudSunIcon, LoaderIcon, SparklesIcon, UserIcon } from "@/components/Icons";
import type { ChatResult, ToolExecution } from "@/lib/chat";

type AgentActivityProps = {
  result: ChatResult | null;
  isLoading?: boolean;
};

type Row = { label: string; value: string };

type TimelineEntry = {
  key: string;
  icon: ReactNode;
  title: string;
  meta?: string;
  tone?: "default" | "active" | "done" | "warn";
  children?: ReactNode;
};

const toolDetails: Record<ToolExecution["name"], { label: string; icon: ReactNode }> = {
  calculator: { label: "Calculator", icon: <CalculatorIcon /> },
  get_weather: { label: "Weather", icon: <CloudSunIcon /> },
  search_knowledge: { label: "Knowledge search", icon: <BookOpenIcon /> },
};

function getToolSections(tool: ToolExecution) {
  const argumentRows: Row[] = [];
  const resultRows: Row[] = [];

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
  } else if (tool.name === "get_weather") {
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
  } else {
    argumentRows.push({ label: "Query", value: tool.arguments.query });
    if (tool.result) {
      resultRows.push(...tool.result.map((item, index) => ({
        label: `${index + 1}. ${item.title}`,
        value: item.content,
      })));
      if (tool.result.length === 0) resultRows.push({ label: "Matches", value: "No relevant workshop notes found." });
    }
  }

  return { argumentRows, resultRows };
}

function Rows({ rows, stacked }: { rows: Row[]; stacked?: boolean }) {
  return (
    <dl className="space-y-1.5 text-[13px]">
      {rows.map((row) => (
        <div key={row.label} className={stacked ? "" : "flex items-baseline justify-between gap-4"}>
          <dt className={stacked ? "font-medium text-foreground" : "shrink-0 text-secondary"}>{row.label}</dt>
          <dd className={stacked ? "mt-0.5 leading-5 text-secondary" : "min-w-0 break-words text-right font-mono text-foreground"}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function buildTimeline(result: ChatResult): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    { key: "request", icon: <UserIcon />, title: "Request received", meta: "Your prompt was sent to the model", tone: "done" },
  ];

  for (let step = 1; step <= result.steps; step += 1) {
    const stepTools = result.tools.filter((tool) => tool.step === step);
    const isLast = step === result.steps;
    entries.push({
      key: `step-${step}`,
      icon: <SparklesIcon />,
      title: `Model step ${step}`,
      meta: stepTools.length
        ? `Decided to use ${stepTools.length} ${stepTools.length === 1 ? "tool" : "tools"}`
        : isLast && result.complete
          ? result.tools.length === 0 ? "No tools used — this was a direct LLM response" : "Wrote the final answer"
          : "Continued reasoning",
      tone: "done",
    });

    stepTools.forEach((tool, index) => {
      const { label, icon } = toolDetails[tool.name];
      const { argumentRows, resultRows } = getToolSections(tool);
      entries.push({
        key: `tool-${step}-${index}`,
        icon,
        title: `Called ${label}`,
        meta: `Tool used: ${tool.name}`,
        tone: tool.error ? "warn" : "done",
        children: (
          <div className="mt-3 space-y-3 rounded-xl border border-line/80 bg-surface p-3.5">
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">Arguments</p>
              <Rows rows={argumentRows} />
            </div>
            {resultRows.length > 0 && (
              <div className="border-t border-line/80 pt-3">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">Result</p>
                <Rows rows={resultRows} stacked={tool.name === "search_knowledge"} />
              </div>
            )}
            {tool.error && (
              <p className="flex gap-2 border-t border-line/80 pt-3 text-[13px] leading-5 text-amber-800">
                <AlertIcon className="mt-0.5 shrink-0" />
                Tool error: {tool.error}
              </p>
            )}
          </div>
        ),
      });
    });
  }

  entries.push(
    result.complete
      ? { key: "final", icon: <CheckIcon />, title: "Final response", meta: "Final answer ready", tone: "done" }
      : { key: "final", icon: <AlertIcon />, title: "Step limit reached", meta: "The application stopped at its maximum model step count.", tone: "warn" },
  );

  return entries;
}

const markerTone = {
  default: "border-line bg-white text-secondary",
  active: "border-blue-200 bg-blue-50 text-accent",
  done: "border-line bg-white text-slate-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
};

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative">
      {entries.map((entry, index) => (
        <li key={entry.key} className="relative flex gap-3.5 pb-6 last:pb-0">
          {index < entries.length - 1 && (
            <span className="absolute top-8 bottom-0 left-[15px] w-px bg-line" aria-hidden="true" />
          )}
          <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm ${markerTone[entry.tone ?? "default"]}`}>
            {entry.icon}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-sm font-medium text-foreground">{entry.title}</h3>
            </div>
            {entry.meta && <p className="mt-0.5 text-[13px] leading-5 text-secondary">{entry.meta}</p>}
            {entry.children}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AgentActivity({ result, isLoading = false }: AgentActivityProps) {
  const toolCount = result?.tools.length ?? 0;
  const status = isLoading ? "Running" : result ? (result.complete ? "Response ready" : "Step limit reached") : "Idle";
  const statusDot = isLoading ? "bg-blue-500 animate-pulse" : result ? (result.complete ? "bg-emerald-500" : "bg-amber-500") : "bg-slate-300";

  return (
    <section aria-labelledby="activity-title" className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <h2 id="activity-title" className="text-sm font-semibold text-foreground">Agent activity</h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-line/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div aria-live="polite">
          {isLoading ? (
            <Timeline
              entries={[
                { key: "request", icon: <UserIcon />, title: "Request received", meta: "Your prompt was sent to the model", tone: "done" },
                { key: "running", icon: <LoaderIcon className="animate-spin" />, title: "Model is working", meta: "Deciding whether to answer directly or use a tool…", tone: "active" },
              ]}
            />
          ) : result ? (
            <Timeline entries={buildTimeline(result)} />
          ) : (
            <div className="py-6 text-center">
              <ol className="mx-auto inline-flex flex-col gap-2 text-left text-[13px] text-secondary">
                {["Your prompt", "Model decides", "Tool runs (if needed)", "Final answer"].map((label, index) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-line font-mono text-[10px] text-muted">{index + 1}</span>
                    {label}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm font-medium text-foreground">Waiting for a request...</p>
              <p className="mx-auto mt-1 max-w-xs text-[13px] leading-5 text-secondary">Tool activity will appear here when the model requests a tool.</p>
            </div>
          )}
        </div>

        <p className="mt-6 border-t border-line/80 pt-4 font-mono text-[11px] text-muted">
          {result
            ? `${toolCount} tool ${toolCount === 1 ? "call" : "calls"} · ${result.steps} model ${result.steps === 1 ? "step" : "steps"}`
            : "Agent activity ready"}
        </p>
      </div>
    </section>
  );
}
