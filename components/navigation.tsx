"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-[5px] bg-foreground text-background font-display text-[0.95rem] leading-none tracking-tight"
      >
        GW
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] tracking-tight text-foreground">
          George Wanyoike
        </span>
        <span className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          Sir G · Nairobi
        </span>
      </span>
    </span>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
    >
      {mounted ? (
        isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

export function Navigation() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Close the sheet on navigation and on Escape; lock scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75"
    >
      <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0 rounded-sm" aria-label="George Wanyoike, home">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 text-[0.9375rem] transition-colors",
                  isActive(link.href)
                    ? "text-foreground after:absolute after:inset-x-3 after:-bottom-[1px] after:h-px after:bg-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/contact"
            className="btn btn-ghost hidden !min-h-9 !py-1.5 text-sm lg:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-border bg-background"
        >
          <ul className="container-page flex flex-col py-6">
            {[...NAV_LINKS, { href: "/resume", label: "Resume" }, { href: "/contact", label: "Contact" }].map(
              (link) => (
                <li key={link.href} className="border-b border-border/70">
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between py-4 font-display text-2xl",
                      isActive(link.href) ? "text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
