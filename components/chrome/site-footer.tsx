import Link from 'next/link';
import { site, navLinks } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line/60 bg-bg-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-sm text-txt">{site.name}</p>
          <p className="mt-1 text-sm text-dim">{site.role} · {site.location}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-dim transition-colors hover:text-txt">
              {link.label}
            </Link>
          ))}
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-dim transition-colors hover:text-txt">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-dim transition-colors hover:text-txt">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="text-dim transition-colors hover:text-txt">
            {site.email}
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-dim/70 sm:px-6">
        Every metric on this site traces to a committed result or is labelled illustrative. Nothing here is invented.
      </div>
    </footer>
  );
}
