"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import useSWR from "swr"
import { fetcher, type AlbumItem } from "@/lib/api"

export function NewsSection() {
  const { data, isLoading } = useSWR<AlbumItem[]>(
    "/boards/posts/album?limit=4",
    fetcher,
  )

  const items = data ?? []

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            학교소식
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            천상고의 오늘을 사진으로 만나보세요.
          </p>
        </div>

        <Link
          href="/news#album"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
        >
          소식 전체보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && items.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border"
              >
                <div className="aspect-[4/3] animate-pulse bg-secondary" />

                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))
          : items.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* 외부(학교 서버) 이미지라 next/image 대신 일반 img 사용 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-brand">
                    {item.title}
                  </h3>
                </div>
              </a>
            ))}
      </div>
    </section>
  )
}
