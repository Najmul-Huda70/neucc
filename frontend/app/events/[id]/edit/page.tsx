import { notFound } from "next/navigation";
import { getEvent } from "@/lib/data";
import { AddEventForm } from "@/components/events/add-event-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  return { title: event ? `Edit — ${event.title}` : "Event not found" };
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)]">Edit event</h1>
      <p className="mt-1 text-[var(--color-neutral-text)]">Update details for &ldquo;{event.title}&rdquo;.</p>
      <div className="mt-8">
        <AddEventForm event={event} />
      </div>
    </div>
  );
}
