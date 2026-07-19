"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { EventDoc } from "@/types";

export function Hero({ events }: { events: EventDoc[] }) {
  const [index, setIndex] = useState(0);
  const hasEvents = events.length > 0;

  const next = useCallback(() => setIndex((i) => (i + 1) % Math.max(events.length, 1)), [events.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + Math.max(events.length, 1)) % Math.max(events.length, 1)),
    [events.length]
  );

  useEffect(() => {
    if (!hasEvents) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [hasEvents, next]);

  const current = hasEvents ? events[index % events.length] : undefined;

  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[var(--color-primary)] text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(20,184,166,0.6) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-logo inline-block rounded-full bg-white/10 px-4 py-1 text-sm text-[var(--color-accent)]">
            Dept. of CSE, Netrokona University
          </span>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Code. Compete. Build the club that builds you.
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            NEUCC runs contests, workshops, and the annual Executive Committee Election —
            all in one place for every CSE student at Netrokona University.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105"
            >
              Join the club <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Explore events
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          {hasEvents && current ? (
            <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-white/5 backdrop-blur">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current._id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative h-56 w-full">
                    <Image src={current.imageUrl} alt={current.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority loading="eager" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]">
                      Upcoming — {current.category}
                    </p>
                    <h3 className="card-title mt-1 text-lg">{current.title}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {new Date(current.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {current.venue}
                    </p>
                    <Link
                      href={`/events/${current._id}`}
                      className="mt-4 inline-block text-sm font-semibold text-[var(--color-secondary)] hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {events.length > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
                  <button onClick={prev} aria-label="Previous event" className="rounded-full p-1.5 hover:bg-white/10">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {events.map((e, i) => (
                      <button
                        key={e._id}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 w-4 rounded-full transition ${
                          i === index % events.length ? "bg-[var(--color-accent)]" : "bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                  <button onClick={next} aria-label="Next event" className="rounded-full p-1.5 hover:bg-white/10">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[12px] border border-dashed border-white/25 bg-white/5 p-8 text-center">
              <p className="text-white/80">No upcoming events yet — check back soon.</p>
              <Link href="/events" className="mt-3 inline-block text-sm font-semibold text-[var(--color-secondary)] hover:underline">
                Browse all events →
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
