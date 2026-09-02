import type { Metadata } from 'next';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {AdminDashboard} from '@/components/admin-dashboard';

//관리자 대시보드 페이지 (사용안함)
export const metadata: Metadata = {
    title: '관리자 대시보드 | 천상고등학교',
    description: '게시글, 급식, 학사일정, 사용자 관리',
}

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
            <main className="flex-1">
                <AdminDashboard />
            </main>
          <SiteFooter />
        </div>  
    )
}
