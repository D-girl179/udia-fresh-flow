import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, Minus, Plus, Trash2, Truck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cart, useCart } from "@/lib/cart";
import { formatNaira, getProduct } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Cart & Checkout — Udia" },
      { name: "description", content: "Review your basket, choose delivery or HQ pick-up, and pay in naira." },
    ],
  }),
  component: CheckoutPage,
});

type Fulfillment = "delivery" | "pickup";

function CheckoutPage() {
  const items = useCart();
  const [method, setMethod] = useState<Fulfillment>("delivery");
  const [placed, setPlaced] = useState(false);

  const rows = useMemo(
    () =>
      items
        .map((i) => {
          const p = getProduct(i.id);
          return p ? { ...i, product: p } : null;
        })
        .filter(Boolean) as { id: string; qty: number; product: ReturnType<typeof getProduct> & {} }[],
    [items],
  );

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const deliveryFee = method === "delivery" && subtotal > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  if (placed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-24 text-center animate-fade-up">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
            ✓
          </div>
          <h1 className="mt-6 font-display text-4xl">Order placed.</h1>
          <p className="mt-3 text-muted-foreground">
            You'll receive a WhatsApp confirmation in a few minutes.{" "}
            {method === "pickup" ? "See you at the HQ." : "Our rider is on the way."}
          </p>
          <Link to="/" className="btn-pill mt-8">Back to market</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 pt-8 pb-20 animate-fade-up">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <h1 className="mt-6 font-display text-4xl sm:text-5xl">Your basket</h1>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Your basket is empty.</p>
            <Link to="/" className="btn-pill mt-6">Browse the market</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Items + Fulfillment */}
            <div className="space-y-8">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {rows.map((r, idx) => (
                  <div
                    key={r.id}
                    className={
                      "flex items-center gap-4 p-4 " +
                      (idx < rows.length - 1 ? "border-b border-border" : "")
                    }
                  >
                    <img
                      src={r.product.image}
                      alt={r.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{r.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatNaira(r.product.price)} / {r.product.unit}
                      </div>
                      <div className="mt-2 inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => cart.setQty(r.id, r.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{r.qty}</span>
                        <button
                          onClick={() => cart.setQty(r.id, r.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatNaira(r.product.price * r.qty)}
                      </div>
                      <button
                        onClick={() => cart.remove(r.id)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fulfillment toggle */}
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Fulfillment
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <FulfillmentOption
                    active={method === "delivery"}
                    onClick={() => setMethod("delivery")}
                    icon={<Truck className="h-5 w-5" />}
                    title="Home Delivery"
                    desc="Same-day in Calabar. ₦1,500 flat."
                  />
                  <FulfillmentOption
                    active={method === "pickup"}
                    onClick={() => setMethod("pickup")}
                    icon={<MapPin className="h-5 w-5" />}
                    title="HQ Pick-Up"
                    desc="Free. Pick up at Udia HQ."
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                  {method === "delivery" ? (
                    <form className="grid gap-4 sm:grid-cols-2">
                      <Input label="Full name" placeholder="Aniefiok Effiong" />
                      <Input label="Phone" placeholder="0801 234 5678" />
                      <Input label="Street address" placeholder="14 Marian Road" className="sm:col-span-2" />
                      <Input label="Area" placeholder="Calabar Municipal" />
                      <Input label="Landmark (optional)" placeholder="Near Watt Market" />
                    </form>
                  ) : (
                    <div>
                      <div className="text-sm font-medium">Udia Headquarters</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        24 Mary Slessor Avenue, Calabar Municipal, Cross River State.
                        <br />
                        Open Monday–Saturday, 9:00 AM — 7:00 PM.
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Bring your order ID. You can also pick up drugs or handle physical complaints here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Subtotal" value={formatNaira(subtotal)} />
                <Row
                  label={method === "delivery" ? "Delivery (Calabar)" : "Pick-up"}
                  value={deliveryFee ? formatNaira(deliveryFee) : "Free"}
                />
                <div className="my-3 h-px bg-border" />
                <Row label="Total" value={formatNaira(total)} bold />
              </dl>
              <button
                onClick={() => {
                  cart.clear();
                  setPlaced(true);
                }}
                className="btn-pill mt-6 w-full"
              >
                Pay {formatNaira(total)}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Mock payment · Paystack, Flutterwave & transfer supported at launch.
              </p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FulfillmentOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition " +
        (active
          ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
          : "border-border bg-card hover:border-foreground/30")
      }
    >
      <div
        className={
          "grid h-10 w-10 place-items-center rounded-xl " +
          (active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")
        }
      >
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={bold ? "text-base font-semibold" : "font-medium"}>{value}</dd>
    </div>
  );
}
