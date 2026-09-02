import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {SearchResults} from "@/components/search-results";

//통합검색 메뉴 소개글
export const metadata: Metadata = {
    title: "통합검색 | 천상고등학교",
    description: "천상고등학교 게시글 통합검색 페이지입니다.",
}

export default function SearchPage() {
    return(
        <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1 bg-secondary/30">
                <Suspense fallback={<div className="min-h-[400px]" />}>
                    <SearchResults />
                </Suspense>
            </main>
            <SiteFooter />
        </div>
    )
}