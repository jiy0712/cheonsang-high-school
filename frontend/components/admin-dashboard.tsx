"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR, { mutate } from "swr"
import {
  ClipboardList,
  UtensilsCrossed,
  CalendarDays,
  Users,
  Trash2,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  ApiError,
  fetcher,
  createPost,
  deletePost,
  listUsers,
  updateUserRole,
  type AuthUser,
  type Meal,
  type Paginated,
  type Post,
  type PostCategory,
  type Schedule,
} from "@/lib/api"

// 로그인 해야 볼 수 있는 페이지 안내 (아직 사용 안함)
type TabId = "posts" | "meals" | "schedules" | "users"

const TABS: { id: TabId; label: string; icon: typeof ClipboardList }[] = [
  { id: "posts", label: "게시글", icon: ClipboardList },
  { id: "meals", label: "급식", icon: UtensilsCrossed },
  { id: "schedules", label: "학사일정", icon: CalendarDays },
  { id: "users", label: "사용자", icon: Users },
]

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
const labelClass = "mb-1 block text-xs font-medium text-muted-foreground"
const btnPrimary =
  "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark disabled:opacity-70"

export function AdminDashboard() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<TabId>("posts")

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 불러오는 중…
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-4 mt-12 mb-16 max-w-md rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-border sm:mx-auto md:p-8">
        <h2 className="text-lg font-bold text-foreground">접근 권한이 없습니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          관리자 계정으로 로그인해야 이 페이지를 볼 수 있습니다.
        </p>
        <Link href="/login" className={`mt-5 inline-block ${btnPrimary}`}>
          로그인하러 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">관리자 대시보드</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-brand text-brand-foreground"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:text-brand"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === "posts" && <PostsPanel />}
      {tab === "meals" && <MealsPanel />}
      {tab === "schedules" && <SchedulesPanel />}
      {tab === "users" && <UsersPanel currentUserId={user.id} />}
    </div>
  )
}

