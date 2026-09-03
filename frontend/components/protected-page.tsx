'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight, Lock, LogIn } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageShell } from '@/components/page-shell'
import { useAuth } from '@/components/auth-provider'
import type { MenuItem } from '@/lib/menu'

//교육활동 로그인 유무 파악해서 ui 보여주기
export function ProtectedPage({
  menu,
  description,
}: {
  menu: MenuItem
  description: string
}) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // 로그인 상태이면 원래 페이지를 그대로 보여줍니다.
  if (user) {
    return <PageShell menu={menu} description={description} />
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
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

        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-20 md:px-6 md:py-28">
          {loading ? (
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand"
              role="status"
              aria-label="확인 중"
            />
          ) : (
            <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border md:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Lock className="h-6 w-6 text-brand" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-foreground">
                로그인이 필요한 메뉴입니다
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {menu.label} 메뉴는 로그인 후 이용하실 수 있습니다. 계정으로
                로그인해 주세요.
              </p>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                로그인하러 가기
              </Link>
              <p className="mt-4 text-xs text-muted-foreground">
                아직 계정이 없으신가요?{' '}
                <Link href="/register" className="font-semibold text-brand hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
