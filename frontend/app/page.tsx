import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HeroSection } from '@/components/hero-section'
import { NewsSection } from '@/components/news-section'
import { BoardSection } from '@/components/board-section'
import { ScheduleSection } from '@/components/schedule-section'
import { ActivitiesSection } from '@/components/activities-section'
import { ShortcutsSection } from '@/components/shortcuts-section'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <NewsSection />
        <BoardSection />
        <ScheduleSection />
        <ActivitiesSection />
        <ShortcutsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
