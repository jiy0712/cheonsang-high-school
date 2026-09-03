'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { fetcher, formatMealLabel, type Meal } from '@/lib/api'

//급식 페이지
function todayISO(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-5 ring-1 ring-border">
      <p className="text-sm font-semibold text-brand-soft">
        {formatMealLabel(meal.date, meal.type)}
      </p>
      <ul className="mt-3 space-y-2">
        {meal.menu.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-soft"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {meal.allergy ? `알레르기 정보 · ${meal.allergy}` : '알레르기 정보 없음'}
        </span>
        {meal.kcal && <span className="font-semibold text-brand">{meal.kcal}</span>}
      </div>
    </div>
  )
}

export function MealMenu() {
  const [date, setDate] = useState(todayISO)
  const {
    data: meals,
    error,
    isLoading,
  } = useSWR<Meal[]>(`/meals/${date}`, fetcher)

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <UtensilsCrossed className="h-4 w-4 text-brand" aria-hidden="true" />
          천상고등학교 급식 식단 (나이스 실시간 제공)
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">급식 날짜 선택</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayISO())}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          />
        </label>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            급식 정보를 불러오는 중입니다…
          </p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            급식 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : meals && meals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {meals.map((meal) => (
              <MealCard key={meal.id ?? `${meal.date}-${meal.type}`} meal={meal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            해당 날짜에 등록된 급식 정보가 없습니다. (주말·공휴일·방학 등)
          </p>
        )}
      </div>
    </div>
  )
}
