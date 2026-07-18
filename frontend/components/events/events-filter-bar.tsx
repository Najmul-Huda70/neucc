"use client";

import type { Route } from "next";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { EVENT_CATEGORIES } from "@/types";

export function EventsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  // Debounce the free-text search so we don't push a new URL per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      if (search === (searchParams.get("search") ?? "")) return;
      updateParam("search", search);
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // reset pagination whenever filters change
    startTransition(() => router.push(`${pathname}?${params.toString()}` as Route));
  }

  return (
    <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-text)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by name…"
            className="w-full rounded-full border border-[var(--color-secondary)]/25 py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <SlidersHorizontal className={`h-5 w-5 shrink-0 text-[var(--color-secondary)] ${isPending ? "animate-pulse" : ""}`} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        >
          <option value="">All categories</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          value={searchParams.get("dateFrom") ?? ""}
          onChange={(e) => updateParam("dateFrom", e.target.value)}
          className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          aria-label="From date"
        />
        <input
          type="date"
          value={searchParams.get("dateTo") ?? ""}
          onChange={(e) => updateParam("dateTo", e.target.value)}
          className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          aria-label="To date"
        />

        <select
          value={searchParams.get("feeType") ?? ""}
          onChange={(e) => updateParam("feeType", e.target.value)}
          className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        >
          <option value="">Any fee</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>

        <select
          value={searchParams.get("sort") ?? "date"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        >
          <option value="date">Sort: Date (soonest)</option>
          <option value="fee-asc">Sort: Fee (low to high)</option>
          <option value="fee-desc">Sort: Fee (high to low)</option>
        </select>
      </div>
    </div>
  );
}
