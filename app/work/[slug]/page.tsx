import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/reveal';
import { ForecastVisualiser } from '@/components/demos/forecast-visualiser';
import { ModelScorecard } from '@/components/demos/model-scorecard';
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
  return {
    title: project.title,
    description: project.summary,
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
    </div>
  );
}
