'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { ApiError } from '@/lib/api'

//로그인 페이지
const TABS = [
  { id: 'student', label: '학생·학부모' },
  { id: 'teacher', label: '교직원' },
] as const

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('student')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const form = new FormData(e.currentTarget)
    const id = String(form.get('userId') ?? '').trim()
    const pw = String(form.get('password') ?? '').trim()
    if (!id || !pw) {
      setError('아이디(이메일)와 비밀번호를 모두 입력해 주세요.')
      return
    }
    setSubmitting(true)
    try {
      const user = await login(id, pw)
      setMessage(`${user.name}님, 환영합니다.`)
      // redirect 파라미터가 있으면 원래 보려던 페이지로, 없으면 홈으로 이동합니다.
      const redirect = searchParams.get('redirect')
      router.push(redirect && redirect.startsWith('/') ? redirect : '/')
      router.refresh()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-md" aria-labelledby="login-heading">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header band */}
        <div className="flex flex-col items-center gap-3 bg-brand px-6 py-8 text-center text-brand-foreground">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-foreground/15">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 id="login-heading" className="text-xl font-bold">
              천상고등학교 로그인
            </h1>
            <p className="mt-1 text-xs text-brand-foreground/80">
              CHEONSANG HIGH SCHOOL PORTAL
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Tabs */}
          <div
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1"
            role="tablist"
            aria-label="로그인 유형"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? 'bg-card text-brand shadow-sm'
                    : 'text-muted-foreground hover:text-brand'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="userId" className="mb-1.5 block text-sm font-medium text-foreground">
                아이디 (이메일)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="userId"
                  name="userId"
                  type="email"
                  autoComplete="username"
                  placeholder="이메일을 입력하세요"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                비밀번호
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-muted-foreground hover:text-brand"
                  aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-brand"
                />
                아이디 저장
              </label>
              <Link href="#" className="font-medium text-brand hover:underline">
                아이디·비밀번호 찾기
              </Link>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-lg bg-secondary px-3 py-2 text-center text-xs font-medium text-brand"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-center text-xs text-muted-foreground">
            데모 계정 · 관리자 admin@cheonsang.hs.kr / admin1234! · 학생 student@cheonsang.hs.kr / student1234!
          </div>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            아직 계정이 없으신가요?{' '}
            <Link href="/register" className="font-semibold text-brand hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">
          홈으로 돌아가기
        </Link>
      </p>
    </section>
  )
}
