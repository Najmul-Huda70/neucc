"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { NewsletterSubscriber } from "@/types";

export function NewsletterSubscribersTable() {
  const [items, setItems] = useState<NewsletterSubscriber[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ items: NewsletterSubscriber[]; count: number }>("/api/newsletter")
      .then((data) => {
        if (!cancelled) setItems(data.items);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Could not load subscribers.");
        setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-10 text-center text-[var(--color-neutral-text)]">
        No newsletter subscribers yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/15 bg-white">
      <div className="flex items-center gap-2 border-b border-[var(--color-secondary)]/15 bg-[var(--color-primary)]/[0.03] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
        <Users className="h-4 w-4 text-[var(--color-secondary)]" /> {items.length} subscriber{items.length === 1 ? "" : "s"}
      </div>
      <ul className="divide-y divide-[var(--color-secondary)]/10">
        {items.map((s) => (
          <li key={s._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-[var(--color-primary)]">{s.email}</span>
            <span className="text-xs text-[var(--color-neutral-text)]">
              {new Date(s.subscribedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
