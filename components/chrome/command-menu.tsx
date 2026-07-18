'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { GitFork, Home, Layers, User, Mail, FolderGit2 } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { site } from '@/lib/site';
import { projects } from '@/content/projects';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-dim transition-colors hover:border-pink/40 hover:text-txt"
        aria-label="Open command menu"
      >
        <span className="hidden sm:inline">Jump to…</span>
        <kbd className="rounded border border-line bg-bg-2 px-1.5 py-0.5 font-mono text-xs text-dim">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Jump to" description="Search pages, projects and repos">
        <Command>
          <CommandInput placeholder="Jump to a page, project or repo…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem onSelect={() => go('/')}>
                <Home />
                Home
              </CommandItem>
              <CommandItem onSelect={() => go('/playground')}>
                <Layers />
                Playground
              </CommandItem>
              <CommandItem onSelect={() => go('/about')}>
                <User />
                About
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem key={p.slug} onSelect={() => go(`/work/${p.slug}`)}>
                  <FolderGit2 />
                  {p.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Elsewhere">
              <CommandItem onSelect={() => go(site.github)}>
                <GitFork />
                GitHub
              </CommandItem>
              <CommandItem onSelect={() => go(`mailto:${site.email}`)}>
                <Mail />
                Email
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
