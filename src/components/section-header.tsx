import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <Reveal
      className={cn('mb-14 max-w-2xl', align === 'center' && 'mx-auto text-center')}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-8 bg-primary/50" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </Reveal>
  )
}
