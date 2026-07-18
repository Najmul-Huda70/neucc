import { Code2, Users, Trophy } from "lucide-react";

const POINTS = [
  {
    icon: Code2,
    title: "Since 2016",
    body: "Founded by a handful of CSE students, NEUCC now runs year-round programming contests, workshops, and department events.",
  },
  {
    icon: Users,
    title: "500+ members",
    body: "Every CSE student is welcome — from 1st year freshers to final year competitive programmers.",
  },
  {
    icon: Trophy,
    title: "Regional recognition",
    body: "NEUCC teams regularly place in regional ICPC/IUPC rounds and inter-university contests.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            About the club
          </span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">
            A home for every CSE student who loves to build
          </h2>
          <p className="mt-4 text-[var(--color-neutral-text)]">
            The Netrokona University Computer Club is the official student body of the
            Department of CSE — organizing programming contests, tech fests, workshops, and
            the annual Executive Committee Election that puts students in charge of running it.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-[var(--color-secondary)]" />
              <h3 className="card-title mt-3 text-base text-[var(--color-primary)]">{title}</h3>
              <p className="mt-1 text-sm text-[var(--color-neutral-text)]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
