import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/reveal';
import { ForecastVisualiser } from '@/components/demos/forecast-visualiser';
import { ModelScorecard } from '@/components/demos/model-scorecard';
import { UpliftExplorer } from '@/components/demos/uplift-explorer';
import { ShotMapExplorer } from '@/components/demos/shot-map-explorer';
import { CxaExplorer } from '@/components/demos/cxa-explorer';
import { getShots } from '@/lib/shots';
import { getCaseStudy } from '@/lib/case-studies';
import { projects, getProject } from '@/content/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `/work/${project.slug}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
    },
  };
}

const stateLabel: Record<string, string> = {
  live: 'Live repo',
  professional: 'Professional',
  'in-development': 'In development',
};

const datasetLabel: Record<string, string> = {
  real: 'Real data',
  synthetic: 'Synthetic data',
  open: 'Open data (StatsBomb)',
  mixed: 'Mixed data',
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const shots = project.demo === 'shotmap' ? await getShots() : [];
  const caseStudy = await getCaseStudy(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <Link href="/#work" className="text-sm text-dim hover:text-txt">
          ← Back to work
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm text-cyan">{project.kicker}</p>
          <Badge variant="outline">{stateLabel[project.state]}</Badge>
          <Badge variant="outline">{datasetLabel[project.dataset]}</Badge>
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] text-txt">{project.title}</h1>
        <p className="mt-2 text-dim">{project.role}</p>

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-pink hover:underline"
          >
            View the repo →
          </a>
        )}
      </Reveal>

      <Reveal delay={0.05}>
        <section className="mt-12 rounded-xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="font-mono text-sm text-cyan">What this is</h2>
          <p className="mt-2 text-muted-foreground">{project.summary}</p>

          <h2 className="mt-8 font-mono text-sm text-cyan">Metrics</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
                <p className="text-xs text-dim">{metric.label}</p>
                <p className="mt-1 font-mono text-sm text-txt">{metric.value}</p>
                {metric.benchmark && <p className="mt-0.5 text-xs text-cyan">{metric.benchmark}</p>}
                {!metric.measured && <p className="mt-0.5 text-xs text-amber">Illustrative, not a headline result</p>}
              </div>
            ))}
          </div>

          <h2 className="mt-8 font-mono text-sm text-cyan">Stack</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span key={tech} className="rounded-full border border-line px-2.5 py-1 text-xs text-dim">
                {tech}
              </span>
            ))}
          </div>

          {project.provenanceNote && (
            <>
              <h2 className="mt-8 font-mono text-sm text-cyan">Provenance</h2>
              <p className="mt-2 text-sm text-muted-foreground">{project.provenanceNote}</p>
            </>
          )}

          <h2 className="mt-8 font-mono text-sm text-cyan">What I would not claim</h2>
          {project.neverClaim && project.neverClaim.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {project.neverClaim.map((claim) => (
                <li key={claim} className="text-sm text-dim before:mr-2 before:content-['—']">
                  {claim}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-dim">Nothing beyond what is listed above.</p>
          )}
        </section>
      </Reveal>

      {project.demo === 'forecast' && (
        <Reveal delay={0.05}>
          <section className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-mono text-sm text-cyan">Explore the deltas</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The same before/after figures, interactive. Toggle between the three roles.
            </p>
            <div className="mt-6">
              <ForecastVisualiser />
            </div>
          </section>
        </Reveal>
      )}

      {project.demo === 'uplift' && (
        <Reveal delay={0.05}>
          <section className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-mono text-sm text-cyan">Explore the uplift</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Observed uplift per predicted decile and the Qini curve from the X-learner. Slide to target the
              top K% of customers and see the captured incremental response recompute.
            </p>
            <div className="mt-6">
              <UpliftExplorer />
            </div>
            <p className="mt-4 border-t border-line/60 pt-3 text-xs text-dim">
              <span className="text-cyan">Data provenance.</span> Synthetic retail data; demonstrates method,
              not a measured commercial outcome. Per-decile rows and headline figures come from committed
              retail-intelligence outputs (data/uplift-deciles.json).
            </p>
          </section>
        </Reveal>
      )}

      {project.demo === 'scorecard' && (
        <Reveal delay={0.05}>
          <section className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-mono text-sm text-cyan">Model scorecard</h2>
            <div className="mt-6">
              <ModelScorecard />
            </div>
          </section>
        </Reveal>
      )}

      {project.demo === 'shotmap' && (
        <Reveal delay={0.05}>
          <section className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-mono text-sm text-cyan">Explore the shots</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A sample of real shots, my CxG beside StatsBomb&apos;s own xG on the same shots. Toggle the metric
              or the diff, filter by team, match or pressure, and watch the calibration recompute.
            </p>
            <div className="mt-6">
              <ShotMapExplorer shots={shots} />
            </div>
            <p className="mt-4 border-t border-line/60 pt-3 text-xs text-dim">
              <span className="text-cyan">Data provenance.</span> 440-shot sample from the CxG diagnostic model,
              benchmarked against StatsBomb xG. Open StatsBomb data, served from Supabase; full set in the repo.
            </p>
          </section>
        </Reveal>
      )}
      {project.slug === 'opponent-adjusted-metrics' && (
        <Reveal delay={0.05}>
          <section className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-mono text-sm text-cyan">Explore contextual expected assists</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The CxA diagnostic model against its own baseline over 1,091,388 action rows. Precision among the
              model&apos;s most confident actions is the headline; the leaderboard shows volume against efficiency.
            </p>
            <div className="mt-6">
              <CxaExplorer />
            </div>
            <p className="mt-4 border-t border-line/60 pt-3 text-xs text-dim">
              <span className="text-cyan">Data provenance.</span> Generated into data/cxa.json from the committed CxA
              portfolio export (headline metrics, top players and teams, feature drivers). Open StatsBomb data. The
              comparison is against this project&apos;s own baseline, not an industry expected-assists incumbent, and
              the model is provisionally promoted.
            </p>
          </section>
        </Reveal>
      )}
      {caseStudy && (
        <Reveal delay={0.05}>
          <article className="mt-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
            <p className="font-mono text-sm text-cyan">The write-up</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-txt sm:text-3xl">
              {caseStudy.meta.title}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-dim">{caseStudy.meta.thesis}</p>
            <p className="mt-3 font-mono text-xs text-dim">
              <time dateTime={caseStudy.meta.published}>
                {new Date(caseStudy.meta.published).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              {' · '}
              {caseStudy.meta.readingMinutes} min read
            </p>
            <div className="mt-6 border-t border-line/60 pt-2">{caseStudy.content}</div>
          </article>
        </Reveal>
      )}
    </div>
  );
}
