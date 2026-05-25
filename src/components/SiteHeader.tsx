import { Link } from "@tanstack/react-router";
import { MapPin, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart";

type Props = { variant?: "default" | "clinical" };

export function SiteHeader({ variant = "default" }: Props) {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const clinical = variant === "clinical";

  return (
    <header
      className={
        "sticky top-0 z-40 border-b backdrop-blur " +
        (clinical
          ? "bg-background/85 border-border"
          : "bg-background/75 border-border")
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={
              "grid h-9 w-9 place-items-center rounded-xl font-display text-lg font-semibold " +
              (clinical
                ? "bg-primary text-primary-foreground"
                : "bg-primary text-primary-foreground")
            }
          >
            U
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Udia</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {clinical ? "Drug Verification" : "Food & Wellness"}
            </div>
          </div>
        </Link>

        {!clinical && (
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            <MapPin className="h-3.5 w-3.5" />
            Calabar, Cross River
            <span className="ml-1 text-foreground">▾</span>
          </button>
        )}

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/verify"
            className={
              "hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition sm:inline-flex " +
              (clinical
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted")
            }
          >
            <ShieldCheck className="h-4 w-4" />
            Verify
          </Link>
          <Link
            to="/support"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-foreground transition hover:bg-muted sm:inline-flex"
          >
            Support
          </Link>
          <Link
            to="/checkout"
            className="relative inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-background px-1.5 text-[11px] font-semibold text-foreground">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
