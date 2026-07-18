import Link from "next/link";
import { ArrowRight, CalendarX } from "lucide-react";
import { EventCard } from "@/components/event-card";
import type { EventDoc } from "@/types";

export function UpcomingEventsSection({ events }: { events: EventDoc[] }) {
  return (
    <section id="events" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            What&apos;s on
          </span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">Upcoming events</h2>
        </div>
        <Link href="/events" className="flex items-center gap-1 text-sm font-semibold text-[var(--color-secondary)] hover:underline">
          View all events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-12 text-center">
          <CalendarX className="h-10 w-10 text-[var(--color-secondary)]" />
          <p className="mt-3 text-[var(--color-neutral-text)]">
            No events have been published yet. Check back soon, or apply to help organize one.
          </p>
          <Link href="/events/add" className="mt-4 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]">
            Propose an event
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
