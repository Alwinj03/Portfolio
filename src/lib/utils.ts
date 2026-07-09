import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shared cubic-bezier easing, typed as a tuple for Framer Motion v12. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function formatDate(date?: string) {
  if (!date) return undefined
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
