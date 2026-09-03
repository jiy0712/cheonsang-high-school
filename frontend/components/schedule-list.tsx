'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetcher, type Schedule } from '@/lib/api'

//학사일정 페이지
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
}

export function ScheduleList() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-12

  const {
    data,
    error,
    isLoading,
  } = useSWR<Schedule[]>(`/schedules?year=${year}&month=${month}`, fetcher)

  const schedules = (data ?? [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  function move(delta: number) {
    let m = month + delta
    let y = year
    if (m < 1) {
      m = 12
      y -= 1
    } else if (m > 12) {
      m = 1
      y += 1
    }
    setYear(y)
    setMonth(m)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
          천상고등학교 학사일정 (나이스 실시간 제공)
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="이전 달"
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-brand"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-[110px] text-center text-sm font-bold text-brand">
            {year}년 {month}월
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="다음 달"
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-brand"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            학사일정을 불러오는 중입니다…
          </p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            학사일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : schedules.length > 0 ? (
          <ul className="divide-y divide-border rounded-xl bg-secondary/50 ring-1 ring-border">
            {schedules.map((s) => (
              <li
                key={s.id ?? `${s.date}-${s.title}`}
                className="flex items-start gap-4 p-4"
              >
                <span className="w-24 shrink-0 text-sm font-bold text-brand-soft">
                  {formatDateLabel(s.date)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  {s.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {year}년 {month}월에 등록된 학사일정이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
