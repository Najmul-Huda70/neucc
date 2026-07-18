export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-[var(--color-primary)]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--color-neutral-text)]">Last updated: July 2026</p>

      <div className="mt-8 space-y-8 text-[var(--color-neutral-text)]">
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">1. Information we collect</h2>
          <p className="mt-2">
            When you register, we collect your name, student ID, batch/year, and email address.
            When you apply for an election nomination, we additionally collect a supporter and
            representative&apos;s name and student ID, plus a candidate photo you upload.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">2. How we use it</h2>
          <p className="mt-2">
            This information is used solely to operate club membership, event participation, and
            the annual Executive Committee Election. We do not sell or share your data with
            third parties for marketing purposes.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">3. Photo uploads</h2>
          <p className="mt-2">
            Event and candidate photos are hosted via a third-party image host (ImgBB). Uploaded
            images may be publicly accessible via their URL.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">4. Data retention</h2>
          <p className="mt-2">
            Account and nomination data is retained for as long as your account is active, or as
            required for election record-keeping.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-[var(--color-primary)]">5. Contact</h2>
          <p className="mt-2">
            For questions about this policy, email{" "}
            <a href="mailto:cc.cse@neu.ac.bd" className="font-semibold text-[var(--color-secondary)] hover:underline">
              cc.cse@neu.ac.bd
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
