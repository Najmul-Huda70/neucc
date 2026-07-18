"use client";

import { useState, useTransition } from "react";
import { Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { Review } from "@/types";

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= Math.round(value) ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-secondary)]/25"}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({
  eventId,
  initialItems,
  initialAverage,
  initialCount,
}: {
  eventId: string;
  initialItems: Review[];
  initialAverage: number;
  initialCount: number;
}) {
  const { data: session } = useSession();
  const [items, setItems] = useState(initialItems);
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    try {
      const data = await apiFetch<{ items: Review[]; average: number; count: number }>(
        `/api/reviews/event/${eventId}`
      );
      setItems(data.items);
      setAverage(data.average);
      setCount(data.count);
    } catch {
      // Non-fatal — the optimistic UI already reflects the submission.
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim().length < 1) {
      toast.error("Please write a short comment.");
      return;
    }
    startTransition(async () => {
      try {
        await apiFetch("/api/reviews", { method: "POST", body: { eventId, rating, comment } });
        toast.success("Review submitted.");
        setComment("");
        await refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not submit review.");
      }
    });
  }

  return (
    <section id="reviews" className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-[var(--color-primary)]">Reviews &amp; ratings</h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-text)]">
            <Stars value={average} /> {average.toFixed(1)} ({count})
          </div>
        )}
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="mt-4 rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
                <Star
                  className={`h-6 w-6 ${n <= rating ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-secondary)]/25"}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            className="mt-3 w-full rounded-lg border border-[var(--color-secondary)]/25 p-3 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="mt-3 flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Submit review
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-neutral-text)]">
          <a href="/login" className="font-semibold text-[var(--color-secondary)] hover:underline">Log in</a> to leave a review.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--color-neutral-text)]">No reviews yet — be the first to share your experience.</p>
        ) : (
          items.map((r) => (
            <div key={r._id} className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4">
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <span className="text-xs text-[var(--color-neutral-text)]">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-primary)]">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
