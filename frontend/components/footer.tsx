import Link from "next/link";
import { Mail, MapPin, Phone, CircuitBoard } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-[var(--color-primary)] text-[var(--color-neutral-bg)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="font-logo flex items-center gap-2 text-xl">
            <CircuitBoard className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
            NEUCC
          </Link>
          <p className="mt-3 max-w-xl text-sm text-[var(--color-neutral-bg)]/70">
            Computer Club, Department of CSE, Netrokona University — building programmers,
            one contest at a time.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-[var(--color-secondary)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/>
</svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full bg-white/10 p-2 hover:bg-[var(--color-secondary)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/>
</svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 hover:bg-[var(--color-secondary)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.37 4.25 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
</svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="card-title mb-4 text-sm uppercase tracking-wide text-[var(--color-accent)]">Explore</h4>
          <ul className="space-y-2 text-sm text-[var(--color-neutral-bg)]/80">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="card-title mb-4 text-sm uppercase tracking-wide text-[var(--color-accent)]">Account</h4>
          <ul className="space-y-2 text-sm text-[var(--color-neutral-bg)]/80">
            <li><Link href="/login" className="hover:text-white">Log in</Link></li>
            <li><Link href="/register" className="hover:text-white">Join club</Link></li>
            <li><Link href="/election/apply" className="hover:text-white">Election nomination</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="card-title mb-4 text-sm uppercase tracking-wide text-[var(--color-accent)]">Contact</h4>
          <ul className="space-y-3 text-sm text-[var(--color-neutral-bg)]/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" />
              Dept. of CSE, Netrokona University, Netrokona-2400, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--color-secondary)]" />
              <a href="mailto:cc.cse@neu.ac.bd" className="hover:text-white">cc.cse@neu.ac.bd</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--color-secondary)]" />
              <a href="tel:+8801700000000" className="hover:text-white">+880 1700-000000</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-[var(--color-neutral-bg)]/60">
        © {year} Netrokona University Computer Club. All rights reserved.
      </div>
    </footer>
  );
}
