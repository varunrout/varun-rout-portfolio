import type { ComponentPropsWithoutRef } from 'react';

/**
 * Element map for case-study MDX. Server-rendered, no client JS. Styling is explicit rather than a
 * typography plugin so the dark tokens and the house rules (mono for numbers, cyan for benchmarks)
 * stay under our control.
 */
/**
 * Placeholder for sections only the author can write (what surprised me, what I would do next).
 * Deliberately loud: a post carrying one of these must stay `draft: true` and never reach production.
 */
function Todo({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="mt-6 rounded-xl border border-amber/40 bg-amber/5 p-4">
      <p className="font-mono text-xs font-medium text-amber">Awaiting author briefing — do not publish</p>
      <div className="mt-2 text-sm leading-6 text-dim [&_ul]:mt-2 [&_ul]:space-y-1.5">{children}</div>
    </aside>
  );
}

export const mdxComponents = {
  Todo,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-10 scroll-mt-24 text-xl font-medium tracking-[-0.01em] text-txt sm:text-2xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-8 scroll-mt-24 text-base font-medium text-txt sm:text-lg" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="mt-4 text-[15px] leading-7 text-muted-foreground" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="mt-4 space-y-2" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="mt-4 list-decimal space-y-2 pl-5" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-[15px] leading-7 text-muted-foreground" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-medium text-txt" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em className="italic" {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="text-pink underline underline-offset-2 hover:no-underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="mt-6 border-l-2 border-pink/40 pl-4 text-[15px] italic text-dim" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-[13px] text-txt" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-bg-2 p-4 text-[13px]" {...props} />
  ),
  hr: () => <hr className="mt-10 border-line/60" />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="mt-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => <thead className="bg-bg-2" {...props} />,
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="border-b border-line px-4 py-2.5 text-left font-medium text-dim" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-line/60 px-4 py-2.5 align-top text-muted-foreground" {...props} />
  ),
};
