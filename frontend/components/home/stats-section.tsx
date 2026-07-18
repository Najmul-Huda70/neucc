"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, CalendarDays, CalendarClock, Vote, BadgeCheck } from "lucide-react";
import type { StatsSummary } from "@/types";

/**
 * We only have current-state data (no multi-year snapshots stored anywhere),
 * so instead of the old fabricated 2021–2025 trend, this renders the two
 * breakdowns `/api/stats` actually gives us: events by category and members
 * by batch, plus a row of live headline numbers.
 */

const SUMMARY_CARDS = (stats: StatsSummary) => [
  { label: "Members", value: stats.totalMembers, icon: Users },
  { label: "Total events", value: stats.totalEvents, icon: CalendarDays },
  { label: "Upcoming events", value: stats.upcomingEvents, icon: CalendarClock },
  { label: "Nominations", value: stats.totalNominations, icon: Vote },
  { label: "Approved candidates", value: stats.approvedNominations, icon: BadgeCheck },
];

export function StatsSection({ stats }: { stats: StatsSummary | null }) {
  const hasData = !!stats && (stats.totalMembers > 0 || stats.totalEvents > 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
          Club statistics
        </span>
        <h2 className="mt-2 text-3xl text-[var(--color-primary)] sm:text-4xl">Where the club stands today</h2>
      </div>

      {!hasData ? (
        <div className="mt-10 flex flex-col items-center rounded-[12px] border border-dashed border-[var(--color-secondary)]/30 p-12 text-center">
          <p className="text-[var(--color-neutral-text)]">
            No club activity has been recorded yet — numbers will appear here as members join and
            events get published.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SUMMARY_CARDS(stats).map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4 text-center shadow-sm"
              >
                <Icon className="mx-auto h-5 w-5 text-[var(--color-secondary)]" />
                <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{value}</p>
                <p className="mt-0.5 text-xs text-[var(--color-neutral-text)]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {stats.eventsByCategory.length > 0 && (
              <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-sm font-semibold text-[var(--color-primary)]">Events by category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.eventsByCategory} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e3db" />
                    <XAxis dataKey="category" stroke="#4C7E78" fontSize={11} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis stroke="#4C7E78" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #14B8A6", fontSize: 13 }}
                      cursor={{ fill: "rgba(20,184,166,0.08)" }}
                    />
                    <Bar dataKey="count" name="Events" fill="#0D3B3B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {stats.membersByBatch.length > 0 && (
              <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-sm font-semibold text-[var(--color-primary)]">Members by batch</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.membersByBatch} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e3db" />
                    <XAxis dataKey="batch" stroke="#4C7E78" fontSize={11} />
                    <YAxis stroke="#4C7E78" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #14B8A6", fontSize: 13 }}
                      cursor={{ fill: "rgba(20,184,166,0.08)" }}
                    />
                    <Bar dataKey="count" name="Members" fill="#F4A340" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
