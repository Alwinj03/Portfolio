import { all, stats } from '@/lib/content'
import { MDX } from '@/components/mdx'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { AnimatedNumber } from '@/components/ui/animated-number'

export function About() {
  const about = all('about')[0]

  return (
    <section id="about" className="section scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeader
            eyebrow={about?.subtitle ?? 'About'}
            title={about?.title ?? 'The mission behind the work'}
          />
          <Reveal delay={0.1}>
            {about ? (
              <MDX code={about.body} />
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground">
                Add <code className="font-mono text-sm">content/about/about.mdx</code> to tell your
                story here — mission, vision, and current focus.
              </p>
            )}
          </Reveal>
        </div>

        <div className="lg:pt-24">
          <Reveal delay={0.2} className="grid grid-cols-2 gap-4">
            {stats().map((s) => (
              <div
                key={s.label}
                className="glass rounded-3xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="font-display text-4xl font-semibold text-gradient">
                  <AnimatedNumber value={s.value} suffix="+" />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
