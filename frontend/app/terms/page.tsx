export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-[var(--color-primary)]">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--color-neutral-text)]">Last updated: July 2026</p>

      <div className="mt-8 space-y-8 text-[var(--color-neutral-text)]">
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">1. Eligibility</h2>
          <p className="mt-2">
            Membership is open to any currently enrolled B.Sc. CSE student at Netrokona
            University. Accounts registered with false information may be suspended.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">2. Event submissions</h2>
          <p className="mt-2">
            Events created through this platform are moderated by club administrators and may be
            edited or removed if they violate university policy or club guidelines.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">3. Election conduct</h2>
          <p className="mt-2">
            Candidates and supporters must provide accurate information. The Election Commission
            reserves the right to disqualify any nomination found to violate election rules
            outlined on the About page.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">4. Reviews &amp; conduct</h2>
          <p className="mt-2">
            Reviews and comments must be respectful and relevant. Abusive or defamatory content
            may be removed by administrators.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">5. Changes</h2>
          <p className="mt-2">
            These terms may be updated from time to time; continued use of the platform
            constitutes acceptance of the current version.
          </p>
        </section>
      </div>
    </div>
  );
}
