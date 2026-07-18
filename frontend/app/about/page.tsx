import { Target, History, Users2, ShieldCheck } from "lucide-react";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-[var(--color-primary)]">About NEUCC</h1>
      <p className="mt-3 text-[var(--color-neutral-text)]">
        The Netrokona University Computer Club (NEUCC) is the official student organization of
        the Department of Computer Science &amp; Engineering, Netrokona University.
      </p>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl text-[var(--color-primary)]">
          <History className="h-5 w-5 text-[var(--color-secondary)]" /> Our history
        </h2>
        <p className="mt-3 text-[var(--color-neutral-text)]">
          Founded in 2016 by a small group of CSE students, NEUCC began as an informal
          problem-solving circle. It has since grown into the department&apos;s largest student
          body, running programming contests, an annual tech fest, hardware and software
          workshops, and the yearly Executive Committee Election.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl text-[var(--color-primary)]">
          <Target className="h-5 w-5 text-[var(--color-secondary)]" /> Mission
        </h2>
        <p className="mt-3 text-[var(--color-neutral-text)]">
          To give every CSE student, regardless of background, a practical, hands-on path into
          programming, teamwork, and leadership — outside the constraints of the classroom.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl text-[var(--color-primary)]">
          <Users2 className="h-5 w-5 text-[var(--color-secondary)]" /> How the club is run
        </h2>
        <p className="mt-3 text-[var(--color-neutral-text)]">
          NEUCC is entirely student-run. A 19-member Executive Committee — spanning positions
          like President, General Secretary, Programming Secretary, and year-group
          representatives — is elected annually by the general membership.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl text-[var(--color-primary)]">
          <ShieldCheck className="h-5 w-5 text-[var(--color-secondary)]" /> Election eligibility
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--color-neutral-text)]">
          <li>Must be an enrolled B.Sc. CSE student with at least 6 months of club involvement.</li>
          <li>Must have one supporter and one representative, each an existing club member, endorse the application.</li>
          <li>Each candidate may hold only one active nomination per election.</li>
          <li>Applications are reviewed by the Election Commission before appearing on the public candidate list.</li>
        </ul>
      </section>
    </div>
  );
}
