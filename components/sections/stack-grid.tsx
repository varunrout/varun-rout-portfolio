import { Reveal } from '@/components/motion/reveal';
import { stack } from '@/content/stack';

export function StackGrid() {
  return (
    <section className="border-y border-line/60 bg-bg-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-cyan">Stack</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">
            Only what is imported and executed.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {stack.map((column, i) => (
            <Reveal key={column.title} delay={i * 0.05}>
              <h3 className="font-mono text-sm text-pink">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
