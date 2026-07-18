import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import type { EventDoc } from "@/types";

export function EventCard({ event }: { event: EventDoc }) {
  const dateLabel = new Date(event.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/15 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[var(--color-primary)]/5">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[var(--color-primary)]/90 px-3 py-1 text-xs font-medium text-white">
          <Tag className="h-3 w-3" /> {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="card-title text-base text-[var(--color-primary)] line-clamp-2">{event.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-neutral-text)]">
          {event.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-neutral-text)]">
          <CalendarDays className="h-3.5 w-3.5" /> {dateLabel}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-neutral-text)]">
          <MapPin className="h-3.5 w-3.5" /> {event.venue}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            {event.fee === "Free" ? "Free" : `৳${event.fee}`}
          </span>
          <span className="rounded-full border border-[var(--color-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-secondary)] transition group-hover:bg-[var(--color-secondary)] group-hover:text-white">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/10 bg-white">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="mt-auto flex justify-between">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
