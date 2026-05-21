import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-xl font-semibold">Udia</div>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Fresh, indigenous Nigerian food and NAFDAC-verified drugs — built in Calabar,
            served everywhere.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/verify" className="hover:text-foreground">Verify</Link>
          <Link to="/checkout" className="hover:text-foreground">Cart</Link>
          <Link to="/support" className="hover:text-foreground">Support</Link>
        </nav>
      </div>
    </footer>
  );
}
