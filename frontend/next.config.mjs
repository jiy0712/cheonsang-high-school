/** @type {import('next').NextConfig} */

// 브라우저는 항상 같은 오리진의 /api 로 호출하고, Next.js 가 이를 NestJS 백엔드로 프록시합니다.
// (미리보기 iframe / 로컬 / 배포 환경 모두 동일하게 동작)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
