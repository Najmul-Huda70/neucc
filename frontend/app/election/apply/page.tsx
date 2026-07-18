import { ApplyFormWithSuspense } from "@/components/election/apply-form";

export const metadata = { title: "Apply for nomination" };

export default function ElectionApplyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)]">Executive Committee nomination</h1>
      <p className="mt-2 text-[var(--color-neutral-text)]">
        Your application will be reviewed by the Election Commission before it&apos;s approved.
      </p>
      <div className="mt-8">
        <ApplyFormWithSuspense />
      </div>
    </div>
  );
}
