'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import type { SearchDoc } from '@/lib/content'
import { cn } from '@/lib/utils'

interface Ctx {
  open: boolean
  setOpen: (v: boolean) => void
}
const PaletteCtx = createContext<Ctx>({ open: false, setOpen: () => {} })
export const useCommandPalette = () => useContext(PaletteCtx)

export function CommandPalette({ docs }: { docs: SearchDoc[] }) {
  const [open, setOpen] = useState(false)
  const [konami, setKonami] = useState(false)
  const router = useRouter()

  // ⌘K / Ctrl-K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Konami code easter egg → toggles a hidden "lab mode" class on <html>
  useEffect(() => {
    const seq = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
    ]
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      idx = e.key.toLowerCase() === seq[idx].toLowerCase() ? idx + 1 : 0
      if (idx === seq.length) {
        idx = 0
        setKonami(true)
        document.documentElement.classList.toggle('lab-mode')
        setTimeout(() => setKonami(false), 3000)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const go = (url: string) => {
    setOpen(false)
    if (url.startsWith('/#')) {
      window.location.hash = url.slice(1)
    } else {
      router.push(url)
    }
  }

  const grouped = docs.reduce<Record<string, SearchDoc[]>>((acc, d) => {
    ;(acc[d.type] ??= []).push(d)
    return acc
  }, {})

  return (
    <PaletteCtx.Provider value={{ open, setOpen }}>
      {konami && (
        <div className="fixed inset-x-0 top-24 z-[60] flex justify-center">
          <div className="glass rounded-full px-4 py-2 text-sm font-medium text-gradient">
            ⚡ Lab mode engaged
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <Command
            className="glass w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            loop
          >
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Command.Input
                autoFocus
                placeholder="Search projects, research, papers…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-[50vh] overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              {Object.entries(grouped).map(([type, items]) => (
                <Command.Group
                  key={type}
                  heading={type}
                  className="px-2 py-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  {items.map((d) => (
                    <Command.Item
                      key={d.url + d.title}
                      value={`${d.title} ${d.subtitle ?? ''} ${d.tags.join(' ')}`}
                      onSelect={() => go(d.url)}
                      className={cn(
                        'flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2 text-sm',
                        'aria-selected:bg-accent aria-selected:text-accent-foreground',
                      )}
                    >
                      <span className="font-medium text-foreground">{d.title}</span>
                      {d.subtitle && (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {d.subtitle}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </div>
      )}
    </PaletteCtx.Provider>
  )
}
