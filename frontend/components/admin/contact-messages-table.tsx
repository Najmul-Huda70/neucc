"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { ContactMessage } from "@/types";

export function ContactMessagesTable() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ContactMessage[]>("/api/contact")
      .then((items) => {
        if (!cancelled) setMessages(items);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Could not load contact messages.");
        setMessages([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (messages === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 w-full" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-10 text-center text-[var(--color-neutral-text)]">
        No messages submitted yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m._id} className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="font-medium text-[var(--color-primary)]">{m.name}</span>
              <a href={`mailto:${m.email}`} className="text-sm text-[var(--color-secondary)] hover:underline">
                {m.email}
              </a>
            </div>
            <span className="text-xs text-[var(--color-neutral-text)]">
              {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-[var(--color-neutral-text)]">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
