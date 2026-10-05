"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { AlertIcon, ArrowUpIcon, BookOpenIcon, CalculatorIcon, CloudSunIcon, LoaderIcon } from "@/components/Icons";
import { parseChatResult, type ChatResult } from "@/lib/chat";

type AgentFormProps = {
  onAnswer: (result: ChatResult | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

const suggestions = [
  { label: "Calculate something", prompt: "What is 245 multiplied by 18?", icon: CalculatorIcon },
  { label: "Check the weather", prompt: "What is the weather in Boston?", icon: CloudSunIcon },
  { label: "Ask about the workshop", prompt: "What does the workshop say about the agent loop?", icon: BookOpenIcon },
];

export default function AgentForm({ onAnswer, onLoadingChange }: AgentFormProps) {
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function updateLoading(value: boolean) {
    setIsLoading(value);
    onLoadingChange?.(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = prompt.trim();

    if (!message) {
      setNotice("Enter a message before asking the model.");
      return;
    }

    updateLoading(true);
    setNotice("");
    onAnswer(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "The request could not be completed. Please try again.";
        throw new Error(errorMessage);
      }

      const result = parseChatResult(payload);
      onAnswer(result);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      updateLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function applySuggestion(text: string) {
    setPrompt(text);
    setNotice("");
    textareaRef.current?.focus();
  }

  return (
    <section aria-label="Ask the agent">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="rounded-[18px] border border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
          <label htmlFor="agent-prompt" className="sr-only">Message</label>
          <textarea
            id="agent-prompt"
            ref={textareaRef}
            name="prompt"
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onFocus={() => setNotice("")}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-describedby="agent-prompt-hint"
            placeholder="Ask the agent anything…"
            className="block w-full resize-none rounded-t-[18px] bg-transparent px-5 pt-5 pb-2 text-base leading-7 text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-secondary"
          />
          <div className="flex items-center justify-between gap-3 px-3 pb-3 pl-5">
            <p id="agent-prompt-hint" className="flex items-center gap-2 text-xs text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Tool-enabled
              <span className="hidden text-muted sm:inline">· ⌘/Ctrl + Enter to send</span>
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin" />
                  Thinking…
                </>
              ) : (
                <>
                  Send
                  <ArrowUpIcon />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map(({ label, prompt: text, icon: SuggestionIcon }) => (
          <button
            key={label}
            type="button"
            disabled={isLoading}
            onClick={() => applySuggestion(text)}
            title={text}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-white px-3.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SuggestionIcon className="text-secondary" />
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div aria-live="polite" role="alert" className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
          <AlertIcon className="mt-1 shrink-0 text-red-600" />
          <p>{notice}</p>
        </div>
      )}
    </section>
  );
}
