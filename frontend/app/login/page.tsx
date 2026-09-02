import type { Metadata } from 'next';
import {Suspense} from 'react';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {LoginForm} from '@/components/login-form';

//로그인 메뉴 소개글
export const metadata: Metadata = {
    title: '로그인 | 천상고등학교',
    description: '천상고등학교 로그인 페이지입니다.',
};

export default function LoginPage() {
    return (
        <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex flex-1 items-center justify-center bg-secondary/50 px-4 px-12 md:py-20">
                <Suspense fallback={<div className="w-full max-w-md" />}>
                    <LoginForm />
                </Suspense>
            </main>
            <SiteFooter />
        </div>
    );
}