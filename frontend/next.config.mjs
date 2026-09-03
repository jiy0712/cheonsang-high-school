/** @type {import('next').NextConfig} */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

const nextConfig = {
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
{
key: "X-Content-Type-Options",
value: "nosniff",
},
{
key: "Referrer-Policy",
value: "strict-origin-when-cross-origin",
},
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
