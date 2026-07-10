/**
 * Global site configuration.
 * This is the ONLY non-MDX file you may ever want to edit —
 * name, links and metadata used across the whole site.
 */
export const site = {
  name: 'Alwin J',
  fullName: 'Alwin Joshua',
  initials: 'AJ',
  disciplines: ['AI', 'Biotechnology', 'Scientific Computing', 'Technology Policy'],
  tagline: 'Engineering Life',
  statement:
    'Building intelligent systems, scientific software, and future technologies that bridge biology, artificial intelligence, engineering, and public policy.',
  title: 'Alwin J — Engineering Intelligence for Living Systems',
  description:
    'A digital operating system for research, products and ideas at the intersection of AI, biotechnology and engineering.',
  theme: 'Engineering Intelligence for Living Systems',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  email: 'alwinjoshua2005@gmail.com',
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
    linkedin: 'https://www.linkedin.com/in/alwinjoshua',
    twitter: 'https://x.com/',
    scholar: 'https://scholar.google.com/',
  },
  nav: [
    { label: 'About', href: '/#about' },
    { label: 'Education', href: '/#education' },
    { label: 'Research', href: '/#research' },
    { label: 'Leadership', href: '/#leadership' },
    { label: 'Achievements', href: '/#achievements' },
    { label: 'Papers', href: '/#whitepapers' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const
