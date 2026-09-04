import {PageShell} from "@/components/page-shell";
import { ExternalBoard } from "@/components/external-board";
import {NAV_MENU} from "@/lib/menu";

const menu = NAV_MENU.find((m) => m.href == '/admin')!

//행정 메뉴 소개글
export default function AdminPage() {
    return (
        <PageShell
            menu={menu}
            description="정보 공개, 행정 서식, 시설 현황, 채용 정보 등 학교 행정 업무를 안내합니다."
            sections={{
                info: <ExternalBoard sectionKey="info" />,
                forms: <ExternalBoard sectionKey="forms" />,
                facility: <ExternalBoard sectionKey="facility" />,
                recruit: <ExternalBoard sectionKey="recruit" />,
            }}
        />
    )
}
