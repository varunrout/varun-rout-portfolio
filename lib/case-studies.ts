import 'server-only';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { projects } from '@/content/projects';

/**
 * Long-form case studies. One .mdx per project, slug matching a projects.ts slug so the two can never
 * drift: a mismatch throws during the static build rather than shipping an orphaned page.
 *
 * The card is reference, the post is an argument. See PLAN_project-writeups.md section 2.
 */
export type CaseStudyMeta = {
  slug: string; // must match a projects.ts slug
  title: string; // the argument, not the project name
  thesis: string; // one sentence, rendered as the standfirst
  published: string; // ISO date
  updated?: string;
  readingMinutes: number;
  tier: 'full' | 'short';
  /** Drafts render in dev but are hidden in production, so a half-written post can never ship. */
  draft?: boolean;
};

/** Drafts are visible locally so they can be reviewed, and withheld from the live site. */
function isVisible(meta: CaseStudyMeta): boolean {
  return !meta.draft || process.env.NODE_ENV !== 'production';
}

const DIR = resolve(process.cwd(), 'content/case-studies');
const PROJECT_SLUGS = new Set(projects.map((p) => p.slug));

function fail(msg: string): never {
  // Thrown at build time so a bad case study fails the build instead of shipping broken.
  throw new Error(`[case-studies] ${msg}`);
}

export function getCaseStudySlugs(): string[] {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/** Parses and validates frontmatter. Uses the same parser next-mdx-remote uses at render time. */
async function readMeta(slug: string): Promise<{ meta: CaseStudyMeta; source: string }> {
  const path = join(DIR, `${slug}.mdx`);
  if (!existsSync(path)) fail(`no .mdx found for slug "${slug}" at ${path}`);
  const source = readFileSync(path, 'utf8');

  const { compileMDX } = await import('next-mdx-remote/rsc');
  const { frontmatter } = await compileMDX<Partial<CaseStudyMeta>>({
    source,
    options: { parseFrontmatter: true },
  });

  const required: (keyof CaseStudyMeta)[] = ['title', 'thesis', 'published', 'readingMinutes', 'tier'];
  for (const key of required) {
    if (frontmatter[key] === undefined || frontmatter[key] === '') {
      fail(`"${key}" missing from frontmatter in ${slug}.mdx`);
    }
  }
  if (!PROJECT_SLUGS.has(slug)) {
    fail(
      `case study "${slug}.mdx" has no matching project in content/projects.ts. ` +
        `Known slugs: [${[...PROJECT_SLUGS].join(', ')}]. Rename the file or add the project.`,
    );
  }
  if (Number.isNaN(Date.parse(String(frontmatter.published)))) {
    fail(`"published" in ${slug}.mdx is not a parseable ISO date (got "${frontmatter.published}")`);
  }

  return {
    source,
    meta: {
      slug,
      title: String(frontmatter.title),
      thesis: String(frontmatter.thesis),
      published: String(frontmatter.published),
      updated: frontmatter.updated ? String(frontmatter.updated) : undefined,
      readingMinutes: Number(frontmatter.readingMinutes),
      tier: frontmatter.tier === 'short' ? 'short' : 'full',
      draft: Boolean(frontmatter.draft),
    },
  };
}

/** Every case study's metadata, newest first. Used by /writing. */
export async function getAllCaseStudyMeta(): Promise<CaseStudyMeta[]> {
  const metas = await Promise.all(getCaseStudySlugs().map(async (s) => (await readMeta(s)).meta));
  return metas.filter(isVisible).sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
}

/** Metadata only, for a single slug. Returns null when a project simply has no write-up. */
export async function getCaseStudyMeta(slug: string): Promise<CaseStudyMeta | null> {
  if (!getCaseStudySlugs().includes(slug)) return null;
  return (await readMeta(slug)).meta;
}

export function hasCaseStudy(slug: string): boolean {
  return getCaseStudySlugs().includes(slug);
}

/** The rendered post plus its metadata. Returns null when the project has no write-up. */
export async function getCaseStudy(
  slug: string,
): Promise<{ meta: CaseStudyMeta; content: React.ReactElement } | null> {
  if (!getCaseStudySlugs().includes(slug)) return null;
  const { source, meta } = await readMeta(slug);
  if (!isVisible(meta)) return null;

  const { compileMDX } = await import('next-mdx-remote/rsc');
  const { mdxComponents } = await import('@/components/mdx-components');
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  });

  return { meta, content };
}
