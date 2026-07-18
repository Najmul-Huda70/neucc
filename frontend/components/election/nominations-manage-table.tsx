"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { Nomination, NominationStatus } from "@/types";

const STATUS_STYLES: Record<NominationStatus, string> = {
  pending: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  approved: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  disqualified: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
};

export function NominationsManageTable() {
  const [nominations, setNominations] = useState<Nomination[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Nomination[]>("/api/nominations")
      .then((items) => {
        if (!cancelled) setNominations(items);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Could not load nominations.");
        setNominations([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(id: string, status: Extract<NominationStatus, "approved" | "disqualified">) {
    setUpdatingId(id);
    try {
      await apiFetch(`/api/nominations/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Nomination ${status}.`);
      setNominations((prev) => prev?.map((n) => (n._id === id ? { ...n, status } : n)) ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (nominations === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full" />
        ))}
      </div>
    );
  }

  if (nominations.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-10 text-center text-[var(--color-neutral-text)]">
        No nominations submitted yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[12px] border border-[var(--color-secondary)]/15 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[var(--color-secondary)]/15 bg-[var(--color-primary)]/[0.03] text-[var(--color-primary)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Candidate</th>
            <th className="px-4 py-3 font-semibold">Position</th>
            <th className="px-4 py-3 font-semibold">Batch</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {nominations.map((nom) => (
            <tr key={nom._id} className="border-b border-[var(--color-secondary)]/10 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[var(--color-secondary)]/10">
                    <Image src={nom.photoUrl} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-[var(--color-primary)]">{nom.representativeName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">{nom.position}</td>
              <td className="px-4 py-3 text-[var(--color-neutral-text)]">{nom.batchYear}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[nom.status]}`}>
                  {nom.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => updateStatus(nom._id, "approved")}
                    disabled={updatingId === nom._id || nom.status === "approved"}
                    className="rounded-full p-2 text-[var(--color-success)] hover:bg-green-50 disabled:opacity-40"
                    aria-label="Approve"
                  >
                    {updatingId === nom._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => updateStatus(nom._id, "disqualified")}
                    disabled={updatingId === nom._id || nom.status === "disqualified"}
                    className="rounded-full p-2 text-[var(--color-danger)] hover:bg-red-50 disabled:opacity-40"
                    aria-label="Disqualify"
                  >
                    <X className="h-4 w-4" />
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
