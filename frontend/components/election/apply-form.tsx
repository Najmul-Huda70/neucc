"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { ImageUploadField } from "@/components/upload/image-upload-field";
import { BATCHES, type Batch } from "@/types";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") ?? "";

  const [position, setPosition] = useState("");
  const [batchYear, setBatchYear] = useState<Batch>("3rd year");
  const [supporterName, setSupporterName] = useState("");
  const [supporterId, setSupporterId] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeId, setRepresentativeId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId) return toast.error("Missing election event — open this page from an Election event.");
    if (position.trim().length < 2) return toast.error("Please enter the position you're running for.");
    if (supporterName.trim().length < 2 || supporterId.trim().length < 2)
      return toast.error("Supporter name and ID are required.");
    if (representativeName.trim().length < 2 || representativeId.trim().length < 2)
      return toast.error("Representative name and ID are required.");
    if (!photoUrl) return toast.error("Please provide a candidate photo.");

    setSubmitting(true);
    try {
      await apiFetch("/api/nominations", {
        method: "POST",
        body: {
          eventId,
          position: position.trim(),
          batchYear,
          supporterName: supporterName.trim(),
          supporterId: supporterId.trim(),
          representativeName: representativeName.trim(),
          representativeId: representativeId.trim(),
          photoUrl,
        },
      });
      toast.success("Nomination submitted for review.");
      router.push("/events");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit nomination.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!eventId && (
        <p className="rounded-lg bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-primary)]">
          Open this form from an Election-category event page so we know which election you&apos;re applying to.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Position</label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. General Secretary"
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Your batch / year</label>
          <select
            value={batchYear}
            onChange={(e) => setBatchYear(e.target.value as Batch)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          >
            {BATCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Supporter name</label>
          <input
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Supporter student ID</label>
          <input
            value={supporterId}
            onChange={(e) => setSupporterId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Representative name</label>
          <input
            value={representativeName}
            onChange={(e) => setRepresentativeName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-primary)]">Representative student ID</label>
          <input
            value={representativeId}
            onChange={(e) => setRepresentativeId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
      </div>

      <ImageUploadField label="Candidate photo" value={photoUrl} onChange={setPhotoUrl} />

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Vote className="h-4 w-4" />}
        Submit nomination
      </button>
    </form>
  );
}

export function ApplyFormWithSuspense() {
  return (
    <Suspense fallback={<div className="skeleton h-96 w-full" />}>
      <ApplyForm />
    </Suspense>
  );
}
