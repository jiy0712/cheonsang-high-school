'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Search } from 'lucide-react'
import {
  fetcher,
  categoryHref,
  categoryLabel,
  formatDotDate,
  type Paginated,
  type Post,
} from '@/lib/api'

//검색 ui (기능 수정 필요)
function Highlight({ text, term }: { text: string; term: string }) {
  const q = term.trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-accent/40 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

/** 본문에서 검색어 주변을 잘라 미리보기 스니펫을 만듭니다. */
function snippet(content: string, term: string): string {
  const plain = content.replace(/\s+/g, ' ').trim()
  const q = term.trim()
  if (!q) return plain.slice(0, 120)
  const idx = plain.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return plain.slice(0, 120)
  const start = Math.max(0, idx - 40)
  return (start > 0 ? '… ' : '') + plain.slice(start, start + 120)
}

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const [term, setTerm] = useState(query)

  const { data, isLoading } = useSWR<Paginated<Post>>(
    query ? `/boards/posts?q=${encodeURIComponent(query)}&limit=50` : null,
    fetcher,
  )

  const results = data?.items ?? []

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = term.trim()
    if (next) router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-2xl font-bold text-brand md:text-3xl">통합검색</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        공지사항, 가정통신문, 학교소식 게시글을 검색합니다.
      </p>

      {/* 검색 입력 */}
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 focus-within:ring-2 focus-within:ring-brand/40">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            aria-label="통합검색어"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark"
        >
          검색
        </button>
      </form>

      {/* 결과 영역 */}
      <div className="mt-10">
        {!query ? (
          <p className="rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center text-sm text-muted-foreground">
            검색어를 입력하면 결과가 표시됩니다.
          </p>
        ) : isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">검색 중입니다…</p>
        ) : results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">&lsquo;{query}&rsquo;</span>
            에 대한 검색 결과가 없습니다.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">&lsquo;{query}&rsquo;</span> 검색 결과{' '}
              <span className="font-semibold text-brand">{results.length}</span>건
            </p>
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {results.map((post) => (
                <li key={post.id}>
                  <Link
                    href={categoryHref(post.category)}
                    className="block px-5 py-4 transition-colors hover:bg-secondary/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold text-brand">
                        {categoryLabel(post.category)}
                      </span>
                      <span className="truncate text-sm font-semibold text-foreground">
                        <Highlight text={post.title} term={query} />
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      <Highlight text={snippet(post.content, query)} term={query} />
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      {post.author && <span>{post.author}</span>}
                      <span>{formatDotDate(post.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
