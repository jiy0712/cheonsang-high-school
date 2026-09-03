import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

//메인 하단바
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.806 5.624-5.478 5.92.43.372.814 1.103.814 2.223 0 1.605-.015 2.9-.015 3.293 0 .32.216.694.825.576C20.565 22.296 24 17.798 24 12.5 24 5.87 18.627.5 12 .5z" />
    </svg>
  )
}

const FOOTER_LINKS = [
  { label: '개인정보처리방침', href: '/admin#info' },
  { label: '저작권보호정책', href: '/admin#info' },
  { label: '이메일무단수집거부', href: '/admin#info' },
  { label: '사이트맵', href: '/sitemap' },
]

const DEVELOPER = {
  name: '박지영',
  avatar: '/images/developer-jiyoung.png',
  github: 'jiy0712',
  githubUrl: 'https://github.com/jiy0712',
  email: 'pjiy0712@gmail.com',
  stacks: [
    { role: 'Frontend', stack: 'Next.js + React + TypeScript' },
    { role: 'Backend', stack: 'NestJS + PostgreSQL + TypeORM' },
  ],
}

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-brand-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/15 pb-6 text-sm"
          aria-label="하단 메뉴"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* 학교 정보 */}
          <div className="space-y-1 text-sm text-white/70">
            <p className="text-base font-bold text-white">천상고등학교</p>
            <p>(우 44929) 울산광역시 울주군 범서읍 당앞로 96</p>
            <p>대표전화 052-998-8600 · FAX 052-998-8670</p>
            <p className="pt-3 text-xs text-white/50">
              Copyright ⓒ 천상고등학교. All rights reserved.
            </p>
          </div>

          {/* 개발자 프로필 */}
          <div className="md:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Development
            </p>
            <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src={DEVELOPER.avatar || "/placeholder.svg"}
                  alt={`${DEVELOPER.name} 프로필 사진`}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-full border border-white/20 bg-white/10 object-cover"
                />
                <div className="min-w-0">
                  <p className="text-base font-bold text-white">
                    개발자 {DEVELOPER.name}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-1">
                    <a
                      href={DEVELOPER.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-white"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      {DEVELOPER.github}
                    </a>
                    <a
                      href={`mailto:${DEVELOPER.email}`}
                      className="flex items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-white"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {DEVELOPER.email}
                    </a>
                  </div>
                </div>
              </div>

              <dl className="mt-4 space-y-2 border-t border-white/10 pt-3">
                {DEVELOPER.stacks.map((s) => (
                  <div key={s.role} className="flex items-center gap-2">
                    <dt className="w-16 shrink-0">
                      <span className="rounded bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90">
                        {s.role}
                      </span>
                    </dt>
                    <dd className="text-xs text-white/75">{s.stack}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
