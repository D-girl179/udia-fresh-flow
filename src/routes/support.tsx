import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Complaints — Udia" },
      { name: "description", content: "Talk to Udia. Submit a complaint, reach customer care, or visit our Calabar headquarters." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pt-8 pb-20 animate-fade-up">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="mt-6 font-display text-4xl sm:text-5xl">We're here, talk to us.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Whether it's a missing tuber, a wrong batch, or a drug you're worried about —
          a real person at Udia will respond within the hour.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl">Submit a complaint</h2>
            {sent ? (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/[0.05] p-6">
                <div className="font-medium text-primary">Thank you — message received.</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll WhatsApp you back within an hour.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                <Input label="Your name" placeholder="Aniefiok Effiong" />
                <Input label="Phone or email" placeholder="0801 234 5678" />
                <Select
                  label="Category"
                  options={[
                    "Order / Delivery issue",
                    "Drug verification concern",
                    "Product quality",
                    "Refund request",
                    "Other",
                  ]}
                  className="sm:col-span-2"
                />
                <Input label="Order ID (optional)" placeholder="UDIA-2026-…" className="sm:col-span-2" />
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    What happened?
                  </span>
                  <textarea
                    rows={5}
                    placeholder="Tell us what went wrong, when, and what you'd like us to do."
                    className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/30 transition focus:ring-2"
                  />
                </label>
                <button type="submit" className="btn-pill sm:col-span-2 sm:w-fit">
                  <Send className="h-4 w-4" /> Send complaint
                </button>
              </form>
            )}
          </section>

          {/* Contact */}
          <aside className="space-y-4">
            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title="Udia Headquarters"
              lines={[
                "24 Mary Slessor Avenue",
                "Calabar Municipal, Cross River State",
                "Nigeria",
              ]}
            />
            <ContactCard
              icon={<Clock className="h-5 w-5" />}
              title="Open hours"
              lines={["Mon – Sat · 9:00 AM – 7:00 PM", "Sunday · Closed"]}
            />
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Customer care"
              lines={["+234 802 000 0000", "WhatsApp 24/7"]}
            />
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              lines={["care@udia.ng"]}
            />
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              For drug-related complaints, you can also visit the HQ directly with the
              product. Our wellness desk handles all NAFDAC escalations in person.
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function Input({
  label,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={"block " + className}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:ring-2"
      />
    </label>
  );
}

function Select({
  label,
  options,
  className = "",
}: {
  label: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={"block " + className}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <select className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:ring-2">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
