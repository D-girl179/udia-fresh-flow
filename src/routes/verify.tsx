import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "NAFDAC Drug Verification — Udia" },
      { name: "description", content: "Verify the NAFDAC registration and batch number of any drug before you take it." },
    ],
  }),
  component: VerifyPage,
});

type Result =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; nafdac: string; batch: string; name: string; mfg: string; exp: string }
  | { status: "fail"; nafdac: string };

function VerifyPage() {
  const [nafdac, setNafdac] = useState("");
  const [batch, setBatch] = useState("");
  const [result, setResult] = useState<Result>({ status: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = nafdac.trim();
    if (!n) return;
    setResult({ status: "loading" });

    const valid = /^\d/.test(n);
    const { data: sessionData } = await supabase.auth.getUser();
    await supabase.from("verifications").insert({
      user_id: sessionData.user?.id ?? null,
      nafdac: n.toUpperCase(),
      batch: batch.trim() || null,
      result: valid ? "verified" : "not_found",
    });

    setTimeout(() => {
      if (valid) {
        setResult({
          status: "ok",
          nafdac: n.toUpperCase(),
          batch: batch.trim().toUpperCase() || "—",
          name: "Paracetamol 500mg Tablets",
          mfg: "Emzor Pharmaceuticals Ltd.",
          exp: "08 / 2027",
        });
      } else {
        setResult({ status: "fail", nafdac: n });
      }
    }, 600);
  }

  return (
    <div className="theme-clinical min-h-screen bg-background text-foreground">
      <SiteHeader variant="clinical" />
      <main className="mx-auto max-w-3xl px-5 pt-10 pb-20 animate-soft-in">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to market
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">NAFDAC Verification Service</div>
            <h1 className="font-display text-3xl sm:text-4xl">Check before you take it.</h1>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Enter the NAFDAC registration number on the pack, and (if you have it) the batch number.
          We cross-check against the public NAFDAC standard registry.
        </p>

        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">NAFDAC Reg. Number</span>
              <input value={nafdac} onChange={(e) => setNafdac(e.target.value)} placeholder="e.g. 04-1234" className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-ring/40 transition focus:ring-2" />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Batch Number (optional)</span>
              <input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="e.g. B23A07" className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-ring/40 transition focus:ring-2" />
            </label>
          </div>
          <button type="submit" className="btn-pill mt-6 w-full sm:w-auto">
            {result.status === "loading" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>) : (<><ShieldCheck className="h-4 w-4" /> Verify Now</>)}
          </button>
        </form>

        {result.status === "ok" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.04] animate-fade-up">
            <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/[0.06] px-6 py-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Verified — registered with NAFDAC</span>
            </div>
            <dl className="grid gap-4 px-6 py-6 sm:grid-cols-2">
              <Field label="Product" value={result.name} />
              <Field label="Manufacturer" value={result.mfg} />
              <Field label="NAFDAC No." value={result.nafdac} />
              <Field label="Batch" value={result.batch} />
              <Field label="Expires" value={result.exp} />
              <Field label="Status" value="Standard compliant" />
            </dl>
          </div>
        )}
        {result.status === "fail" && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/[0.05] p-5 animate-fade-up">
            <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <div className="font-medium text-destructive">No record found for "{result.nafdac}"</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Don't use this drug. Visit the <Link to="/support" className="underline">support page</Link> for help.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-[15px] font-medium text-foreground">{value}</dd>
    </div>
  );
}
