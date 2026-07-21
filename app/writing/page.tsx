import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { getAllCaseStudyMeta } from '@/lib/case-studies';
import { getProject } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Long-form case studies on forecasting, causal ML and football analytics. Each one makes an argument, and most of them are about something that did not work.',
  alternates: { canonical: '/writing' },
};

export default async function WritingPage() {
  const posts = await getAllCaseStudyMeta();

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Writing</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          Arguments, not announcements.
        </h1>
        <p className="mt-4 max-w-xl text-dim">
          Each piece takes a position you could disagree with, and reports the result next to the thing it
          had to beat. Several are about work that did not pay off, which is the point.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal>
          <p className="mt-12 rounded-xl border border-line bg-panel p-6 text-sm text-dim">
            No write-ups published yet.
          </p>
        </Reveal>
      ) : (
        <div className="mt-12 space-y-4">
          {posts.map((post, i) => {
            const project = getProject(post.slug);
            return (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/work/${post.slug}`}
                  className="block rounded-xl border border-line bg-panel p-6 transition-colors hover:border-pink/40"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-dim">
                    <time dateTime={post.published}>
                      {new Date(post.published).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                    {project && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="text-cyan">{project.title}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-medium text-txt">{post.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.thesis}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
