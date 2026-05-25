import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" ? "signup" : "login") as "login" | "signup",
  }),
  head: () => ({ meta: [{ title: "Sign in — Udia" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16 animate-fade-up">
        <h1 className="font-display text-4xl">{mode === "signup" ? "Create your Udia account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "Save your basket and track every order." : "Sign in to see your orders and verifications."}
        </p>
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6">
          {mode === "signup" && (
            <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Field type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" disabled={busy} className="btn-pill mt-2 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>Already have an account? <Link to="/auth" search={{ mode: "login" }} className="underline">Sign in</Link></>
          ) : (
            <>New to Udia? <Link to="/auth" search={{ mode: "signup" }} className="underline">Create an account</Link></>
          )}
        </p>
      </main>
    </div>
  );
}

function Field({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:ring-2" />
    </label>
  );
}
