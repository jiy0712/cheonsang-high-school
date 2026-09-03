"use client"

import Link from "next/link"
import useSWR from "swr"
import { fetcher, formatShortDate, type Schedule, type ScheduleType } from "@/lib/api"

//학사일정 페이지
const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"]

// 실제 날짜 기준으로 이번 달 학사일정을 보여줌
const NOW = new Date()
const YEAR = NOW.getFullYear()
const MONTH = NOW.getMonth() + 1

const LEGEND = [
  { label: "학교 행사", type: "event" as const, dot: "bg-brand" },
  { label: "학생 활동", type: "student" as const, dot: "bg-brand-soft" },
  { label: "학부모", type: "parent" as const, dot: "bg-accent-foreground" },
]

function dotColor(type: ScheduleType) {
  if (type === "event") return "bg-brand"
  if (type === "student") return "bg-brand-soft"
  return "bg-accent-foreground"
}

export function ScheduleSection() {
  const { data: monthData } = useSWR<Schedule[]>(
    `/schedules?year=${YEAR}&month=${MONTH}`,
    fetcher,
  )
  const { data: upcomingData } = useSWR<Schedule[]>("/schedules/upcoming?limit=4", fetcher)

  const monthEvents = monthData ?? []
  const upcoming = upcomingData ?? []

  const eventByDay = new Map<number, Schedule>()
  for (const ev of monthEvents) {
    const day = new Date(ev.date).getDate()
    if (!eventByDay.has(day)) eventByDay.set(day, ev)
  }

  const firstWeekday = new Date(YEAR, MONTH - 1, 1).getDay()
  const daysInMonth = new Date(YEAR, MONTH, 0).getDate()

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <section className="bg-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">학사일정</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              이번 달 주요 일정을 한눈에 확인하세요.
            </p>
          </div>
          <ul className="flex flex-wrap gap-4">
            {LEGEND.map((l) => (
              <li key={l.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Calendar */}
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border md:p-6">
            <h3 className="text-lg font-bold text-brand">
              {YEAR}년 {MONTH}월
            </h3>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {WEEK_DAYS.map((d, i) => (
                <div
                  key={d}
                  className={`pb-2 text-xs font-semibold ${
                    i === 0
                      ? "text-destructive"
                      : i === 6
                        ? "text-brand-soft"
                        : "text-muted-foreground"
                  }`}
                >
                  {d}
                </div>
              ))}
              {cells.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} className="aspect-square" />
                const ev = eventByDay.get(day)
                const weekday = idx % 7
                return (
                  <div
                    key={day}
                    className="flex aspect-square flex-col items-center rounded-lg p-1 text-sm hover:bg-secondary"
                  >
                    <span
                      className={`${
                        weekday === 0 ? "text-destructive" : "text-foreground"
                      } ${ev ? "font-bold" : ""}`}
                    >
                      {day}
                    </span>
                    {ev && (
                      <span className="mt-auto flex w-full flex-col items-center gap-0.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${dotColor(ev.type)}`}
                          aria-hidden="true"
                        />
                        <span className="hidden truncate text-[9px] leading-tight text-muted-foreground md:block">
                          {ev.title}
                        </span>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming */}
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
            <h3 className="text-lg font-bold text-foreground">다가오는 일정</h3>
            {upcoming.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {upcoming.map((s) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-sm font-bold text-brand-soft">
                      {formatShortDate(s.date)}
                    </span>
                    <span className="text-sm text-foreground">{s.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                다가오는 일정이 없습니다.
              </p>
            )}
            <Link
              href="/students#schedule"
              className="mt-6 block rounded-lg bg-brand py-2.5 text-center text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              전체 학사일정 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
