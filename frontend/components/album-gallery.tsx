'use client'

import useSWR from 'swr'
import { ImageIcon, ExternalLink } from 'lucide-react'
import { fetcher, type AlbumItem } from '@/lib/api'

//학교앨범
export function AlbumGallery() {
  const { data, error, isLoading } = useSWR<AlbumItem[]>(
    '/boards/posts/album?limit=12',
    fetcher,
  )

  const items = data ?? []

  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4 text-brand" aria-hidden="true" />
        천상고등학교 공식 홈페이지 학교앨범 (실시간 제공)
      </p>

      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            앨범을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : items.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl bg-secondary/50 ring-1 ring-border transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {/* 외부(학교 서버) 이미지라 next/image 대신 일반 img 사용 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-3">
                    <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      <ExternalLink
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            표시할 학교앨범 사진이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
