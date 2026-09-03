import type { ReactNode } from 'react'
import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import type { MenuItem } from '@/lib/menu'

export function PageShell({
  menu,
  description,
  sections,
}: {
  menu: MenuItem
  description: string
  sections?: Record<string, ReactNode>
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page hero */}
        <section className="bg-brand text-brand-foreground">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <nav
              className="flex items-center gap-1.5 text-xs text-white/70"
              aria-label="breadcrumb"
            >
              <Link href="/" className="flex items-center gap-1 hover:text-white">
                <Home className="h-3.5 w-3.5" /> 홈
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white">{menu.label}</span>
            </nav>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{menu.label}</h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm text-white/80 md:text-base">
              {description}
            </p>
          </div>
        </section>

        {/* Sub-menu tabs */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <ul className="flex flex-wrap gap-1 py-3">
              {menu.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="block rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content sections */}
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {menu.children.map((child) => {
              const id = child.href.split('#')[1]
              const custom = id ? sections?.[id] : undefined
              return (
                <section
                  key={child.href}
                  id={id}
                  className={`scroll-mt-28 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border md:p-8 ${
                    custom ? 'md:col-span-2' : ''
                  }`}
                >
                  <h2 className="text-xl font-bold text-foreground">{child.label}</h2>
                  {custom ? (
                    <div className="mt-5">{custom}</div>
                  ) : (
                    <>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {child.label} 페이지 내용이 준비 중입니다. 자세한 내용은 학교 대표전화
                        052-998-8600으로 문의해 주세요.
                      </p>
                      <div className="mt-5 h-32 rounded-xl bg-secondary/70" aria-hidden="true" />
                    </>
                  )}
                </section>
              )
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
