import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/products";

export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  return (
    <Link
      to="/category/$name"
      params={{ name: category.slug }}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(35,60,40,0.55)]"
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted sm:aspect-[5/6]">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-background">
        {typeof count === "number" && (
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">{count} items</div>
        )}
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl leading-tight sm:text-3xl">{category.name}</div>
            <div className="text-sm opacity-85">{category.tagline}</div>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-foreground transition duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
