import type { ReactNode } from 'react';

export function DemoFrame({
  title,
  intro,
  provenance,
  children,
}: {
  title: string;
  intro: string;
  provenance: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-panel p-5 sm:p-7">
      <h2 className="text-xl font-medium text-txt">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>
      <div className="mt-6">{children}</div>
      <p className="mt-4 border-t border-line/60 pt-3 text-xs text-dim">
        <span className="text-cyan">Data provenance.</span> {provenance}
      </p>
    </section>
  );
}
