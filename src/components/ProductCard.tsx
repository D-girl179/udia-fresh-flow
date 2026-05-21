import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { categoryName, formatNaira } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(35,60,40,0.45)]"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {categoryName(product.category)}
          </div>
          <div className="mt-1 truncate font-display text-lg font-medium">
            {product.name}
          </div>
          <div className="text-xs text-muted-foreground">per {product.unit}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-semibold text-foreground">
            {formatNaira(product.price)}
          </div>
        </div>
      </div>
    </Link>
  );
}
