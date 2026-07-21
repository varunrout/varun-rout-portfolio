export const site = {
  // Canonical origin. Every canonical, OG URL, OG image, sitemap entry and robots
  // reference derives from this. Change it here only if the primary domain changes.
  url: 'https://varunrout.com',
  name: 'Varun Rout',
  role: 'Applied data science',
  location: 'Birmingham, UK',
  email: 'varun_rout@outlook.com',
  github: 'https://github.com/varunrout',
  linkedin: 'https://www.linkedin.com/in/varunrout',
} as const;

export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Playground', href: '/playground' },
  { label: 'About', href: '/about' },
] as const;
