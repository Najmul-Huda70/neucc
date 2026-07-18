import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(searchParams: URLSearchParams, page: number): Route {
  const params = new URLSearchParams(searchParams);
  params.set("page", String(page));
  return `/events?${params.toString()}` as Route;
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Link
        href={buildHref(searchParams, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`rounded-full border border-[var(--color-secondary)]/25 p-2 ${
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-[var(--color-secondary)]/10"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-sm text-[var(--color-neutral-text)]">…</span>}
          <Link
            href={buildHref(searchParams, p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
              p === page
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-secondary)]/25 text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/10"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`rounded-full border border-[var(--color-secondary)]/25 p-2 ${
          page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-[var(--color-secondary)]/10"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
