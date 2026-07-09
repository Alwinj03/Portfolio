import { ArrowUpRight, Github, Linkedin, Mail, FileText } from 'lucide-react'
import { site } from '@/lib/site'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'

const channels = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, Icon: Mail },
  { label: 'GitHub', value: 'View code', href: site.social.github, Icon: Github },
  { label: 'LinkedIn', value: 'Connect', href: site.social.linkedin, Icon: Linkedin },
  { label: 'Resume', value: 'Download PDF', href: site.resume, Icon: FileText },
]

export function Contact() {
  return (
    <section id="contact" className="section scroll-mt-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-16">
        <div className="aurora opacity-70" />
        <div className="relative">
          <SectionHeader
            eyebrow="Contact"
            title="Let's build the future together"
            description="Open to research collaborations, product ideas, and conversations about the frontier of biology and AI."
            align="center"
          />
          <Reveal delay={0.1} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {channels.map(({ label, value, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/50 p-5 transition-all hover:border-primary/40 hover:glow"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
