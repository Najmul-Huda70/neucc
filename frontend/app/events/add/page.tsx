import { AddEventForm } from "@/components/events/add-event-form";

export const metadata = { title: "Add event" };

export default function AddEventPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)]">Add a new event</h1>
      <p className="mt-2 text-[var(--color-neutral-text)]">
        This event will be visible to everyone on the Events page once submitted.
      </p>
      <div className="mt-8">
        <AddEventForm />
      </div>
    </div>
  );
}
