"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { EventDoc } from "@/types";

export function EventsManageTable() {
  const [events, setEvents] = useState<EventDoc[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ items: EventDoc[] }>("/api/events?limit=50&sort=date")
      .then(({ items }) => {
        if (!cancelled) setEvents(items);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Could not load events.");
        setEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE" });
      toast.success("Event deleted.");
      setEvents((prev) => prev?.filter((e) => e._id !== id) ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event.");
    } finally {
      setDeletingId(null);
    }
  }

  if (events === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-10 text-center text-[var(--color-neutral-text)]">
        No events yet.{" "}
        <Link href="/events/add" className="font-semibold text-[var(--color-secondary)] hover:underline">Add the first one</Link>.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[12px] border border-[var(--color-secondary)]/15 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-[var(--color-secondary)]/15 bg-[var(--color-primary)]/[0.03] text-[var(--color-primary)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Fee</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border-b border-[var(--color-secondary)]/10 last:border-0">
              <td className="max-w-[240px] truncate px-4 py-3 text-[var(--color-primary)]">{event.title}</td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">{event.category}</td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">
                {new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">{event.fee === "Free" ? "Free" : `৳${event.fee}`}</td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">{event.priority}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link href={`/events/${event._id}`} className="rounded-full p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10" aria-label="View">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/events/${event._id}/edit`} className="rounded-full p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    disabled={deletingId === event._id}
                    className="rounded-full p-2 text-[var(--color-danger)] hover:bg-red-50 disabled:opacity-60"
                    aria-label="Delete"
                  >
                    {deletingId === event._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
