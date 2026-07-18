import { NominationsManageTable } from "@/components/election/nominations-manage-table";

export const metadata = { title: "Manage nominations" };

export default function ElectionManagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)]">Manage nominations</h1>
      <p className="mt-1 text-[var(--color-neutral-text)]">
        Review candidate applications for the Executive Committee Election.
      </p>
      <div className="mt-8">
        <NominationsManageTable />
      </div>
    </div>
  );
}
