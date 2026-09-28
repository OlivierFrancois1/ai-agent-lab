"use client";

import { useState } from "react";
import AgentActivity from "@/components/AgentActivity";
import AgentForm from "@/components/AgentForm";
import CapabilityCard from "@/components/CapabilityCard";
import WorkshopHeader from "@/components/WorkshopHeader";
import type { ChatResult } from "@/lib/chat";

const capabilities = [
  {
    icon: "＋",
    title: "Calculator",
    description: "Perform arithmetic through a controlled tool.",
    connected: true,
  },
  {
    icon: "◉",
    title: "Weather",
    description: "Retrieve current weather information.",
    connected: true,
  },
  {
    icon: "⌕",
    title: "Knowledge",
    description: "Retrieve relevant workshop notes at runtime.",
    connected: true,
  },
];

export default function Home() {
  const [chatResult, setChatResult] = useState<ChatResult | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a1220] px-4 py-8 text-slate-100 sm:px-6 sm:py-12 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[540px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_58%)]" />
      <div className="relative mx-auto max-w-6xl">
        <WorkshopHeader />

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.12fr_0.88fr]">
          <AgentForm onAnswer={setChatResult} />
          <AgentActivity result={chatResult} />
        </div>

        <section className="mt-10 sm:mt-12" aria-labelledby="capabilities-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">The toolkit</p>
              <h2 id="capabilities-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Available capabilities
              </h2>
            </div>
            <p className="text-sm text-slate-400">The model can select from connected tools.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.title} {...capability} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Retrieve → Context → Generate. Retrieved information augments the answer at runtime; it does not retrain the model.
          </p>
        </section>

        <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.08] pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>AI Demo Day 1 · Building with LLMs and AI Agents</span>
          <span>Checkpoint 5 <span aria-hidden="true">/</span> External knowledge</span>
        </footer>
      </div>
    </main>
  );
}
