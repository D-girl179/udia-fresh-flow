import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import {
  getCategory,
  productsByCategory,
  type CategorySlug,
} from "@/lib/products";

export const Route = createFileRoute("/category/$name")({
  loader: ({ params }) => {
    const category = getCategory(params.name);
    if (!category) throw notFound();
    return {
      category,
      items: productsByCategory(category.slug as CategorySlug),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Udia` },
          { name: "description", content: loaderData.category.blurb },
          { property: "og:title", content: `${loaderData.category.name} — Udia` },
          { property: "og:description", content: loaderData.category.blurb },
          { property: "og:image", content: loaderData.category.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-3xl">Category not found</h1>
        <Link to="/" className="btn-pill mt-6">Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="btn-pill mt-6">Back home</Link>
      </div>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pt-8 pb-20 animate-fade-up">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All categories
        </Link>

        <header className="mt-6 grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Category · {items.length} items
            </div>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {category.blurb}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img
              src={category.image}
              alt={category.name}
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </header>

        <section className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p: (typeof items)[number]) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
