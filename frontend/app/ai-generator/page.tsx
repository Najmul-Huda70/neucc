"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { API_URL } from "@/lib/api";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  FileText, 
  MessageSquareText,
  Volume2,
  ListOrdered
} from "lucide-react";
import Markdown from "markdown-to-jsx";

const PRESETS = [
  { label: "Event Description", value: "Event Description", icon: FileText, placeholder: "e.g., A 24-hour hackathon called HackFest 2026 focusing on web dev and AI solutions." },
  { label: "Social Media Post", value: "Social Media Post", icon: MessageSquareText, placeholder: "e.g., Announcing our new executive committee election results for 2026." },
  { label: "Newsletter Section", value: "Newsletter Section", icon: Volume2, placeholder: "e.g., Recap of our recent workshop on Git & GitHub basics for 1st-year students." },
  { label: "Club Announcement", value: "Club Announcement", icon: ListOrdered, placeholder: "e.g., Inviting registrations for the upcoming inter-university programming contest." }
];

export default function AiGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Event Description");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium (300 words)");
  const [copied, setCopied] = useState(false);

  // Custom fetch to pass credentials (Better Auth session cookie)
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
  };

  const { completion, complete, isLoading, error } = useCompletion({
    api: `${API_URL}/api/ai/generate`,
    fetch: customFetch,
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    complete("", {
      body: {
        topic,
        tone,
        length,
        contentType,
      }
    });
  };

  const handleRegenerate = () => {
    if (!topic.trim()) return;
    complete("", {
      body: {
        topic,
        tone,
        length,
        contentType,
      }
    });
  };

  const handleCopy = async () => {
    if (!completion) return;
    await navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!completion) return;
    const element = document.createElement("a");
    const file = new Blob([completion], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType.toLowerCase().replace(/\s+/g, "-")}-generation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activePreset = PRESETS.find(p => p.value === contentType) || PRESETS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
          <Sparkles className="h-8 w-8 text-[var(--color-secondary)] animate-pulse" />
          AI Content Generator
        </h1>
        <p className="mt-2 text-[var(--color-neutral-text)]">
          Generate premium copy, event descriptions, social media announcements, and newsletter materials instantly.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column - Configurations */}
        <div className="lg:col-span-2">
          <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm">
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Presets / Content Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          setContentType(preset.value);
                          // Clear topic placeholder suggestion if it doesn't fit
                        }}
                        className={`flex flex-col items-start p-3 rounded-lg border text-left transition ${
                          contentType === preset.value
                            ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 text-[var(--color-primary)]"
                            : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <Icon className="h-4 w-4 mb-2 text-[var(--color-secondary)]" />
                        <span className="text-xs font-semibold">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  What is this about? (Key Details)
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={activePreset.placeholder}
                  rows={4}
                  required
                  className="w-full rounded-[8px] border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-[8px] border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
                >
                  <option value="Professional">👔 Professional</option>
                  <option value="Casual / Friendly">👋 Casual / Friendly</option>
                  <option value="Excited / Hype">🔥 Excited / Hype</option>
                  <option value="Informative / Academic">📚 Informative / Academic</option>
                  <option value="Inspiring / Visionary">✨ Inspiring / Visionary</option>
                </select>
              </div>

              {/* Length Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  Target Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-[8px] border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
                >
                  <option value="Short (100 words)">Short (~100 words)</option>
                  <option value="Medium (300 words)">Medium (~300 words)</option>
                  <option value="Long (500+ words)">Long (~500+ words)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[var(--color-secondary)] py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Generation Output */}
        <div className="lg:col-span-3">
          <div className="flex flex-col h-full rounded-[12px] border border-[var(--color-secondary)]/15 bg-white shadow-sm overflow-hidden min-h-[400px]">
            {/* Output Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/55 px-6 py-4">
              <span className="text-sm font-medium text-[var(--color-neutral-text)]">
                Generated Output
              </span>
              {completion && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
                    title="Download as TXT file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-50"
                    title="Regenerate response"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>
              )}
            </div>

            {/* Output Area */}
            <div className="flex-1 p-6 overflow-y-auto min-h-[300px]">
              {completion ? (
                <div className="prose prose-neutral max-w-none text-sm leading-relaxed dark:prose-invert">
                  <Markdown>{completion}</Markdown>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500 py-12">
                  <RotateCcw className="h-8 w-8 text-[var(--color-secondary)] animate-spin mb-3" />
                  <p className="text-sm">Creating premium copy...</p>
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  An error occurred while generating content. Ensure your backend is running and configured with a valid Gemini API Key.
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-12 text-center">
                  <Sparkles className="h-12 w-12 text-neutral-200 mb-3" />
                  <p className="text-sm max-w-xs">
                    Choose your content type and details on the left, then click Generate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
