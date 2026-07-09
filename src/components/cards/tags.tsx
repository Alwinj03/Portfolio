import { Badge } from '@/components/ui/badge'

export function TagList({ tags, max = 4 }: { tags: string[]; max?: number }) {
  if (!tags.length) return null
  const shown = tags.slice(0, max)
  const extra = tags.length - shown.length
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <Badge key={t}>{t}</Badge>
      ))}
      {extra > 0 && <Badge>+{extra}</Badge>}
    </div>
  )
}
