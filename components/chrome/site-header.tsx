'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/chrome/theme-toggle';
import { navLinks, site } from '@/lib/site';

// "Work" points at the home anchor but owns every /work page; the rest own their own path.
function isActive(href: string, pathname: string) {
  const path = href.startsWith('/#') ? '/work' : href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-[-0.01em] text-ink">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b py-1 font-mono text-[13px] transition-colors duration-200 ${
                  active ? 'border-ink text-ink' : 'border-transparent text-graphite hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-transparent py-1 font-mono text-[13px] text-graphite transition-colors duration-200 hover:text-ink"
          >
            GitHub ↗
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-10 items-center justify-center rounded-xs text-graphite transition-colors duration-200 hover:bg-sheet hover:text-ink md:hidden"
                >
                  <Menu className="size-4" aria-hidden />
                </button>
              }
            />
            <SheetContent side="right" className="bg-paper">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl font-semibold">{site.name}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main" className="flex flex-col px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href, pathname) ? 'page' : undefined}
                    className="border-b border-rule py-4 font-serif text-2xl text-ink aria-[current=page]:text-quill"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="py-4 font-mono text-sm text-graphite"
                >
                  GitHub ↗
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
