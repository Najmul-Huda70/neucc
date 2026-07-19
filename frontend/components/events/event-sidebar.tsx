"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Wallet, Vote, Bell, BellOff, Loader2, Users } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { EventDoc } from "@/types";

export function EventSidebar({
  event,
  initialCount = 0,
}: {
  event: EventDoc;
  initialCount?: number;
}) {
  const { data: session, isPending: sessionPending } = useSession();
  const [interestState, setInterestState] = useState<"unknown" | "yes" | "no">("unknown");
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const interested = interestState === "yes";
  const checkingMine =
    Boolean(session && event.category !== "Election") && interestState === "unknown";

  // Once we know who's logged in, check whether they've already registered
  // interest, so the button renders correctly after a refresh instead of
  // resetting to "Register interest".
  useEffect(() => {
    if (!session || event.category === "Election") return;
    let cancelled = false;
    apiFetch<{ eventIds: string[] }>("/api/attendees/mine")
      .then((data) => {
        if (!cancelled) {
          setInterestState(data.eventIds.includes(event._id) ? "yes" : "no");
        }
      })
      .catch(() => {
        // Non-fatal — button just falls back to "Register interest".
        if (!cancelled) setInterestState("no");
      });
    return () => {
      cancelled = true;
    };
  }, [session, event._id, event.category]);

  function handleInterest() {
    if (!session) {
      toast.error("Please log in first.");
      return;
    }

    startTransition(async () => {
      try {
        if (interested) {
          await apiFetch(`/api/attendees/${event._id}`, { method: "DELETE" });
          setInterestState("no");
          setCount((c) => Math.max(0, c - 1));
          toast.success("You're off the interest list.");
        } else {
          const data = await apiFetch<{ alreadyRegistered?: boolean }>("/api/attendees", {
            method: "POST",
            body: { eventId: event._id },
          });
          setInterestState("yes");
          if (!data?.alreadyRegistered) setCount((c) => c + 1);
          toast.success("You're marked as interested — updates will show closer to the date.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const busy = isPending || checkingMine || sessionPending;

  return (
    <aside className="h-fit rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--color-primary)]">
        <Wallet className="h-5 w-5 text-[var(--color-secondary)]" />
        <span className="text-sm font-medium">Fee</span>
      </div>
      <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">
        {event.fee === "Free" ? "Free" : `৳${event.fee}`}
      </p>

      {event.category === "Election" ? (
        <Link
          href={`/election/apply?event=${event._id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105"
        >
          <Vote className="h-4 w-4" /> Apply for nomination
        </Link>
      ) : (
        <>
          <button
            onClick={handleInterest}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : interested ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            {interested ? "You're on the list" : "Register interest"}
          </button>
          {count > 0 && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--color-neutral-text)]">
              <Users className="h-3.5 w-3.5" /> {count} {count === 1 ? "person" : "people"} interested
            </p>
          )}
        </>
      )}

      <p className="mt-3 text-center text-xs text-[var(--color-neutral-text)]">
        {event.venue}
      </p>
    </aside>
  );
}
