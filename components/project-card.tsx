import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/content/projects';

const stateLabel: Record<Project['state'], string> = {
  live: 'Live repo',
  professional: 'Professional',
  'in-development': 'In development',
};

const stateClass: Record<Project['state'], string> = {
  live: 'border-cyan/30 text-cyan',
  professional: 'border-line text-muted-foreground',
  'in-development': 'border-amber/30 text-amber',
};

export function ProjectCard({ project }: { project: Project }) {
  const headline = project.metrics[0];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-pink/40"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wide text-cyan">{project.kicker}</p>
        <Badge variant="outline" className={stateClass[project.state]}>
          {stateLabel[project.state]}
        </Badge>
      </div>

      <h3 className="mt-3 text-xl font-medium text-txt">{project.title}</h3>
      <p className="mt-1 text-sm text-dim">{project.role}</p>
      <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>

      {headline && (
        <div className="mt-4 rounded-lg border border-line/60 bg-bg-2 px-3 py-2">
          <p className="font-mono text-sm text-pink">{headline.value}</p>
          {headline.benchmark && <p className="text-xs text-dim">{headline.benchmark}</p>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-full border border-line px-2 py-0.5 text-xs text-dim">
            {tech}
          </span>
        ))}
      </div>

      <span className="mt-auto pt-4 text-sm text-dim transition-colors group-hover:text-pink">
        Read the write-up →
      </span>
    </Link>
  );
}
