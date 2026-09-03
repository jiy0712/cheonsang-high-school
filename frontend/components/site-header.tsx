'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Search, Menu, X, ChevronDown } from 'lucide-react'
import { NAV_MENU } from '@/lib/menu'
import { useAuth } from '@/components/auth-provider'

//메인 상단바
export function SiteHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  function handleLogout() {
    logout()
    router.push('/')
    router.refresh()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchTerm.trim()
    if (!q) return
    setMobileOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  function navHref(item: (typeof NAV_MENU)[number]) {
    return item.href
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-6 py-2 text-xs text-muted-foreground">
          {user ? (
            <>
              <span className="font-medium text-foreground">
                {user.name}님
                {user.role === 'admin' && (
                  <span className="ml-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                    관리자
                  </span>
                )}
              </span>
              {user.role === 'admin' && (
                <>
                  <span className="text-border">|</span>
                  <Link href="/admin/dashboard" className="hover:text-brand transition-colors">
                    관리자
                  </Link>
                </>
              )}
              <span className="text-border">|</span>
              <button type="button" onClick={handleLogout} className="hover:text-brand transition-colors">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand transition-colors">
                로그인
              </Link>
              <span className="text-border">|</span>
              <Link href="/register" className="hover:text-brand transition-colors">
                회원가입
              </Link>
            </>
          )}
          <span className="text-border">|</span>
          <Link href="/sitemap" className="hover:text-brand transition-colors">
            사이트맵
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold text-brand">천상고등학교</span>
            <span className="block text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
              CHEONSANG HIGH SCHOOL
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex" aria-label="주 메뉴">
          <ul className="group flex items-stretch">
            {NAV_MENU.map((item) => (
              <li key={item.href} className="group/nav relative">
                <Link
                  href={navHref(item)}
                  className={`flex h-full items-center whitespace-nowrap py-3 font-medium text-foreground transition-all hover:text-brand ${
                    searchFocused ? 'px-3 text-[13px]' : 'px-5 text-[15px]'
                  }`}
                >
                  {item.label}
                </Link>
                {/* Submenu */}
                <div className="pointer-events-none absolute left-1/2 top-full w-44 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100">
                  <ul className="mt-1 overflow-hidden rounded-xl border border-border bg-card py-2 shadow-lg">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-brand transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-brand/40 lg:flex"
            role="search"
          >
            <button
              type="submit"
              aria-label="검색"
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="통합검색"
              aria-label="통합검색어"
              className="w-28 bg-transparent text-foreground outline-none placeholder:text-muted-foreground focus:w-40 transition-[width]"
            />
          </form>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-brand lg:hidden"
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-[65px] z-40 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="fixed inset-x-0 top-[65px] z-50 max-h-[calc(100dvh-65px)] overflow-y-auto border-t border-border bg-card"
            aria-label="모바일 메뉴"
          >
            <form onSubmit={handleSearch} role="search" className="border-b border-border p-4">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="통합검색"
                  aria-label="통합검색어"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </form>
            <ul className="divide-y divide-border">
              {NAV_MENU.map((item) => {
                const expanded = openSection === item.href
                return (
                  <li key={item.href}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={navHref(item)}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-5 py-4 text-base font-semibold text-foreground"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenSection(expanded ? null : item.href)}
                        className="flex h-12 w-12 items-center justify-center text-muted-foreground"
                        aria-label={`${item.label} 하위 메뉴`}
                        aria-expanded={expanded}
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {expanded && (
                      <ul className="bg-secondary/60 pb-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-7 py-3 text-sm text-muted-foreground hover:text-brand"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-wrap items-center gap-4 px-5 py-4 text-sm text-muted-foreground">
              {user ? (
                <>
                  <span className="font-medium text-foreground">{user.name}님</span>
                  {user.role === 'admin' && (
                    <>
                      <span className="text-border">|</span>
                      <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                        관리자
                      </Link>
                    </>
                  )}
                  <span className="text-border">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      handleLogout()
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    로그인
                  </Link>
                  <span className="text-border">|</span>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
              <span className="text-border">|</span>
              <Link href="/sitemap" onClick={() => setMobileOpen(false)}>
                사이트맵
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
