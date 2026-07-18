import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Farhana Akter",
    role: "Batch 2022, Programming Secretary candidate",
    quote:
      "The Web Development Bootcamp is where I wrote my first line of React. A year later I was TA-ing it.",
  },
  {
    name: "Rakibul Hasan",
    role: "Batch 2021, Regional Contest finalist",
    quote:
      "NEUCC's weekly problem-solving sessions got our team to the regional ICPC round for the first time.",
  },
  {
    name: "Sadia Islam",
    role: "Batch 2023, CSE Fest volunteer",
    quote:
      "Organizing CSE Fest taught me more about project management than any course did.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--color-primary)]/[0.03] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">From our members</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex h-full flex-col rounded-[12px] bg-white p-6 shadow-sm">
              <Quote className="h-6 w-6 text-[var(--color-accent)]" />
              <blockquote className="mt-3 flex-1 text-sm text-[var(--color-neutral-text)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-[var(--color-secondary)]/10 pt-3">
                <p className="card-title text-sm text-[var(--color-primary)]">{t.name}</p>
                <p className="text-xs text-[var(--color-neutral-text)]">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
