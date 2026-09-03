export const MEAL = {
  date: '8월 30일 (일) 중식',
  kcal: '842 kcal',
  allergy: '알레르기 정보 · 5, 6, 10, 13, 16',
  items: ['찰보리밥', '쇠고기미역국', '제육볶음', '감자채볶음', '배추김치', '요구르트'],
}

export const TODAY_SCHEDULE = [
  { time: '09:00', title: '2학기 학력평가 대비 자율학습', place: '각 교실' },
  { time: '13:30', title: '3학년 진로진학 상담주간', place: '진로상담실' },
  { time: '16:40', title: '방과후학교 심화수학 A반', place: '본관 3층' },
]

export const UPCOMING_NOTE = '다가오는 일정 · 09.03 전국연합학력평가'

export type NoticeItem = {
  tag?: '중요' | '공지' | '행정'
  title: string
  date: string
}

export const NOTICES: NoticeItem[] = [
  { tag: '중요', title: '2026학년도 2학기 학사일정 변경 안내', date: '08.28' },
  { tag: '공지', title: '9월 전국연합학력평가 시행 안내', date: '08.27' },
  { tag: '공지', title: '방과후학교 2기 수강 신청 접수', date: '08.25' },
  { tag: '행정', title: '교내 무선망 점검에 따른 일시 중단 안내', date: '08.22' },
]

export const LETTERS: NoticeItem[] = [
  { title: '2학기 학교급식 운영 안내 가정통신문', date: '08.28' },
  { title: '가을 현장체험학습 참가 동의서 제출 안내', date: '08.26' },
  { title: '학생 건강검진 실시 안내', date: '08.21' },
  { title: '고교학점제 수강신청 학부모 설명회', date: '08.18' },
]

export type NewsItem = {
  category: string
  title: string
  date: string
  image: string
}

export const NEWS: NewsItem[] = [
  {
    category: '학생활동',
    title: '융합과학 탐구 프로젝트 발표회',
    date: '2026.08.27',
    image: '/images/news-science.png',
  },
  {
    category: '학교행사',
    title: '2학기 개학식 및 학년별 학급 활동',
    date: '2026.08.17',
    image: '/images/news-ceremony.png',
  },
  {
    category: '학교앨범',
    title: '도서관 독서 마라톤 시즌 시작',
    date: '2026.08.12',
    image: '/images/news-library.png',
  },
  {
    category: '동아리',
    title: '천상 어울림 음악 동아리 정기 연주',
    date: '2026.08.05',
    image: '/images/news-music.png',
  },
]

export const UPCOMING_SCHEDULE = [
  { date: '09.03', title: '전국연합학력평가' },
  { date: '09.10', title: '동아리 발표회' },
  { date: '09.24', title: '체육대회' },
  { date: '09.28', title: '추석 연휴' },
]

export type CalendarEvent = {
  day: number
  label: string
  type: 'event' | 'student' | 'parent'
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { day: 17, label: '2학기 개학', type: 'event' },
  { day: 21, label: '학생 건강검진', type: 'student' },
  { day: 26, label: '학부모 상담주간', type: 'parent' },
  { day: 30, label: '진로진학 상담주간', type: 'event' },
]

export type Activity = {
  title: string
  description: string
  href: string
}

export const ACTIVITIES: Activity[] = [
  {
    title: '교육과정',
    description: '고교학점제 기반의 선택 중심 교육과정으로 진로에 맞춘 과목을 설계합니다.',
    href: '/activities#curriculum',
  },
  {
    title: '진로 · 진학',
    description: '학년별 진로 로드맵과 1:1 상담으로 진학을 준비합니다.',
    href: '/activities#career',
  },
  {
    title: '동아리 활동',
    description: '학술 · 예술 · 체육 40여 개 동아리가 운영됩니다.',
    href: '/students#club',
  },
  {
    title: '방과후학교',
    description: '교과 심화와 실기 강좌를 학기별로 개설합니다.',
    href: '/students#afterschool',
  },
  {
    title: 'STEAM 선도학교',
    description: '융합 탐구와 프로젝트 수업으로 문제 해결력을 기릅니다.',
    href: '/activities#steam',
  },
  {
    title: '학생 자치',
    description: '학생회 중심의 자치 활동으로 학교 문화를 함께 만듭니다.',
    href: '/life#student-council',
  },
]

export type Shortcut = {
  title: string
  description: string
  href: string
}

export const SHORTCUTS: Shortcut[] = [
  { title: '학교알리미', description: '학교 정보 공시', href: '/admin#info' },
  { title: '방과후 온라인 신청', description: '수강 신청 · 확인', href: '/students#afterschool' },
  { title: '학교도서관 자료검색', description: '도서 대출 조회', href: '/students#club' },
  { title: '울산진로진학지원센터', description: '진학 상담 · 자료', href: '/activities#career' },
  { title: '울산고교학점제지원센터', description: '과목 선택 안내', href: '/activities#curriculum' },
  { title: '학교정보공개', description: '행정 정보 공개', href: '/admin#info' },
]

export const EXTRA_LINKS = ['DBpia 논문검색', '울산수업모아', '학교발전기금 온라인 기부']
//없어도 될 것 같은게 있는데 없이 한번 테스트 해보기