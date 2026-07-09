'use client'

import * as runtime from 'react/jsx-runtime'
import { useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Compile Velite's function-body MDX string into a React component. */
function useMDXComponent(code: string) {
  return useMemo(() => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
  }, [code])
}

const components = {
  a: ({ href = '', ...props }: React.ComponentProps<'a'>) => {
    const external = href.startsWith('http')
    return (
      <Link
        href={href}
        className="font-medium text-primary underline-offset-4 hover:underline"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    )
  },
  img: ({ className, alt = '', ...props }: React.ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn('my-6 w-full rounded-2xl border border-border', className)}
      alt={alt}
      loading="lazy"
      {...props}
    />
  ),
}

export function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl">
      <Component components={components} />
    </div>
  )
}
