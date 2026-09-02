import {PageShell} from "@/components/page-shell";
import {NAV_MENU} from "@/lib/menu";

//학교생활 메뉴 소개글
const menu = NAV_MENU.find((m) => m.href == '/life')!

export default function LifePage() {
    return (
        <PageShell
            menu={menu}
            description="학교 규칙, 학생 자치, 상담실, 보건실 등 학교생활 전반을 소개합니다."
        />
    )
}