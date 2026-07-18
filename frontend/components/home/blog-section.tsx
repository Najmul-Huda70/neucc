import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

const POSTS = [
  {
    title: "Executive Committee Election 2026 — nomination window opens 14 July",
    excerpt:
      "19 positions across four year groups are open. Read the eligibility rules before you apply.",
    date: "10 Jul 2026",
    href: "/events" as const,
  },
  {
    title: "Regional Programming Contest 2025 wrap-up",
    excerpt: "Three NEUCC teams placed in the top 15 out of 60+ teams region-wide.",
    date: "18 Oct 2025",
    href: "/events" as const,
  },
  {
    title: "CSE Fest 2025 registration is open",
    excerpt: "Two days of project showcases, contests, and a closing ceremony.",
    date: "1 Oct 2025",
    href: "/events" as const,
  },
];

export function BlogSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            Blog &amp; news
          </span>
          <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">Latest from the club</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <Link
            key={post.title}
            href={post.href}
            className="group flex h-full flex-col rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Newspaper className="h-5 w-5 text-[var(--color-secondary)]" />
            <p className="mt-3 text-xs text-[var(--color-neutral-text)]">{post.date}</p>
            <h3 className="card-title mt-1 text-base text-[var(--color-primary)] line-clamp-2">{post.title}</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--color-neutral-text)] line-clamp-3">{post.excerpt}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--color-secondary)] group-hover:underline">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
