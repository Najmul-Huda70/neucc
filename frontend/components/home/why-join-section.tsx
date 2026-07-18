import { Lightbulb, Handshake, Rocket, Vote } from "lucide-react";

const REASONS = [
  { icon: Lightbulb, title: "Learn by doing", body: "Hands-on workshops on web dev, competitive programming, and PC hardware." },
  { icon: Handshake, title: "Real network", body: "Meet seniors, alumni, and industry mentors who actually reply to messages." },
  { icon: Rocket, title: "Launch projects", body: "Showcase your work at CSE Fest and get feedback from faculty and peers." },
  { icon: Vote, title: "Have a say", body: "Vote and run in the annual Executive Committee Election — the club is student-run." },
];

export function WhyJoinSection() {
  return (
    <section className="bg-[var(--color-primary)]/[0.03] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            Why join
          </span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">Four reasons students stay</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[12px] bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-secondary)]/10">
                <Icon className="h-6 w-6 text-[var(--color-secondary)]" />
              </div>
              <h3 className="card-title mt-4 text-base text-[var(--color-primary)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--color-neutral-text)]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
