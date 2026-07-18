import Link from "next/link";
import { CircuitBoard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <CircuitBoard className="h-12 w-12 text-[var(--color-secondary)]" aria-hidden />
      <h1 className="mt-4 text-4xl text-[var(--color-primary)]">404 — Page not found</h1>
      <p className="mt-3 text-[var(--color-neutral-text)]">
        The page you&apos;re looking for doesn&apos;t exist, or has moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]">
          Back to home
        </Link>
        <Link href="/events" className="rounded-full border border-[var(--color-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--color-secondary)]">
          Browse events
        </Link>
      </div>
    </div>
  );
}
