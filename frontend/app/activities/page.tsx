import { ProtectedPage } from '@/components/protected-page'
import { ExternalBoard } from '@/components/external-board'
import { NAV_MENU } from '@/lib/menu'

//교육활동 메뉴 소개글
const menu = NAV_MENU.find((m) => m.href == '/activities')!

export default function ActivitiesPage() {
    return (
        <ProtectedPage
            menu={menu}
            description="고교학점제 기반 교육과정과 진로·진학, STEAM, 창의적 체험활동을 안내합니다."
            sections={{
                curriculum: <ExternalBoard sectionKey="curriculum" />,
                career: <ExternalBoard sectionKey="career" />,
                steam: <ExternalBoard sectionKey="steam" />,
                creative: <ExternalBoard sectionKey="creative" />,
            }}
        />
    )
}
