import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, MapPin, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Udia — Fresh Nigerian Food & Verified Drugs" },
      {
        name: "description",
        content:
          "The freshest, most affordable indigenous Nigerian food delivered from Calabar — with NAFDAC drug standard verification built in.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5">
        {/* Intro */}
        <section className="pt-10 pb-6 sm:pt-16 animate-fade-up">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Serving Calabar, Cross River
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl">
            Food from the soil it grew in.{" "}
            <span className="italic text-primary">Delivered same day.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Udia is a marketplace for indigenous Nigerian produce — sourced directly
            from farmers we know by name. No middlemen, no inflated markups, no
            wilted leaves. Just the freshest food at the fairest naira price.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /> Harvested within 24h</span>
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Same-day Calabar delivery</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> NAFDAC standard checks</span>
          </div>
        </section>

        {/* Wellness transition */}
        <section className="my-10 rounded-3xl border border-border bg-card p-8 sm:p-12 animate-fade-up">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-secondary-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Wellness
              </div>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
                We care more about your health than just food, let's give you
                NAFDAC drug standard verification.
              </p>
            </div>
            <Link to="/verify" className="btn-pill">
              Verify Your Drugs Here
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="pt-6 pb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">Shop by category</h2>
              <p className="text-sm text-muted-foreground">
                Six curated aisles of indigenous Nigerian goods — tap to explore.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
