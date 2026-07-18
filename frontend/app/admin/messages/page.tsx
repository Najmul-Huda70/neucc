"use client";

import { useState } from "react";
import { Mail, Users } from "lucide-react";
import { ContactMessagesTable } from "@/components/admin/contact-messages-table";
import { NewsletterSubscribersTable } from "@/components/admin/newsletter-subscribers-table";

const TABS = [
  { id: "contact", label: "Contact messages", icon: Mail },
  { id: "newsletter", label: "Newsletter subscribers", icon: Users },
] as const;

export default function AdminMessagesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("contact");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-[var(--color-primary)]">Messages</h1>
      <p className="mt-1 text-[var(--color-neutral-text)]">
        Submissions from the contact form and newsletter signup — visible to admins only.
      </p>

      <div className="mt-6 flex gap-2 border-b border-[var(--color-secondary)]/15">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === id
                ? "border-[var(--color-secondary)] text-[var(--color-secondary)]"
                : "border-transparent text-[var(--color-neutral-text)] hover:text-[var(--color-primary)]"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "contact" ? <ContactMessagesTable /> : <NewsletterSubscribersTable />}
      </div>
    </div>
  );
}
