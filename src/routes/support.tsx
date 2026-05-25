import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Complaints — Udia" },
      { name: "description", content: "Talk to Udia. Submit a complaint or visit our Calabar headquarters." },
    ],
  }),
  component: SupportPage,
});

const CATEGORIES = [
  "Order / Delivery issue",
  "Drug verification concern",
  "Product quality",
  "Refund request",
  "Other",
];

function SupportPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    category: CATEGORIES[0],
    order_ref: "",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contact || !form.message) {
      setErr("Please fill name, contact and message.");
      return;
    }
    setBusy(true);
    setErr(null);
    const { data: sessionData } = await supabase.auth.getUser();
    const { error } = await supabase.from("support_tickets").insert({
      user_id: sessionData.user?.id ?? null,
      name: form.name,
      contact: form.contact,
      category: form.category,
      order_ref: form.order_ref || null,
      message: form.message,
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

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
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl">Submit a complaint</h2>
            {sent ? (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/[0.05] p-6">
                <div className="font-medium text-primary">Thank you — message received.</div>
                <p className="mt-1 text-sm text-muted-foreground">We'll WhatsApp you back within an hour.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aniefiok Effiong" />
                <Input label="Phone or email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="0801 234 5678" />
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Category</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:ring-2">
                    {CATEGORIES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <Input label="Order ID (optional)" value={form.order_ref} onChange={(e) => setForm({ ...form, order_ref: e.target.value })} placeholder="UDIA-2026-…" className="sm:col-span-2" />
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">What happened?</span>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what went wrong, when, and what you'd like us to do." className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/30 transition focus:ring-2" />
                </label>
                {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
                <button type="submit" disabled={busy} className="btn-pill sm:col-span-2 sm:w-fit disabled:opacity-60">
                  <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send complaint"}
                </button>
              </form>
            )}
          </section>

          <aside className="space-y-4">
            <ContactCard icon={<MapPin className="h-5 w-5" />} title="Udia Headquarters" lines={["24 Mary Slessor Avenue", "Calabar Municipal, Cross River State", "Nigeria"]} />
            <ContactCard icon={<Clock className="h-5 w-5" />} title="Open hours" lines={["Mon – Sat · 9:00 AM – 7:00 PM", "Sunday · Closed"]} />
            <ContactCard icon={<Phone className="h-5 w-5" />} title="Customer care" lines={["+234 802 000 0000", "WhatsApp 24/7"]} />
            <ContactCard icon={<Mail className="h-5 w-5" />} title="Email" lines={["care@udia.ng"]} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">{icon}</div>
        <div className="font-medium">{title}</div>
      </div>
      <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
        {lines.map((l) => <div key={l}>{l}</div>)}
      </div>
    </div>
  );
}

function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={"block " + className}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:ring-2" />
    </label>
  );
}
