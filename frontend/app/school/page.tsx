import Link from 'next/link'
import {
  Home,
  ChevronRight,
  Quote,
  Target,
  History,
  Flower2,
  MapPin,
  Phone,
  Printer,
  Bus,
  GraduationCap,
  BookOpen,
  Heart,
  Users,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NAV_MENU } from '@/lib/menu'

//학교소개 (변하지 않는 내용이므로 수기로 작성)
const menu = NAV_MENU.find((m) => m.href === '/school')!

// 교육목표 / 인재상
const GOALS = [
  {
    icon: BookOpen,
    title: '배움을 실천하는 사람',
    desc: '기초·기본에 충실하고 스스로 탐구하며 배운 것을 삶 속에서 실천하는 자기주도적 학습인을 기릅니다.',
  },
  {
    icon: Heart,
    title: '선을 행하는 사람',
    desc: '바른 인성과 민주 시민의식을 갖추고 배려와 나눔을 실천하는 따뜻한 인재를 기릅니다.',
  },
  {
    icon: Users,
    title: '더불어 행복한 사람',
    desc: '서로 존중하고 협력하며 공동체와 함께 성장하는 조화로운 사람을 기릅니다.',
  },
]

// 학교 연혁
const HISTORY = [
  { date: '2015. 09.', text: '천상고등학교 시설 착공' },
  { date: '2016. 12.', text: '학교 신축 교사 준공' },
  { date: '2017. 03. 01.', text: '천상고등학교 개교 (제1대 교장 취임)' },
  { date: '2017. 03. 02.', text: '제1회 입학식 (신입생 입학)' },
  { date: '2020. 01.', text: '제1회 졸업식 (졸업생 배출)' },
  { date: '2022. 03.', text: 'STEAM 선도학교 · 고교학점제 연구학교 운영' },
  { date: '2024. 03.', text: '울산광역시교육청 지정 미래교육 선도학교 운영' },
]

// 상징
const SYMBOLS = [
  {
    title: '교훈',
    value: '배움을 실천하고 선을 행하여 더불어 행복한 사람이 되자',
    sub: '앎과 삶이 하나 되는 교육',
  },
  { title: '교화 (校花)', value: '철쭉', sub: '강인한 생명력과 열정을 상징' },
  { title: '교목 (校木)', value: '소나무', sub: '변함없는 기상과 곧은 절개를 상징' },
  { title: '상징색', value: '천상 블루', sub: '드넓은 하늘처럼 무한한 가능성' },
]

export default function SchoolPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page hero */}
        <section className="bg-brand text-brand-foreground">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <nav
              className="flex items-center gap-1.5 text-xs text-white/70"
              aria-label="breadcrumb"
            >
              <Link href="/" className="flex items-center gap-1 hover:text-white">
                <Home className="h-3.5 w-3.5" /> 홈
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white">{menu.label}</span>
            </nav>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{menu.label}</h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm text-white/80 md:text-base">
              울산 울주 범서에 자리한 천상고등학교의 교육철학과 걸어온 길을 소개합니다.
            </p>
          </div>
        </section>

        {/* Sub-menu tabs */}
        <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <ul className="flex flex-wrap gap-1 py-3">
              {menu.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="block rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:px-6 md:py-16">
          {/* 학교장 인사말 */}
          <section id="greeting" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-brand">
                <Quote className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">학교장 인사말</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-brand p-8 text-brand-foreground md:col-span-1">
                <GraduationCap className="h-10 w-10 text-white/80" aria-hidden="true" />
                <p className="mt-6 text-lg font-semibold leading-relaxed text-balance">
                  꿈을 키우고 미래를 여는 행복한 배움터, 천상고등학교입니다.
                </p>
                <p className="mt-6 text-sm text-white/70">천상고등학교장</p>
              </div>
              <div className="rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border md:col-span-2">
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    안녕하십니까. 천상고등학교 홈페이지를 찾아주신 학생, 학부모님과 지역사회
                    여러분을 진심으로 환영합니다.
                  </p>
                  <p>
                    우리 학교는 <strong className="text-foreground">&lsquo;배움을 실천하고
                    선을 행하여 더불어 행복한 사람&rsquo;</strong>이라는 교훈 아래, 모든 학생이
                    저마다의 꿈과 재능을 마음껏 펼칠 수 있도록 지원하는 학생 중심의 교육을
                    실천하고 있습니다.
                  </p>
                  <p>
                    급변하는 미래 사회에 능동적으로 대응할 수 있도록 기초·기본 학력을 튼튼히
                    하고, 창의융합 교육과 진로 맞춤형 교육과정을 통해 학생 한 명 한 명이 소중한
                    미래 인재로 성장하도록 최선을 다하겠습니다.
                  </p>
                  <p>
                    학생과 교직원, 학부모가 서로 존중하고 신뢰하는 따뜻한 학교, 배움의 기쁨이
                    넘치는 행복한 학교를 만들어 가겠습니다. 여러분의 변함없는 관심과 성원을
                    부탁드립니다. 감사합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 교육목표 */}
          <section id="goal" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-brand">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">교육목표</h2>
            </div>
            <div className="mb-6 rounded-2xl border border-dashed border-brand/40 bg-secondary/50 p-6 text-center md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">교훈</p>
              <p className="mt-2 text-lg font-bold text-foreground text-balance md:text-xl">
                배움을 실천하고 선을 행하여 더불어 행복한 사람이 되자
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {GOALS.map((g) => {
                const Icon = g.icon
                return (
                  <div
                    key={g.title}
                    className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 학교 연혁 */}
          <section id="history" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-brand">
                <History className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">학교 연혁</h2>
            </div>
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border md:p-8">
              <ol className="relative space-y-6 border-l-2 border-border pl-6">
                {HISTORY.map((h) => (
                  <li key={h.date + h.text} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-brand bg-card" />
                    <p className="text-sm font-bold text-brand">{h.date}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 상징 · 교가 */}
          <section id="symbol" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-brand">
                <Flower2 className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">상징 · 교가</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {SYMBOLS.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    {s.title}
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground text-balance">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-brand p-6 text-brand-foreground md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">교가</p>
              <p className="mt-3 text-sm leading-loose text-white/90 text-pretty">
                문수산 정기 받아 우뚝 선 배움터 / 태화강 맑은 물결 꿈을 싣고 흐르네
                <br />
                슬기와 사랑으로 미래를 여는 우리 / 빛나거라 영원하라 천상고등학교
              </p>
            </div>
          </section>

          {/* 오시는 길 */}
          <section id="location" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">오시는 길</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border md:p-8">
                <dl className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div>
                      <dt className="text-sm font-semibold text-foreground">주소</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        울산광역시 울주군 범서읍 당앞로 96
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div>
                      <dt className="text-sm font-semibold text-foreground">대표전화</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">052-998-8600</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Printer className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div>
                      <dt className="text-sm font-semibold text-foreground">팩스</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">052-998-8601</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bus className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div>
                      <dt className="text-sm font-semibold text-foreground">교통 안내</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        범서읍 방면 시내버스 이용 후 천상고등학교 정류장 하차. 자가용 이용 시
                        교내 방문자 주차장을 이용해 주세요.
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
              <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl bg-secondary/70 p-8 text-center ring-1 ring-border">
                <MapPin className="h-10 w-10 text-brand" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-foreground">천상고등학교</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  울산광역시 울주군 범서읍 당앞로 96
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}