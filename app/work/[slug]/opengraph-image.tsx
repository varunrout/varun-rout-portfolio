import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE } from '@/lib/og-card';
import { projects, getProject } from '@/content/projects';

export const alt = 'Project — Varun Rout';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(
      (
        <OgCard kicker="Varun Rout" title="Project not found" />
      ),
      { ...size },
    );
  }

  // Prefer a measured metric that carries a benchmark, so the card shows the bar-pair motif.
  const measured = project.metrics.filter((m) => m.measured);
  const withBench = measured.find((m) => m.benchmark);
  const chosen = withBench ?? measured[0];

  return new ImageResponse(
    (
      <OgCard
        kicker={project.kicker}
        title={project.title}
        metricLabel={chosen?.label}
        mineText={chosen?.value}
        benchText={chosen?.benchmark}
      />
    ),
    { ...size },
  );
}
