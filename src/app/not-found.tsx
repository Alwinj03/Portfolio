import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative grid min-h-[80vh] place-items-center overflow-hidden px-6">
      <div className="aurora" />
      <div className="relative text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">Error 404</p>
        <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight sm:text-8xl">
          Off the map
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          This page drifted outside the known system. Let&apos;s get you back to something real.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  )
}
