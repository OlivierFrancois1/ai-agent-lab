type CapabilityCardProps = {
  icon: string;
  title: string;
  description: string;
  connected: boolean;
};

export default function CapabilityCard({ icon, title, description, connected }: CapabilityCardProps) {
  return (
    <article className="group rounded-2xl border border-white/[0.09] bg-slate-900/55 p-5 shadow-lg shadow-black/10 transition-colors hover:border-white/[0.15]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/10 bg-emerald-400/[0.07] text-xl text-emerald-300" aria-hidden="true">
          {icon}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${connected ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300" : "border-slate-600/50 bg-slate-800/70 text-slate-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-slate-500"}`} aria-hidden="true" />
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
