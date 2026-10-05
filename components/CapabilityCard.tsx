import type { ReactNode } from "react";

type CapabilityCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  connected: boolean;
};

export default function CapabilityCard({ icon, title, description, connected }: CapabilityCardProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-line/80 bg-white p-5 transition-colors hover:border-slate-300">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-base text-slate-700">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`} aria-hidden="true" />
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-secondary">{description}</p>
      </div>
    </article>
  );
}
