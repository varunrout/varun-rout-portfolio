import { Reveal } from '@/components/motion/reveal';
import { ProjectCard } from '@/components/project-card';
import { featuredProjects } from '@/content/projects';

export function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Featured work</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">
          Five projects, one habit: benchmark against the incumbent.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
