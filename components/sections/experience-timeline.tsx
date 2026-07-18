import { Reveal } from '@/components/motion/reveal';
import { experience, education } from '@/content/experience';

export function ExperienceTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Experience</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">Where the numbers come from.</h2>
      </Reveal>

      <div className="mt-10 space-y-6 border-l border-line pl-6 sm:pl-8">
        {experience.map((entry, i) => (
          <Reveal key={`${entry.role}-${entry.org}`} delay={Math.min(i * 0.04, 0.2)}>
            <div className="relative">
              <span
                className={`absolute -left-[calc(1.5rem+5px)] top-1.5 size-2.5 rounded-full sm:-left-[calc(2rem+5px)] ${
                  entry.current ? 'bg-pink' : 'bg-line'
                }`}
                aria-hidden
              />
              <p className="font-mono text-xs text-dim">
                {entry.start} – {entry.end}
              </p>
              <h3 className="mt-1 text-lg font-medium text-txt">
                {entry.role} <span className="text-dim">· {entry.org}</span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
              <ul className="mt-2 space-y-1">
                {entry.highlights.map((h) => (
                  <li key={h} className="text-sm text-dim before:mr-2 before:content-['—']">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 border-l border-line pl-6 sm:pl-8">
          <h3 className="font-mono text-sm text-dim">Education</h3>
          <div className="mt-3 space-y-2">
            {education.map((entry) => (
              <p key={entry.qualification} className="text-sm text-muted-foreground">
                <span className="text-txt">{entry.qualification}</span>, {entry.institution} ({entry.start}–{entry.end})
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
