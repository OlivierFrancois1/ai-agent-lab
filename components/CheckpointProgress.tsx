const checkpoints = ["Starter", "Model", "Calculator", "Weather", "Agent loop", "Knowledge"];
const ACTIVE_CHECKPOINT = 5;

export default function CheckpointProgress() {
  return (
    <nav aria-label="Workshop checkpoints" className="mt-8">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-xs">
        {checkpoints.map((label, index) => {
          const isActive = index === ACTIVE_CHECKPOINT;
          return (
            <li key={label} className="flex items-center gap-1.5">
              <span
                aria-current={isActive ? "step" : undefined}
                className={
                  isActive
                    ? "inline-flex items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1 font-medium text-white"
                    : "inline-flex items-center gap-1.5 px-1 py-1 text-secondary"
                }
              >
                <span className={`font-mono text-[11px] ${isActive ? "text-white/60" : "text-muted"}`}>{index}</span>
                {label}
              </span>
              {index < checkpoints.length - 1 && <span className="text-line" aria-hidden="true">—</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
