import { Suspense } from "react";
import { getEvents } from "@/lib/data";
import { EventCard, EventCardSkeleton } from "@/components/event-card";
import { EventsFilterBar } from "@/components/events/events-filter-bar";
import { Pagination } from "@/components/events/pagination";
import { CalendarX } from "lucide-react";
import Link from "next/link";
import type { EventCategory } from "@/types";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = { title: "Events" };

async function EventsGrid({ sp }: { sp: Record<string, string | undefined> }) {
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const { items, total } = await getEvents({
    search: sp.search,
    category: sp.category as EventCategory | undefined,
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
    feeType: sp.feeType as "free" | "paid" | undefined,
    sort: sp.sort as "date" | "fee-asc" | "fee-desc" | undefined,
    page,
    limit: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));
  const searchParams = new URLSearchParams(
    Object.entries(sp).filter(([, v]) => v !== undefined) as [string, string][]
  );

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-12 text-center">
        <CalendarX className="h-10 w-10 text-[var(--color-secondary)]" />
        <p className="mt-3 text-[var(--color-neutral-text)]">
          No events match these filters yet.
        </p>
        <Link href="/events" className="mt-4 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-[var(--color-neutral-text)]">{total} event{total === 1 ? "" : "s"} found</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)] sm:text-4xl">Events</h1>
      <p className="mt-2 text-[var(--color-neutral-text)]">
        Contests, fests, workshops, and the Executive Committee Election — all in one place.
      </p>

      <div className="mt-6">
        <EventsFilterBar />
      </div>

      <Suspense key={JSON.stringify(sp)} fallback={<GridSkeleton />}>
        <EventsGrid sp={sp} />
      </Suspense>
    </div>
  );
}
