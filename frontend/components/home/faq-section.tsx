"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Who can join NEUCC?",
    a: "Any enrolled B.Sc. CSE student at Netrokona University, from 1st year to final year, can register and join.",
  },
  {
    q: "Is there a membership fee?",
    a: "Joining the club itself is free. Individual events (contests, workshops, fests) may have their own fee, shown on each event page.",
  },
  {
    q: "How do I run in the Executive Committee Election?",
    a: "Go to the Election event page and use \"Apply\" — you'll need 6+ months of club involvement and a supporter/representative endorsement. See /about for full eligibility rules.",
  },
  {
    q: "Can I propose an event?",
    a: "Yes — log in and use \"Add event\" from the navbar. An admin will review it before it appears publicly.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--color-primary)]/[0.03] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">FAQ</span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">Frequently asked questions</h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/15 bg-white">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="card-title text-sm text-[var(--color-primary)] sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[var(--color-secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm text-[var(--color-neutral-text)]">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
