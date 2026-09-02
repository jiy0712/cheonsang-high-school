import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NAV_MENU } from '@/lib/menu'

//사이트맵 메뉴 소개글
export default function SitemapPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-brand text-brand-foreground">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <nav className="flex items-center gap-1.5 text-xs text-white/70" aria-label="breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-white">
                <Home className="h-3.5 w-3.5" /> 홈
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white">사이트맵</span>
            </nav>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">사이트맵</h1>
            <p className="mt-3 text-sm text-white/80 md:text-base">
              천상고등학교 홈페이지의 전체 메뉴 구조입니다.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_MENU.map((item) => (
              <section key={item.href} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
                <Link href={item.href} className="text-lg font-bold text-brand hover:underline">
                  {item.label}
                </Link>
                <ul className="mt-4 space-y-2">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}