"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, CircuitBoard } from "lucide-react";
import { useSession, clearFrontendSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const role = (session?.user as { role?: string } | undefined)?.role ?? "user";
  const isAdmin = role === "admin";

  async function handleLogout() {
    await clearFrontendSession();
    toast.success("Logged out.");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-secondary)]/15 bg-[var(--color-neutral-bg)]/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-logo text-xl text-[var(--color-primary)] sm:text-2xl">
          <span className="flex items-center gap-2">
            <CircuitBoard className="h-6 w-6 text-[var(--color-secondary)]" aria-hidden />
            NEUCC
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-secondary)] ${
                pathname === link.href ? "text-[var(--color-secondary)]" : "text-[var(--color-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/events/add" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]">
              Add event
            </Link>
          )}
          {isAdmin && (
            <Link href="/events/manage" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]">
              Manage events
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin/messages" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]">
              Messages
            </Link>
          )}
          {session && (
            <Link href="/profile" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]">
              Profile
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 skeleton" />
          ) : session ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-neutral-bg)]"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[var(--color-secondary)] px-4 py-2 text-sm font-medium text-[var(--color-secondary)] transition hover:bg-[var(--color-secondary)] hover:text-[var(--color-neutral-bg)]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105"
              >
                Join club
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-secondary)]/15 bg-[var(--color-neutral-bg)] px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {PUBLIC_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary)]">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/events/add" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary)]">
                Add event
              </Link>
            )}
            {isAdmin && (
              <Link href="/events/manage" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary)]">
                Manage events
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin/messages" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary)]">
                Messages
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary)]">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-[var(--color-danger)]">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-secondary)]">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-semibold text-[var(--color-accent)]">
                  Join club
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