function Feedback({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
        error ? "bg-destructive/10 text-destructive" : "bg-secondary text-brand"
      }`}
    >
      {error ?? success}
    </p>
  )
}

//게시글
function PostsPanel() {
  const [category, setCategory] = useState<PostCategory>("notice")
  const key = `/boards/posts?category=${category}&limit=50`
  const { data } = useSWR<Paginated<Post>>(key, fetcher)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    setSubmitting(true)
    try {
      await createPost({
        category,
        title: String(fd.get("title") ?? ""),
        content: String(fd.get("content") ?? ""),
        author: String(fd.get("author") ?? "") || null,
        tag: String(fd.get("tag") ?? "") || null,
        isImportant: fd.get("important") === "on",
      })
      setSuccess("게시글이 등록되었습니다.")
      form.reset()
      mutate(key)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "등록 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePost(id)
      mutate(key)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form onSubmit={handleCreate} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-lg font-bold text-foreground">새 게시글</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass}>분류</label>
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
            >
              <option value="notice">공지사항</option>
              <option value="letter">가정통신문</option>
              <option value="news">학교소식</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>제목</label>
            <input name="title" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>내용</label>
            <textarea name="content" rows={4} className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>작성 부서</label>
              <input name="author" className={inputClass} placeholder="교무기획부" />
            </div>
            <div>
              <label className={labelClass}>태그</label>
              <input name="tag" className={inputClass} placeholder="공지 / 중요 / 행정" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="important" className="h-4 w-4 accent-brand" />
            중요 게시글로 표시
          </label>
        </div>
        <button type="submit" disabled={submitting} className={`mt-4 w-full ${btnPrimary}`}>
          {submitting ? "등록 중…" : "게시글 등록"}
        </button>
        <Feedback error={error} success={success} />
      </form>

      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-lg font-bold text-foreground">
          등록된 게시글 <span className="text-sm text-muted-foreground">({data?.total ?? 0})</span>
        </h3>
        <ul className="mt-4 divide-y divide-border">
          {(data?.items ?? []).map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <span className="flex-1 truncate text-sm text-foreground">
                {p.isImportant && (
                  <span className="mr-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                    중요
                  </span>
                )}
                {p.title}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{p.author}</span>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {data && data.items.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">등록된 게시글이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

//급식
function MealsPanel() {
  const [date, setDate] = useState("2026-09-01")
  const key = `/meals/${date}`
  const { data } = useSWR<Meal[]>(key, fetcher)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    const menu = String(fd.get("menu") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    setSubmitting(true)
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("cheonsang_token") ?? ""}`,
        },
        body: JSON.stringify({
          date: String(fd.get("date")),
          type: String(fd.get("type")),
          menu,
          allergy: String(fd.get("allergy") ?? "") || null,
          kcal: String(fd.get("kcal") ?? "") || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new ApiError(
          Array.isArray(d.message) ? d.message.join("\n") : d.message ?? "등록 실패",
          res.status,
        )
      }
      setSuccess("급식이 등록되었습니다.")
      form.reset()
      mutate(key)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "등록 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form onSubmit={handleCreate} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-lg font-bold text-foreground">급식 등록</h3>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>날짜</label>
              <input name="date" type="date" defaultValue="2026-09-01" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>구분</label>
              <select name="type" className={inputClass}>
                <option value="lunch">중식</option>
                <option value="dinner">석식</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>메뉴 (한 줄에 하나씩)</label>
            <textarea name="menu" rows={5} className={inputClass} placeholder={"찰보리밥\n쇠고기미역국"} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>알레르기 정보</label>
              <input name="allergy" className={inputClass} placeholder="5, 6, 10" />
            </div>
            <div>
              <label className={labelClass}>칼로리</label>
              <input name="kcal" className={inputClass} placeholder="842 kcal" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={submitting} className={`mt-4 w-full ${btnPrimary}`}>
          {submitting ? "등록 중…" : "급식 등록"}
        </button>
        <Feedback error={error} success={success} />
      </form>

      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">급식 조회</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground"
          />
        </div>
        <div className="mt-4 space-y-4">
          {(data ?? []).map((m) => (
            <div key={m.id} className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm font-semibold text-brand">
                {m.type === "lunch" ? "중식" : "석식"}
                {m.kcal && <span className="ml-2 text-xs text-muted-foreground">{m.kcal}</span>}
              </p>
              <p className="mt-2 text-sm text-foreground">{m.menu.join(", ")}</p>
              {m.allergy && <p className="mt-1 text-xs text-muted-foreground">알레르기 · {m.allergy}</p>}
            </div>
          ))}
          {data && data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              해당 날짜에 등록된 급식이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

//학사일정
function SchedulesPanel() {
  const key = "/schedules?year=2026&month=9"
  const { data } = useSWR<Schedule[]>(key, fetcher)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    setSubmitting(true)
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("cheonsang_token") ?? ""}`,
        },
        body: JSON.stringify({
          date: String(fd.get("date")),
          time: String(fd.get("time") ?? "") || null,
          title: String(fd.get("title")),
          place: String(fd.get("place") ?? "") || null,
          type: String(fd.get("type")),
          description: String(fd.get("description") ?? "") || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new ApiError(
          Array.isArray(d.message) ? d.message.join("\n") : d.message ?? "등록 실패",
          res.status,
        )
      }
      setSuccess("일정이 등록되었습니다.")
      form.reset()
      mutate(key)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "등록 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const typeLabel = (t: string) => (t === "event" ? "학교 행사" : t === "student" ? "학생 활동" : "학부모")

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form onSubmit={handleCreate} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-lg font-bold text-foreground">일정 등록</h3>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>날짜</label>
              <input name="date" type="date" defaultValue="2026-09-01" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>시간 (선택)</label>
              <input name="time" className={inputClass} placeholder="09:00" />
            </div>
          </div>
          <div>
            <label className={labelClass}>제목</label>
            <input name="title" className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>장소 (선택)</label>
              <input name="place" className={inputClass} placeholder="대강당" />
            </div>
            <div>
              <label className={labelClass}>유형</label>
              <select name="type" className={inputClass}>
                <option value="event">학교 행사</option>
                <option value="student">학생 활동</option>
                <option value="parent">학부모</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>설명 (선택)</label>
            <textarea name="description" rows={2} className={inputClass} />
          </div>
        </div>
        <button type="submit" disabled={submitting} className={`mt-4 w-full ${btnPrimary}`}>
          {submitting ? "등록 중…" : "일정 등록"}
        </button>
        <Feedback error={error} success={success} />
      </form>

      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-lg font-bold text-foreground">2026년 9월 일정</h3>
        <ul className="mt-4 divide-y divide-border">
          {(data ?? []).map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3 text-sm">
              <span className="w-24 shrink-0 font-semibold text-brand-soft">
                {s.date.slice(5)} {s.time ?? ""}
              </span>
              <span className="min-w-0 flex-1 truncate text-foreground">{s.title}</span>
              <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                {typeLabel(s.type)}
              </span>
            </li>
          ))}
          {data && data.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">등록된 일정이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  )
}


//사용자
function UsersPanel({ currentUserId }: { currentUserId: number }) {
  const { data, mutate: refresh } = useSWR<AuthUser[]>("/users", () => listUsers())
  const [error, setError] = useState<string | null>(null)

  async function handleRole(id: number, role: "admin" | "user") {
    setError(null)
    try {
      await updateUserRole(id, role)
      refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "권한 변경 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h3 className="text-lg font-bold text-foreground">사용자 관리</h3>
      <Feedback error={error} success={null} />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-4 font-medium">이름</th>
              <th className="py-2 pr-4 font-medium">이메일</th>
              <th className="py-2 pr-4 font-medium">권한</th>
              <th className="py-2 font-medium">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(data ?? []).map((u) => (
              <tr key={u.id}>
                <td className="py-3 pr-4 font-medium text-foreground">{u.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      u.role === "admin"
                        ? "bg-brand text-brand-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {u.role === "admin" ? "관리자" : "일반"}
                  </span>
                </td>
                <td className="py-3">
                  {u.id === currentUserId ? (
                    <span className="text-xs text-muted-foreground">본인</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRole(u.id, u.role === "admin" ? "user" : "admin")}
                      className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-brand hover:bg-secondary"
                    >
                      {u.role === "admin" ? "관리자 해제" : "관리자 지정"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
