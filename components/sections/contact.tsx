import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { site } from '@/lib/site';

export function Contact() {
  return (
    <section className="border-t border-line/60 bg-bg-2">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-cyan">Get in touch</p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">
            Open to the next role in applied data science.
          </h2>
          <p className="mt-4 max-w-lg text-dim">
            Based in {site.location}, open to relocation and hybrid or on-site work. The full story, including
            how I moved from energy markets into this portfolio, is on the about page.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<a href={`mailto:${site.email}`} />}>
              Email me
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/about" />}>
              About
            </Button>
            <Button
              size="lg"
              variant="ghost"
              nativeButton={false}
              render={<a href={site.linkedin} target="_blank" rel="noopener noreferrer" />}
            >
              LinkedIn
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
