"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "All Matches" },
  { href: "/ecuador", label: "Ecuador" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="bg-pitch-grad grid h-8 w-8 shrink-0 place-items-center rounded-xl text-base shadow-lg shadow-pitch/20 sm:h-9 sm:w-9 sm:text-lg">
              ⚽
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="whitespace-nowrap font-display text-base font-bold tracking-wide text-ink sm:text-lg">
                WORLD CUP <span className="text-gradient">26</span>
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted xs:block">
                Match Center
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-2.5 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                    active
                      ? "bg-white text-night shadow"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {link.href === "/ecuador" && (
                    <span className="mr-1" aria-hidden>
                      🇪🇨
                    </span>
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
