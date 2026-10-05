import { SparklesIcon } from "@/components/Icons";
import type { ChatResult } from "@/lib/chat";

type AgentResponseProps = {
  result: ChatResult | null;
  isLoading: boolean;
};

export default function AgentResponse({ result, isLoading }: AgentResponseProps) {
  return (
    <section aria-labelledby="response-title" className="min-w-0">
      <h2 id="response-title" className="text-sm font-semibold text-foreground">Response</h2>
      <div className="mt-4 min-h-[280px] rounded-2xl border border-line/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
        {isLoading ? (
          <div aria-live="polite" aria-busy="true">
            <div className="flex items-center gap-2.5 text-sm text-secondary">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface text-sm text-accent">
                <SparklesIcon className="animate-pulse" />
              </span>
              Thinking…
            </div>
            <div className="mt-6 space-y-3" aria-hidden="true">
              <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        ) : result ? (
          <div aria-live="polite">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-sm text-white">
                <SparklesIcon />
              </span>
              <span className="text-xs font-medium text-secondary">LLM response</span>
            </div>
            <p className="mt-5 max-w-[68ch] whitespace-pre-wrap text-[15px] leading-7 text-foreground sm:text-base sm:leading-7">
              {result.answer}
            </p>
          </div>
        ) : (
          <div className="flex h-full min-h-[216px] flex-col items-center justify-center text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-lg text-muted">
              <SparklesIcon />
            </span>
            <p className="mt-4 text-sm font-medium text-foreground">No response yet</p>
            <p className="mt-1.5 max-w-xs text-sm leading-6 text-secondary">
              The agent can now retrieve information outside the model before answering. Retrieve → Context → Generate.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
