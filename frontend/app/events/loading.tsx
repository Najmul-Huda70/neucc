import { EventCardSkeleton } from "@/components/event-card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="skeleton h-10 w-48" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      <div className="skeleton mt-6 h-32 w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
