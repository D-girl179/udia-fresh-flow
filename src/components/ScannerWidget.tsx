import { useEffect, useState } from "react";
import { CameraOff, ScanLine, X } from "lucide-react";

type Props = {
  onDetect: (code: { nafdac: string; batch?: string }) => void;
};

/**
 * Mock barcode / QR scanner. Renders a viewfinder with corner brackets,
 * a sweeping scan line, and a simulated detection after ~2.4s.
 * No real camera access — this is a faithful UI mock for the MVP.
 */
export function ScannerWidget({ onDetect }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"scanning" | "found">("scanning");

  useEffect(() => {
    if (!open) return;
    setStatus("scanning");
    const t = setTimeout(() => {
      setStatus("found");
      const mock = {
        nafdac: "04-7820",
        batch: "B24K09",
      };
      setTimeout(() => {
        setOpen(false);
        onDetect(mock);
      }, 650);
    }, 2400);
    return () => clearTimeout(t);
  }, [open, onDetect]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/[0.04] p-5 text-left transition hover:border-primary hover:bg-primary/[0.07]"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition group-hover:scale-105">
            <ScanLine className="h-6 w-6" />
          </span>
          <div>
            <div className="font-medium">Scan QR / Barcode</div>
            <div className="text-xs text-muted-foreground">
              Point your camera at the NAFDAC code on the pack — we'll read it instantly.
            </div>
          </div>
        </div>
        <span className="hidden rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground sm:inline-block">
          Open scanner
        </span>
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground animate-soft-in">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-background">
        <div className="flex items-center gap-2 text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary">
            <ScanLine className="h-4 w-4" />
          </span>
          <span className="font-medium">
            {status === "scanning" ? "Scanning…" : "Code detected"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-background transition hover:bg-white/20"
          aria-label="Close scanner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* viewfinder */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-md p-6">
        {/* simulated camera backdrop */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 70% at 50% 30%, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 6px)",
          }}
        />
        <div className="absolute inset-6 grid place-items-center">
          <div className="relative aspect-square w-[70%] rounded-2xl ring-1 ring-white/15 animate-viewfinder">
            {/* corner brackets */}
            <Corner className="left-0 top-0 border-l-2 border-t-2 rounded-tl-2xl" />
            <Corner className="right-0 top-0 border-r-2 border-t-2 rounded-tr-2xl" />
            <Corner className="left-0 bottom-0 border-l-2 border-b-2 rounded-bl-2xl" />
            <Corner className="right-0 bottom-0 border-r-2 border-b-2 rounded-br-2xl" />

            {/* scan line */}
            {status === "scanning" && (
              <div className="absolute inset-x-2 top-0 h-[2px] origin-top animate-scan rounded-full bg-primary shadow-[0_0_20px_4px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]" />
            )}

            {status === "found" && (
              <div className="absolute inset-0 grid place-items-center rounded-2xl bg-primary/15 text-primary">
                <div className="text-center">
                  <div className="font-display text-xl">04-7820</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] opacity-80">
                    NAFDAC code
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-3 px-6 text-center text-[11px] uppercase tracking-[0.2em] text-background/70">
          <CameraOff className="mr-1.5 inline h-3 w-3" /> Camera simulated for preview
        </div>
      </div>
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      className={
        "absolute h-6 w-6 border-primary " + (className ?? "")
      }
    />
  );
}
