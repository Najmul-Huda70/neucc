"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/lib/action";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-primary)]">Name</label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-primary)]">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-primary)]">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-4 py-2.5 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      {state.status !== "idle" && (
        <p className={`text-sm ${state.status === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  );
}
