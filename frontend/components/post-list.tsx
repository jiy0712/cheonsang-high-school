'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Megaphone, ChevronDown } from 'lucide-react'
import {
  fetcher,
  formatDotDate,
  type Paginated,
  type Post,
  type PostCategory,
} from '@/lib/api'

//공지사항 가정통신문(날짜 있다면 제외하기)
export function PostList({
  category,
  sourceNote,
}: {
  category: PostCategory
  sourceNote?: string
}) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const { data, error, isLoading } = useSWR<Paginated<Post>>(
    `/boards/posts?category=${category}&limit=20`,
    fetcher,
  )

  const items = data?.items ?? []

  return (
    <div>
      {sourceNote && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Megaphone className="h-4 w-4 text-brand" aria-hidden="true" />
          {sourceNote}
        </p>
      )}

      <div className="mt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-border rounded-xl bg-secondary/50 ring-1 ring-border">
            {items.map((post) => {
              const open = expanded === post.id
              return (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : post.id)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary"
                    aria-expanded={open}
                  >
                    {post.isImportant && (
                      <span className="shrink-0 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                        중요
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {post.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDotDate(post.createdAt)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <div className="border-t border-border/70 bg-card px-4 py-4">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {post.content}
                      </p>
                      {post.author && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          작성: {post.author}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            표시할 게시글이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
