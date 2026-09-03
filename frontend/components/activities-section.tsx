import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ACTIVITIES } from '@/lib/mock-data'

export function ActivitiesSection() {
  return (
    <section className="bg-brand-dark text-brand-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="text-2xl font-bold md:text-3xl">교육활동</h2>
        <p className="mt-2 text-sm text-white/70">
          천상고가 학생과 함께 만들어가는 배움의 방식입니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <ArrowUpRight className="h-5 w-5 text-white/50 transition-colors group-hover:text-white" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{a.description}</p>
              <span className="mt-4 inline-block text-xs font-medium text-white/80 group-hover:text-white">
                자세히 보기
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
