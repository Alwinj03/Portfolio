import Image from 'next/image'
import { cn } from '@/lib/utils'

/** Renders an entry cover image, or a branded gradient fallback with initials. */
export function Cover({
  src,
  alt,
  label,
  className,
  aspect = 'aspect-[16/10]',
  priority = false,
}: {
  src?: string
  alt: string
  label?: string
  className?: string
  aspect?: string
  priority?: boolean
}) {
  return (
    <div className={cn('relative w-full overflow-hidden', aspect, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="cover-fallback grid h-full w-full place-items-center">
          <span className="font-display text-2xl font-semibold text-foreground/70">
            {label ?? alt}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}
