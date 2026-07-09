'use client'

import * as runtime from 'react/jsx-runtime'
import { useMemo } from 'react'
import Image from 'next/image'
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
  img: ({ src, alt = '' }: React.ComponentProps<'img'>) =>
    typeof src === 'string' ? (
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes="(max-width: 768px) 100vw, 768px"
        className={cn('my-6 h-auto w-full rounded-2xl border border-border')}
      />
    ) : null,
}

export function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl">
      <Component components={components} />
    </div>
  )
}
