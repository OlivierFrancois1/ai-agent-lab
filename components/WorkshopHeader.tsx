import { SparklesIcon } from "@/components/Icons";

export default function WorkshopHeader() {
  return (
    <header className="border-b border-line/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-foreground text-[15px] text-white">
            <SparklesIcon />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">AI Agent Lab</p>
            <p className="truncate text-xs text-secondary">Tool-using AI workshop</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-secondary">Checkpoint 5</p>
            <p className="text-xs font-semibold text-foreground">Knowledge</p>
          </div>
        </div>
      </div>
    </header>
  );
}
