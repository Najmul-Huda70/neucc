import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import { getEvent, getRelatedEvents, getReviews, getAttendeeCount } from "@/lib/data";
import { ImageGallery } from "@/components/events/image-gallery";
import { ReviewsSection } from "@/components/events/reviews-section";
import { EventSidebar } from "@/components/events/event-sidebar";
import { EventCard } from "@/components/event-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  return { title: event?.title ?? "Event not found" };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const [related, reviews, attendeeCount] = await Promise.all([
    getRelatedEvents(event),
    getReviews(event._id),
    event.category === "Election" ? Promise.resolve(0) : getAttendeeCount(event._id),
  ]);
  const dateLabel = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-secondary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-secondary)]">
            <Tag className="h-3 w-3" /> {event.category}
          </span>
          <h1 className="mt-3 text-3xl text-[var(--color-primary)] sm:text-4xl">{event.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--color-neutral-text)]">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {dateLabel}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.venue}</span>
          </div>

          <div className="mt-6">
            <ImageGallery images={event.images.length > 0 ? event.images : [event.imageUrl]} title={event.title} />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl text-[var(--color-primary)]">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-[var(--color-neutral-text)]">{event.fullDescription}</p>
          </div>

          {Object.keys(event.specs).length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl text-[var(--color-primary)]">Key information</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(event.specs).map(([key, value]) => (
                  <div key={key} className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-3">
                    <dt className="text-xs uppercase tracking-wide text-[var(--color-neutral-text)]">{key}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-[var(--color-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <ReviewsSection
            eventId={event._id}
            initialItems={reviews.items}
            initialAverage={reviews.average}
            initialCount={reviews.count}
          />
        </div>

        <EventSidebar event={event} initialCount={attendeeCount} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl text-[var(--color-primary)]">Related events</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
