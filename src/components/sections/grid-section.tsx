import { all, toCards, type CollectionKey } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { EntryCard } from '@/components/cards/entry-card'
import { Stagger, StaggerItem } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import { EmptyState } from './empty-state'

/**
 * A drop-in section that renders any collection as a responsive card grid.
 * Used by Research, Projects, White Papers and Blog — one component, many
 * sections, zero duplication.
 */
export function GridSection({
  id,
  collection,
  eyebrow,
  title,
  description,
  columns = 3,
  limit,
}: {
  id: string
  collection: CollectionKey
  eyebrow?: string
  title: string
  description?: string
  columns?: 2 | 3
  limit?: number
}) {
  const items = limit ? all(collection).slice(0, limit) : all(collection)

  return (
    <section id={id} className="section scroll-mt-24">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      {items.length === 0 ? (
        <EmptyState collection={collection} />
      ) : (
        <Stagger
          className={cn(
            'grid gap-6',
            columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {toCards(items).map((entry) => (
            <StaggerItem key={entry.url} className="h-full">
              <EntryCard entry={entry} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  )
}
