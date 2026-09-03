"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, User, Lock, Mail, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ApiError } from "@/lib/api"

//회원가입 페이지
export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "").trim()
    const confirm = String(form.get("confirm") ?? "").trim()

    if (!name || !email || !password) {
      setError("이름, 이메일, 비밀번호를 모두 입력해 주세요.")
      return
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setSubmitting(true)
    try {
      const user = await register({ name, email, password })
      router.push(user.role === "admin" ? "/admin" : "/")
      router.refresh()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-md" aria-labelledby="register-heading">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex flex-col items-center gap-3 bg-brand px-6 py-8 text-center text-brand-foreground">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-foreground/15">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 id="register-heading" className="text-xl font-bold">
              회원가입
            </h1>
            <p className="mt-1 text-xs text-brand-foreground/80">CHEONSANG HIGH SCHOOL PORTAL</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                이름
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="이름을 입력하세요"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                이메일
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="8자 이상 입력하세요"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-muted-foreground hover:text-brand"
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">
                비밀번호 확인
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="confirm"
                  name="confirm"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "가입 중…" : "회원가입"}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              로그인
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
