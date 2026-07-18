"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { ImageUploadField } from "@/components/upload/image-upload-field";
import { EVENT_CATEGORIES, type EventCategory, type EventDoc } from "@/types";

interface SpecRow {
  key: string;
  value: string;
}

function specsToRows(specs: Record<string, string>): SpecRow[] {
  const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
  return rows.length > 0 ? rows : [{ key: "", value: "" }];
}

/**
 * Shared create/edit form. Pass `event` to switch into edit mode: fields are
 * pre-filled and the submit does a PATCH to /api/events/:id instead of a
 * POST to /api/events. Both modes hit the same admin-only backend schema.
 */
export function AddEventForm({ event }: { event?: EventDoc }) {
  const router = useRouter();
  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [shortDescription, setShortDescription] = useState(event?.shortDescription ?? "");
  const [fullDescription, setFullDescription] = useState(event?.fullDescription ?? "");
  const [category, setCategory] = useState<EventCategory>(event?.category ?? "Contest");
  const [date, setDate] = useState(event ? event.date.slice(0, 10) : "");
  const [venue, setVenue] = useState(event?.venue ?? "");
  const [feeType, setFeeType] = useState<"free" | "paid">(
    !event || event.fee === "Free" ? "free" : "paid"
  );
  const [fee, setFee] = useState(event && event.fee !== "Free" ? String(event.fee) : "0");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [images, setImages] = useState<string[]>(event?.images ?? []);
  const [priority, setPriority] = useState(String(event?.priority ?? 0));
  const [specs, setSpecs] = useState<SpecRow[]>(specsToRows(event?.specs ?? {}));
  const [submitting, setSubmitting] = useState(false);

  function updateSpec(i: number, field: "key" | "value", value: string) {
    setSpecs((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) return toast.error("Title must be at least 3 characters.");
    if (shortDescription.trim().length < 3) return toast.error("Short description is too short.");
    if (fullDescription.trim().length < 10) return toast.error("Full description is too short.");
    if (!date) return toast.error("Please pick a date.");
    if (venue.trim().length < 2) return toast.error("Please enter a venue.");
    if (!imageUrl) return toast.error("Please provide a cover image (URL or upload).");

    setSubmitting(true);
    try {
      const specsObj = Object.fromEntries(
        specs.filter((r) => r.key.trim() && r.value.trim()).map((r) => [r.key.trim(), r.value.trim()])
      );

      const body = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        category,
        date: new Date(date).toISOString(),
        venue: venue.trim(),
        fee: feeType === "free" ? ("Free" as const) : Number(fee) || 0,
        imageUrl,
        images,
        specs: specsObj,
        priority: Math.min(999, Math.max(0, Number(priority) || 0)),
      };

      const result = isEdit
        ? await apiFetch<{ _id: string }>(`/api/events/${event._id}`, { method: "PATCH", body })
        : await apiFetch<{ _id: string }>("/api/events", { method: "POST", body });

      toast.success(isEdit ? "Event updated." : "Event created.");
      router.push(`/events/${result._id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Could not ${isEdit ? "update" : "create"} event.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-[var(--color-primary)]">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-primary)]">Short description</label>
        <input
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="One line shown on the events grid"
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-primary)]">Full description</label>
        <textarea
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Venue</label>
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g. CSE Dept Lab-B"
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Fee</label>
          <div className="mt-1 flex gap-2">
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value as "free" | "paid")}
              className="rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            {feeType === "paid" && (
              <input
                type="number"
                min={0}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="৳ amount"
                className="w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
              />
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Priority</label>
          <input
            type="number"
            min={0}
            max={999}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
          <p className="mt-1 text-xs text-[var(--color-neutral-text)]">
            Higher number = shown first in listings and the hero slider.
          </p>
        </div>
      </div>

      <ImageUploadField label="Cover image" value={imageUrl} onChange={setImageUrl} />

      <div>
        <label className="text-sm font-medium text-[var(--color-primary)]">Gallery images (optional)</label>
        <div className="mt-1 space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-neutral-text)]">
              <span className="truncate">{img}</span>
              <button type="button" onClick={() => setImages((arr) => arr.filter((_, idx) => idx !== i))}>
                <X className="h-4 w-4 text-[var(--color-danger)]" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <ImageUploadField
            label="Add gallery image"
            value=""
            onChange={(url) => setImages((arr) => [...arr, url])}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-primary)]">Specifications (key/value)</label>
        <div className="mt-1 space-y-2">
          {specs.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)}
                placeholder="e.g. Team size"
                className="w-1/3 rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
              />
              <input
                value={row.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                placeholder="e.g. 3 members"
                className="flex-1 rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSpecs((rows) => rows.filter((_, idx) => idx !== i))}
                className="text-[var(--color-danger)]"
                aria-label="Remove spec row"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs((rows) => [...rows, { key: "", value: "" }])}
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-secondary)]"
          >
            <Plus className="h-4 w-4" /> Add row
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isEdit ? "Save changes" : "Submit event"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-[var(--color-secondary)] px-6 py-3 text-sm font-medium text-[var(--color-secondary)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
