/**
 * Global site configuration.
 * This is the ONLY non-MDX file you may ever want to edit —
 * name, links and metadata used across the whole site.
 */
export const site = {
  name: 'Alwin J',
  initials: 'AJ',
  title: 'Alwin J — Engineering Intelligence for Living Systems',
  description:
    'A digital operating system for research, products and ideas at the intersection of AI, biotechnology and engineering.',
  theme: 'Engineering Intelligence for Living Systems',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  email: 'alki2005alak@gmail.com',
  resume: '/resume.pdf',
  keywords: [
    'AI',
    'Biotechnology',
    'Engineering',
    'Scientific Computing',
    'Research',
    'Technology Policy',
    'Open Science',
  ],
  social: {
    github: 'https://github.com/alwinj03',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://x.com/',
    scholar: 'https://scholar.google.com/',
  },
  nav: [
    { label: 'About', href: '/#about' },
    { label: 'Research', href: '/#research' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Papers', href: '/#whitepapers' },
    { label: 'Timeline', href: '/#timeline' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const
