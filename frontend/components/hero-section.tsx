"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import useSWR from "swr"
import {
  fetcher,
  formatMealLabel,
  formatShortDate,
  type Meal,
  type Paginated,
  type Post,
  type Schedule,
} from "@/lib/api"

//홈화면 주요 내용
const TODAY = "2026-09-01" //데모

function tagClass(tag?: string | null) {
  if (tag === "중요") return "bg-brand text-brand-foreground"
  if (tag === "행정") return "bg-accent text-accent-foreground"
  return "bg-secondary text-secondary-foreground"
}

export function HeroSection() {
  const {
    data: meal,
    error: mealError,
    isLoading: mealLoading,
  } = useSWR<Meal | null>("/meals/today", fetcher)
  const { data: todaySchedule } = useSWR<Schedule[]>(`/schedules?date=${TODAY}`, fetcher)
  const { data: upcoming } = useSWR<Schedule[]>("/schedules/upcoming?limit=1", fetcher)
  const { data: noticeData } = useSWR<Paginated<Post>>(
    "/boards/posts?category=notice&limit=4",
    fetcher,
  )

  const mealItems = meal?.menu ?? []
  const scheduleItems = (todaySchedule ?? []).filter((s) => s.time)
  const notices = noticeData?.items ?? []
  const upcomingNote = upcoming && upcoming[0]
    ? `다가오는 일정 · ${formatShortDate(upcoming[0].date)} ${upcoming[0].title}`
    : null

  return (
    <section className="relative">
      {/* Hero image */}
      <div className="relative min-h-[300px] overflow-hidden md:min-h-[400px]">
        <img
          src="/images/hero-school.png"
          alt="천상고등학교 전경"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/60 to-brand/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/80">
            CHEONSANG HIGH SCHOOL
          </p>
          <h1 className="mt-4 text-balance text-3xl font-bold leading-tight text-white md:text-5xl md:leading-tight">
            새로운 생각, 배움이
            <br />
            즐거운 학교
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-sm text-white/85 md:text-base">
            울산 울주 범서, 학생 한 사람의 성장을 중심에 두는 학교입니다.
          </p>
        </div>
      </div>

      {/* Cards below image */}
      <div className="mx-auto mt-8 max-w-6xl px-4 pb-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Meal */}
          <article className="rounded-2xl bg-card p-6 shadow-xl ring-1 ring-border">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand">오늘의 급식</h2>
              <Link href="/students#meal" className="text-xs text-muted-foreground hover:text-brand">
                식단표
              </Link>
            </header>
            {mealLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">급식 정보를 불러오는 중입니다…</p>
            ) : mealError ? (
              <p className="mt-4 text-sm text-muted-foreground">
                급식 정보를 불러오지 못했습니다.
              </p>
            ) : meal && mealItems.length > 0 ? (
              <>
                <p className="mt-4 text-sm font-semibold text-brand-soft">
                  {formatMealLabel(meal.date, meal.type)}
                </p>
                <ul className="mt-3 space-y-2">
                  {mealItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{meal.allergy ? `알레르기 정보 · ${meal.allergy}` : "알레르기 정보 없음"}</span>
                  {meal.kcal && <span className="font-semibold text-brand">{meal.kcal}</span>}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">급식 정보가 없습니다.</p>
            )}
          </article>

          {/* Today schedule */}
          <article className="rounded-2xl bg-card p-6 shadow-xl ring-1 ring-border">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand">오늘의 일정</h2>
              <Link
                href="/students#schedule"
                className="text-xs text-muted-foreground hover:text-brand"
              >
                학사일정
              </Link>
            </header>
            {scheduleItems.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {scheduleItems.map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="w-12 shrink-0 text-sm font-bold text-brand-soft">{s.time}</span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">{s.title}</span>
                      {s.place && (
                        <span className="block text-xs text-muted-foreground">{s.place}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">오늘 등록된 일정이 없습니다.</p>
            )}
            {upcomingNote && (
              <div className="mt-4 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-brand">
                {upcomingNote}
              </div>
            )}
          </article>

          {/* Notices */}
          <article className="rounded-2xl bg-card p-6 shadow-xl ring-1 ring-border">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand">공지사항</h2>
              <Link
                href="/news#notice"
                className="flex items-center text-xs text-muted-foreground hover:text-brand"
              >
                전체보기 <ChevronRight className="h-3 w-3" />
              </Link>
            </header>
            <ul className="mt-4 space-y-3">
              {notices.map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${tagClass(n.tag)}`}
                  >
                    {n.tag ?? "공지"}
                  </span>
                  <Link
                    href="/news#notice"
                    className="flex-1 truncate text-sm text-foreground hover:text-brand"
                  >
                    {n.title}
                  </Link>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatShortDate(n.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}