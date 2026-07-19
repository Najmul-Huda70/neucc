"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type TextUIPart = { type: "text"; text: string };
type ChatMessage = { id: string; role: string; parts?: TextUIPart[] };

function getMessageText(message: ChatMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part): part is TextUIPart => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function AiChatAssistant() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
  };

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${API_URL}/api/ai/chat`,
      credentials: "include",
      fetch: customFetch,
    }),
    onError: (err) => {
      console.error("Chat Error:", err);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session) return;
    const textToSend = input;
    setInput("");
    try {
      await sendMessage({ text: textToSend });
    } catch (err) {
      console.error(err);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-[var(--color-secondary)]/20 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[var(--color-primary)] p-4 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[var(--color-secondary)]" />
              <h3 className="font-semibold">NEUCC Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {!session ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-[var(--color-neutral-text)]">
                <Bot className="mb-2 h-10 w-10 text-[var(--color-secondary)]/40" />
                <p className="text-sm">Log in to chat with the NEUCC AI Assistant.</p>
                <Link
                  href="/login"
                  className="mt-4 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105"
                >
                  Log in
                </Link>
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-[var(--color-neutral-text)]">
                    <Bot className="mb-2 h-10 w-10 text-[var(--color-secondary)]/40" />
                    <p className="text-sm">
                      Hi! I am the NEUCC AI Assistant. How can I help you today?
                    </p>
                  </div>
                ) : null}

                {messages.map((message) => {
                  const chatMessage = message as ChatMessage;
                  const text = getMessageText(chatMessage);
                  return (
                    <div
                      key={chatMessage.id}
                      className={`flex ${chatMessage.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[85%] items-start gap-2 rounded-2xl px-4 py-2 ${
                          chatMessage.role === "user"
                            ? "bg-[var(--color-secondary)] text-white"
                            : "bg-[var(--color-neutral-bg)] text-[var(--color-primary)]"
                        }`}
                      >
                        {chatMessage.role === "assistant" && (
                          <Bot className="mt-1 h-4 w-4 shrink-0 opacity-70" />
                        )}
                        <div className="prose prose-sm max-w-none break-words text-sm">
                          <Markdown>{text}</Markdown>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-neutral-bg)] px-4 py-2 text-[var(--color-neutral-text)]">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    Failed to send message. Ensure the backend is running and configured with a valid
                    Gemini API key.
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {session && (
            <form onSubmit={handleSubmit} className="border-t border-[var(--color-secondary)]/15 p-3">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-2 pl-4 pr-10 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 rounded-full p-1.5 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-secondary)] text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Open NEUCC AI Assistant"
        >
          <MessageCircle className="h-6 w-6 transition-transform group-hover:-rotate-12" />
        </button>
      )}
    </div>
  );
}
