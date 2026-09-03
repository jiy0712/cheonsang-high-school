import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SHORTCUTS, EXTRA_LINKS } from '@/lib/mock-data'

export function ShortcutsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">바로가기</h2>
        <p className="text-sm text-muted-foreground">자주 찾는 외부 서비스</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group flex items-center justify-between rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
          >
            <span>
              <span className="block font-semibold text-foreground group-hover:text-brand">
                {s.title}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{s.description}</span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-brand" />
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6">
        <span className="text-sm font-medium text-muted-foreground">그 외</span>
        {EXTRA_LINKS.map((label) => (
          <Link
            key={label}
            href="/admin#info"
            className="text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  )
}