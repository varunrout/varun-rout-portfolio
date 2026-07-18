'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CommandMenu } from '@/components/chrome/command-menu';
import { navLinks, site } from '@/lib/site';

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight text-txt">
          varun<span className="text-pink">.</span>rout
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-dim transition-colors hover:text-txt"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CommandMenu />
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" />
            }
          >
            <GitFork className="size-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-dim transition-colors hover:bg-panel hover:text-txt"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-dim transition-colors hover:bg-panel hover:text-txt"
                >
                  GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
