import { FolderPlus } from 'lucide-react'
import type { CollectionKey } from '@/lib/content'

/** Shown when a collection has no MDX files yet — guides you to add content. */
export function EmptyState({ collection }: { collection: CollectionKey }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
        <FolderPlus className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-5 font-medium">Nothing here yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add an <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">.mdx</code>{' '}
        file to{' '}
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
          content/{collection}/
        </code>{' '}
        and it will appear here automatically.
      </p>
    </div>
  )
}
