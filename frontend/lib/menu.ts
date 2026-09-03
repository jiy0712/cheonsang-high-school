export type SubMenuItem = {
  label: string
  href: string
}

export type MenuItem = {
  label: string
  href: string
  children: SubMenuItem[]
}

export const NAV_MENU: MenuItem[] = [
  {
    label: '학교소개',
    href: '/school',
    children: [
      { label: '학교장 인사말', href: '/school#greeting' },
      { label: '교육목표', href: '/school#goal' },
      { label: '학교 연혁', href: '/school#history' },
      { label: '상징 · 교가', href: '/school#symbol' },
      { label: '오시는 길', href: '/school#location' },
    ],
  },
  {
    label: '학교소식',
    href: '/news',
    children: [
      { label: '공지사항', href: '/news#notice' },
      { label: '가정통신문', href: '/news#letter' },
      { label: '학교앨범', href: '/news#album' },
      { label: '보도자료', href: '/news#press' },
    ],
  },
  {
    label: '학생마당',
    href: '/students',
    children: [
      { label: '학사일정', href: '/students#schedule' },
      { label: '급식 식단', href: '/students#meal' },
      { label: '방과후학교', href: '/students#afterschool' },
      { label: '동아리 활동', href: '/students#club' },
    ],
  },
  {
    label: '교육활동',
    href: '/activities',
    children: [
      { label: '교육과정', href: '/activities#curriculum' },
      { label: '진로 · 진학', href: '/activities#career' },
      { label: 'STEAM 선도학교', href: '/activities#steam' },
      { label: '창의적 체험활동', href: '/activities#creative' },
    ],
  },
  {
    label: '학교생활',
    href: '/life',
    children: [
      { label: '학교 규칙', href: '/life#rules' },
      { label: '학생 자치', href: '/life#student-council' },
      { label: '상담실', href: '/life#counseling' },
      { label: '보건실', href: '/life#health' },
    ],
  },
  {
    label: '행정',
    href: '/admin',
    children: [
      { label: '정보 공개', href: '/admin#info' },
      { label: '행정 서식', href: '/admin#forms' },
      { label: '시설 현황', href: '/admin#facility' },
      { label: '채용 정보', href: '/admin#recruit' },
    ],
  },
]
//홈 메뉴