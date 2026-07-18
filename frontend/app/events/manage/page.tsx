import Link from "next/link";
import { Plus } from "lucide-react";
import { EventsManageTable } from "@/components/events/events-manage-table";

export const metadata = { title: "Manage events" };

export default function EventsManagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[var(--color-primary)]">Manage events</h1>
          <p className="mt-1 text-[var(--color-neutral-text)]">Create, view, and remove club events.</p>
        </div>
        <Link href="/events/add" className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]">
          <Plus className="h-4 w-4" /> Add event
        </Link>
      </div>
      <div className="mt-8">
        <EventsManageTable />
      </div>
    </div>
  );
}
