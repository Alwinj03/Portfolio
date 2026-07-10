import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { site } from '@/lib/site'

type FooterLink = { label: string; href: string; disabled?: boolean }

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {site.initials}
              </span>
              <span className="font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{site.theme}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol
              title="Explore"
              links={site.nav.map((n) => ({ label: n.label, href: n.href }))}
            />
            <FooterCol
              title="Connect"
              links={[
                { label: 'GitHub', href: site.social.github, disabled: true },
                { label: 'LinkedIn', href: site.social.linkedin },
                { label: 'Email', href: `mailto:${site.email}` },
              ]}
            />
            <FooterCol
              title="More"
              links={[
                { label: 'Resume', href: site.resume },
                { label: 'RSS', href: '/rss.xml' },
                { label: 'Sitemap', href: '/sitemap.xml' },
              ]}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Built as a living system.
          </p>
          <div className="flex items-center gap-3">
            {/* GitHub isn't live yet — shown as a dimmed, non-interactive chip. */}
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground opacity-40 blur-[1px]"
            >
              <Github className="h-4 w-4" />
            </span>
            <IconLink href={site.social.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </IconLink>
            <IconLink href={`mailto:${site.email}`} label="Email">
              <Mail className="h-4 w-4" />
            </IconLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) =>
          l.disabled ? (
            <li key={l.label}>
              {/* Not live yet: a blurred, non-interactive placeholder. */}
              <span
                aria-hidden
                className="pointer-events-none inline-block select-none text-sm text-muted-foreground opacity-40 blur-[1px]"
              >
                {l.label}
              </span>
            </li>
          ) : (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
    >
      {children}
    </a>
  )
}
