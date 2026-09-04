'use client'

import useSWR from 'swr'
import { ExternalLink, Megaphone } from 'lucide-react'
import { fetcher, formatDotDate, type Post } from '@/lib/api'
import { BOARD_CODES } from '@/lib/board-codes'

const SCHOOL_HOME =
  process.env.NEXT_PUBLIC_SCHOOL_HOME_BASE ??
  'https://school.use.go.kr/cheonsang-h'

export function ExternalBoard({ sectionKey }: { sectionKey: string }) {
  const config = BOARD_CODES[sectionKey]
  const code = config?.code ?? ''
  const sourceUrl = code ? `${SCHOOL_HOME}/${code}` : SCHOOL_HOME

  const { data, error, isLoading } = useSWR<Post[]>(
    code ? `/boards/posts/external?code=${encodeURIComponent(code)}&limit=15` : null,
    fetcher,
  )

  const items = data ?? []

  return (
    <div>
      {config?.note && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Megaphone className="h-4 w-4 text-brand" aria-hidden="true" />
          {config.note}
        </p>
      )}

      <div className="mt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">목록을 불러오는 중입니다…</p>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-border rounded-xl bg-secondary/50 ring-1 ring-border">
            {items.map((post) => (
              <li key={`${post.id}-${post.title}`}>
                <a
                  href={post.content.match(/https?:\/\/\S+/)?.[0] ?? sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-secondary"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDotDate(post.createdAt)}
                  </span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {error
              ? '목록을 불러오지 못했습니다. 학교 홈페이지에서 직접 확인해 주세요.'
              : '현재 표시할 게시글이 없습니다. 학교 홈페이지에서 최신 내용을 확인해 주세요.'}
          </p>
        )}
      </div>

      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
      >
        학교 홈페이지에서 보기
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
