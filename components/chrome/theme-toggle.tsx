'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

// The attribute on <html> is the single source of truth; components subscribe to it rather than copy it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  // Null on the server, which cannot see the attribute the head script set.
  const theme = React.useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  function toggle() {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    // Swap every colour in one frame instead of letting hover transitions smear the change.
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private windows can refuse storage; the choice then lasts for this page view only.
    }
  }

  const label =
    theme === null ? 'Switch theme' : theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-xs text-graphite transition-colors duration-200 hover:bg-sheet hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quill"
    >
      {/* The icon follows the attribute through CSS, so it is right before hydration too. */}
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
    </button>
  );
}
