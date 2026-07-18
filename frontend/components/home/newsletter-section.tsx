"use client";

import { useActionState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { subscribeNewsletter, type NewsletterState } from "@/lib/action";

const initialState: NewsletterState = { status: "idle", message: "" };

export function NewsletterSection() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[12px] bg-[var(--color-primary)] px-6 py-12 text-center text-white sm:px-12">
        <Mail className="mx-auto h-8 w-8 text-[var(--color-accent)]" />
        <h2 className="mt-3 text-2xl sm:text-3xl">Never miss an event</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/75">
          Subscribe for contest dates, workshop announcements, and election updates.
        </p>

        <form action={formAction} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row justify-center">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="you@student.neu.ac.bd"
            className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[var(--color-secondary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105 disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Subscribe
          </button>
        </form>

        {state.status !== "idle" && (
          <p className={`mt-3 text-sm ${state.status === "success" ? "text-[var(--color-secondary)]" : "text-red-300"}`}>
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
}
