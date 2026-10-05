"use client";

import { useState } from "react";
import AgentActivity from "@/components/AgentActivity";
import AgentForm from "@/components/AgentForm";
import AgentResponse from "@/components/AgentResponse";
import CapabilityCard from "@/components/CapabilityCard";
import CheckpointProgress from "@/components/CheckpointProgress";
import { BookOpenIcon, CalculatorIcon, CloudSunIcon } from "@/components/Icons";
import WorkshopHeader from "@/components/WorkshopHeader";
import type { ChatResult } from "@/lib/chat";

const capabilities = [
  {
    icon: <CalculatorIcon />,
    title: "Calculator",
    description: "Perform arithmetic through a controlled tool.",
    connected: true,
  },
  {
    icon: <CloudSunIcon />,
    title: "Weather",
    description: "Retrieve current weather information.",
    connected: true,
  },
  {
    icon: <BookOpenIcon />,
    title: "Knowledge",
    description: "Retrieve relevant workshop notes at runtime.",
    connected: true,
  },
];

export default function Home() {
  const [chatResult, setChatResult] = useState<ChatResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WorkshopHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl pt-14 pb-10 sm:pt-20" aria-labelledby="hero-title">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">AI Agent Lab</p>
          <h1 id="hero-title" className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Build with an AI agent.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">
            Ask a question and watch the model decide whether to answer directly or use a tool.
          </p>
          <CheckpointProgress />

          <div className="mt-10">
            <AgentForm onAnswer={setChatResult} onLoadingChange={setIsLoading} />
          </div>
        </section>

        <div className="grid gap-8 border-t border-line/80 py-12 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-10">
          <AgentResponse result={chatResult} isLoading={isLoading} />
          <AgentActivity result={chatResult} isLoading={isLoading} />
        </div>

        <section className="border-t border-line/80 py-12" aria-labelledby="capabilities-title">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="capabilities-title" className="text-xl font-semibold tracking-tight text-foreground">Available capabilities</h2>
              <p className="mt-1 text-sm text-secondary">The model can select from connected tools.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.title} {...capability} />
            ))}
          </div>
          <p className="mt-5 text-[13px] leading-6 text-secondary">
            Retrieve → Context → Generate. Retrieved information augments the answer at runtime; it does not retrain the model.
          </p>
        </section>
      </main>

      <footer className="border-t border-line/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>AI Demo Day 1 · Building with LLMs and AI Agents</span>
          <span>Checkpoint 5 <span aria-hidden="true">/</span> External knowledge</span>
        </div>
      </footer>
    </div>
  );
}
