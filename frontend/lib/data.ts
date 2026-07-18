import { apiFetch, buildQuery } from "@/lib/api";
import type { EventDoc, EventFilters, Paginated, Review, StatsSummary } from "@/types";

export async function getEvents(filters: EventFilters = {}): Promise<Paginated<EventDoc>> {
  const qs = buildQuery({
    search: filters.search,
    category: filters.category,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    feeType: filters.feeType,
    sort: filters.sort ?? "date",
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  });

  try {
    return await apiFetch<Paginated<EventDoc>>(`/api/events${qs}`, {
      next: { revalidate: 30 },
    });
  } catch {
    // Backend unreachable / DB empty — surface a clean empty state rather
    // than a hard crash, per the "no fallback data" rule.
    return { items: [], total: 0, page: 1 };
  }
}

export async function getEvent(id: string): Promise<EventDoc | null> {
  try {
    return await apiFetch<EventDoc>(`/api/events/${id}`, { next: { revalidate: 30 } });
  } catch {
    return null;
  }
}

export async function getRelatedEvents(event: EventDoc, limit = 4): Promise<EventDoc[]> {
  const { items } = await getEvents({ category: event.category, limit: limit + 1 });
  return items.filter((e) => e._id !== event._id).slice(0, limit);
}

export async function getReviews(
  eventId: string
): Promise<{ items: Review[]; average: number; count: number }> {
  try {
    return await apiFetch(`/api/reviews/event/${eventId}`, { next: { revalidate: 15 } });
  } catch {
    return { items: [], average: 0, count: 0 };
  }
}

/** Live club stats for the home page. Public GET, cached briefly like the rest of `data.ts`. */
export async function getStats(): Promise<StatsSummary | null> {
  try {
    return await apiFetch<StatsSummary>("/api/stats", { next: { revalidate: 60 } });
  } catch {
    // Backend unreachable — the home page shows an empty/zero state instead of fake numbers.
    return null;
  }
}

/** How many people have registered interest in a (non-Election) event. Public GET. */
export async function getAttendeeCount(eventId: string): Promise<number> {
  try {
    const { count } = await apiFetch<{ count: number }>(
      `/api/attendees/count${buildQuery({ eventId })}`,
      { next: { revalidate: 15 } }
    );
    return count;
  } catch {
    return 0;
  }
}
