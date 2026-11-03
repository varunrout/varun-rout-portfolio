import type { ReactNode } from 'react';

type FigurePlateProps = {
  number: number;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
};

/* A numbered figure on graph paper, captioned the way a paper captions it. */
export function FigurePlate({ number, caption, children, className = '' }: FigurePlateProps) {
  return (
    <figure className={`bg-grid rounded-xs border border-rule bg-plate px-4 pt-5 pb-4 sm:px-6 ${className}`}>
      {children}
      <figcaption className="mt-3 text-[15px] leading-normal text-graphite">
        <span className="mr-2 font-mono text-xs font-medium tracking-[0.06em] text-ink uppercase">
          Fig. {number}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}
