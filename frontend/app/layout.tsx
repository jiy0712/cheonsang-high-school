import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "천상고등학교 | 새로운 생각, 배움이 즐거운 학교",
  description:
    "울산 울주 범서, 학생 한 사람의 성장을 중심에 두는 천상고등학교 공식 홈페이지입니다. 공지사항, 급식, 학사일정, 학교소식을 확인하세요.",
};

export const viewport: Viewport = {
  themeColor: "#123a63",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}