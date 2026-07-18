import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-[12px] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-6 py-12 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl text-[var(--color-primary)] sm:text-3xl">
            Ready to be part of NEUCC?
          </h2>
          <p className="mt-2 text-[var(--color-neutral-text)]">
            Registration takes less than two minutes.
          </p>
        </div>
        <Link
          href="/register"
          className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Join the club <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
