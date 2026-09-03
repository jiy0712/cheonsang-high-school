"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import useSWR from "swr"

import {
  fetcher,
  formatShortDate,
  type Paginated,
  type Post,
} from "@/lib/api"

type BoardRow = {
  id: number
  title: string
  date: string
  tag?: string | null
  important?: boolean
}

type BoardCardProps = {
  title: string
  href: string
  endpoint: string
}

function BoardCard({
  title,
  href,
  endpoint,
}: BoardCardProps) {
  const { data, isLoading } = useSWR<Paginated<Post>>(
    endpoint,
    fetcher
  )

  const items: BoardRow[] = (data?.items ?? []).map((post) => ({
    id: post.id,
    title: post.title,
    date: formatShortDate(post.createdAt),
    tag: post.tag,
    important: post.isImportant,
  }))

  return (
    <article className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border md:p-7">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-bold text-foreground">
          {title}
        </h3>

        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"
          aria-label={`${title} 더보기`}
        >
          <Plus className="h-3.5 w-3.5" />
          더보기
        </Link>
      </header>

      {isLoading ? (
        <ul className="mt-2 divide-y divide-border/70">
          {Array.from({ length: 4 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-3 py-3"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-soft" />
              <span className="h-4 flex-1 animate-pulse rounded bg-secondary" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          표시할 공지가 없습니다.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={href}
                className="flex items-center gap-3 py-3 text-sm text-foreground transition-colors hover:text-brand"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-soft" />

                <span className="flex-1 truncate">
                  {item.important && (
                    <span className="mr-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground align-middle">
                      중요
                    </span>
                  )}

                  {item.title}
                </span>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function BoardSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-16">
      <div className="grid gap-5 md:grid-cols-2">
        <BoardCard
          title="공지사항"
          href="/news#notice"
          endpoint="/boards/posts?category=notice&limit=4"
        />

        <BoardCard
          title="가정통신문"
          href="/news#letter"
          endpoint="/boards/posts?category=letter&limit=4"
        />
      </div>
    </section>
  )
}
