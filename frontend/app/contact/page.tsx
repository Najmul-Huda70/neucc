import { ContactForm } from "@/components/contact/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-[var(--color-primary)]">Contact us</h1>
      <p className="mt-3 max-w-xl text-[var(--color-neutral-text)]">
        Questions about membership, events, or the election? Send us a message or reach out directly.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-5">
            <h2 className="card-title text-base text-[var(--color-primary)]">Direct contact</h2>
            <ul className="mt-3 space-y-3 text-sm text-[var(--color-neutral-text)]">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--color-secondary)]" />
                <a href="mailto:cc.cse@neu.ac.bd" className="hover:text-[var(--color-primary)]">cc.cse@neu.ac.bd</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--color-secondary)]" />
                <a href="tel:+8801700000000" className="hover:text-[var(--color-primary)]">+880 1700-000000</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" />
                Dept. of CSE, Netrokona University, Netrokona-2400, Bangladesh
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/15">
            <iframe
              title="Netrokona University map"
              src="https://www.google.com/maps?q=Netrokona+University&output=embed"
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
