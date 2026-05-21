import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { formatNaira, getProduct, getSimilar } from "@/lib/products";
import { cart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product, similar: getSimilar(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Udia` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Udia` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/" className="btn-pill mt-6">Back to market</Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, similar } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    cart.add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pt-8 animate-fade-up">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to market
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {categoryName(product.category)} · {product.origin}
            </div>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{formatNaira(product.price)}</span>
              <span className="text-sm text-muted-foreground">per {product.unit}</span>
            </div>
            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-muted"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-muted"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-pill flex-1 sm:flex-none">
                <ShoppingBag className="h-4 w-4" />
                {added ? "Added!" : `Add to Cart · ${formatNaira(product.price * qty)}`}
              </button>
            </div>

            <Link to="/checkout" className="mt-3 text-sm text-muted-foreground underline-offset-4 hover:underline">
              Go to checkout →
            </Link>
          </div>
        </div>

        <section className="mt-20 pb-16">
          <h2 className="font-display text-2xl sm:text-3xl">Similar harvests</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {similar.map((p: typeof product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
