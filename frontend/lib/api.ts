// 천상고 백엔드 API 클라이언트.
// 브라우저는 항상 같은 오리진의 /api 로 호출하고, next.config 의 rewrite 가
// NestJS 백엔드(:3001)로 프록시합니다.

export const API_BASE = "/api"

const TOKEN_KEY = "cheonsang_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json")
  }
  const token = getToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = `요청이 실패했습니다. (${res.status})`
    try {
      const data = await res.json()
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.join("\n") : data.message
      }
    } catch {
      // JSON 이 아니면 기본 메시지를 사용합니다.
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// 공용 GET fetcher (SWR 용)
export const fetcher = <T>(path: string) => request<T>(path)

// ---------------- 타입 ----------------

export type UserRole = "admin" | "user"

export interface AuthUser {
  id: number
  email: string
  name: string
  role: UserRole
}

export type PostCategory = "notice" | "letter" | "news"

export interface Post {
  id: number
  category: PostCategory
  title: string
  content: string
  author: string | null
  tag: string | null
  image: string | null
  isImportant: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface AlbumItem {
  id: number
  title: string
  image: string
  link: string
  date: string
}

export type MealType = "lunch" | "dinner"

export interface Meal {
  id: number
  date: string
  type: MealType
  menu: string[]
  allergy: string | null
  kcal: string | null
}

export type ScheduleType = "event" | "student" | "parent"

export interface Schedule {
  id: number
  date: string
  time: string | null
  title: string
  place: string | null
  type: ScheduleType
  description: string | null
}

// ---------------- 인증 ----------------

export function login(email: string, password: string) {
  return request<{ accessToken: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function register(input: { email: string; password: string; name: string }) {
  return request<{ accessToken: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function fetchMe() {
  return request<{ user: AuthUser }>("/auth/me")
}

// ---------------- 게시판 ----------------

export function listPosts(category: PostCategory, limit = 10, page = 1) {
  return request<Paginated<Post>>(
    `/boards/posts?category=${category}&limit=${limit}&page=${page}`,
  )
}

export function getPost(id: number) {
  return request<Post>(`/boards/posts/${id}`)
}

/** 학교앨범(사진 게시판) 실시간 스크래핑 목록. */
export function getAlbum(limit = 12) {
  return request<AlbumItem[]>(`/boards/posts/album?limit=${limit}`)
}

/** 학교 홈페이지 임의 게시판(메뉴 코드)의 실시간 스크래핑 목록. */
export function getExternalBoard(code: string, limit = 15) {
  return request<Post[]>(
    `/boards/posts/external?code=${encodeURIComponent(code)}&limit=${limit}`,
  )
}

/** 통합검색: 제목·내용에 검색어가 포함된 게시글을 카테고리 구분 없이 조회합니다. */
export function searchPosts(q: string, limit = 30, page = 1) {
  return request<Paginated<Post>>(
    `/boards/posts?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`,
  )
}

const CATEGORY_LABELS: Record<PostCategory, string> = {
  notice: "공지사항",
  letter: "가정통신문",
  news: "학교소식",
}

/** 게시판 카테고리 코드를 한글 라벨로 변환합니다. */
export function categoryLabel(category: PostCategory): string {
  return CATEGORY_LABELS[category] ?? category
}

/** 카테고리별 상세/목록 페이지 앵커 링크를 반환합니다. */
export function categoryHref(category: PostCategory): string {
  if (category === "notice") return "/news#notice"
  if (category === "letter") return "/news#letter"
  return "/news#press"
}

export function createPost(input: Partial<Post>) {
  return request<Post>("/boards/posts", { method: "POST", body: JSON.stringify(input) })
}

export function updatePost(id: number, input: Partial<Post>) {
  return request<Post>(`/boards/posts/${id}`, { method: "PATCH", body: JSON.stringify(input) })
}

export function deletePost(id: number) {
  return request<void>(`/boards/posts/${id}`, { method: "DELETE" })
}

// ---------------- 급식 ----------------

export function getTodayMeal() {
  return request<Meal | null>("/meals/today")
}

export function getMealsByDate(date: string) {
  return request<Meal[]>(`/meals/${date}`)
}

// ---------------- 학사일정 ----------------

export function getSchedulesByDate(date: string) {
  return request<Schedule[]>(`/schedules?date=${date}`)
}

export function getUpcomingSchedules(limit = 4) {
  return request<Schedule[]>(`/schedules/upcoming?limit=${limit}`)
}

export function getSchedulesByMonth(year: number, month: number) {
  return request<Schedule[]>(`/schedules?year=${year}&month=${month}`)
}

// ---------------- 관리자: 사용자 ----------------

export function listUsers() {
  return request<AuthUser[]>("/users")
}

export function updateUserRole(id: number, role: UserRole) {
  return request<AuthUser>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
}

// ---------------- 표시용 헬퍼 ----------------

/** ISO 날짜(YYYY-MM-DD 또는 timestamp)를 "08.28" 형식으로 변환합니다. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${mm}.${dd}`
}

/** ISO 날짜를 "2026.08.27" 형식으로 변환합니다. */
export function formatDotDate(iso: string): string {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}.${mm}.${dd}`
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

/** 급식 날짜 라벨: "9월 1일 (화) 중식" */
export function formatMealLabel(iso: string, type: MealType): string {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekday = WEEKDAYS[d.getDay()]
  const meal = type === "lunch" ? "중식" : "석식"
  return `${month}월 ${day}일 (${weekday}) ${meal}`
}
