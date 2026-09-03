import {PageShell} from "@/components/page-shell";
import {MealMenu} from "@/components/meal-menu";
import {ScheduleList} from "@/components/schedule-list";
import {NAV_MENU} from "@/lib/menu";

//학생마당 메뉴 소개글
const menu = NAV_MENU.find((m) => m.href === "/students");

export default function StudentsPage() {
    return (
        <PageShell
            menu={menu}
            descriptiono="학사일정, 급식 식단, 방과후학교, 동아리 등 학생 생활에 필요한 정보를 모았습니다."
            sections={{ schedule: <ScheduleList />, meal: <MealMenu /> }}
    />
    )
}