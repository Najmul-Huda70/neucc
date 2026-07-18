"use client";

import { useEffect, useState } from "react";
import { UserCircle2, Vote, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { Nomination } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  approved: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  disqualified: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
};

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [nominations, setNominations] = useState<Nomination[] | null>(null);

  useEffect(() => {
    if (!session) return;
    apiFetch<Nomination[]>("/api/nominations/mine")
      .then(setNominations)
      .catch(() => setNominations([]));
  }, [session]);

  if (isPending) {
    return <div className="mx-auto max-w-2xl px-4 py-12"><div className="skeleton h-64 w-full" /></div>;
  }

  const user = session?.user as { name?: string; email?: string; studentId?: string; batch?: string; role?: string } | undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <UserCircle2 className="h-10 w-10 text-[var(--color-secondary)]" />
          <div>
            <h1 className="text-xl text-[var(--color-primary)]">{user?.name ?? "Member"}</h1>
            <p className="text-sm text-[var(--color-neutral-text)]">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-[var(--color-secondary)]/5 p-3">
            <p className="text-xs text-[var(--color-neutral-text)]">Student ID</p>
            <p className="font-medium text-[var(--color-primary)]">{user?.studentId ?? "—"}</p>
          </div>
          <div className="rounded-lg bg-[var(--color-secondary)]/5 p-3">
            <p className="text-xs text-[var(--color-neutral-text)]">Batch</p>
            <p className="font-medium text-[var(--color-primary)]">{user?.batch ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-xl text-[var(--color-primary)]">
          <Vote className="h-5 w-5 text-[var(--color-secondary)]" /> My nominations
        </h2>
        {nominations === null ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-neutral-text)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : nominations.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-neutral-text)]">You haven&apos;t applied for any election yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {nominations.map((n) => (
              <div key={n._id} className="flex items-center justify-between rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4">
                <div>
                  <p className="font-medium text-[var(--color-primary)]">{n.position}</p>
                  <p className="text-xs text-[var(--color-neutral-text)]">
                    Applied {new Date(n.appliedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[n.status]}`}>
                  {n.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
