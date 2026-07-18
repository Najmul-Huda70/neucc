"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-[var(--color-danger)]" aria-hidden />
      <h1 className="mt-4 text-3xl text-[var(--color-primary)]">Something went wrong</h1>
      <p className="mt-3 text-[var(--color-neutral-text)]">
        A 500 error occurred while loading this page. You can try again, or head back home.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]"
      >
        Try again
      </button>
    </div>
  );
}
