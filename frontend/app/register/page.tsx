import type { Metadata } from "next";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {RegisterForm} from "@/components/register-form";

//회원가입 메뉴 소개글
export const metadata: Metadata = {
  title: "회원가입 | 천상고등학교",
  description: "천상고등학교 회원가입 페이지입니다.",
};

export default function RegisterPage() {
    return (
        <div classsName="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex flex-1 items-center justify-center bg-secondary/50 px-4 py-12 md:py-20">
                <RegisterForm />
            </main>
            <SiteFooter />
        </div>
    )
}