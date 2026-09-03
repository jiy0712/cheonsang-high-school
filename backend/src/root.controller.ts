import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  @Header('content-type', 'text/html; charset=utf-8')
  index(): string {
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>천상고 API 서버</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
    background:#0f2a4a; color:#f4f7fb; display:flex; min-height:100vh; align-items:center; justify-content:center; }
  .card { max-width:520px; padding:40px; text-align:center; }
  h1 { font-size:22px; margin:0 0 12px; }
  p { line-height:1.6; margin:8px 0; color:#c7d6ea; font-size:15px; }
  code { background:rgba(255,255,255,.12); padding:2px 8px; border-radius:6px; }
  a.btn { display:inline-block; margin-top:20px; background:#f4f7fb; color:#0f2a4a; text-decoration:none;
    padding:12px 22px; border-radius:10px; font-weight:600; }
  .muted { font-size:13px; color:#8fa6c4; margin-top:24px; }
</style>
</head>
<body>
  <div class="card">
    <h1>천상고등학교 API 서버가 실행 중입니다</h1>
    <p>여기는 <strong>백엔드 API 서버</strong>(포트 3001)입니다. 실제 웹사이트 화면이 아닙니다.</p>
    <p>학교 홈페이지 화면은 프론트엔드 서버 <code>http://localhost:3000</code> 에서 열립니다.</p>
    <a class="btn" href="http://localhost:3000">웹사이트 화면 열기 (3000)</a>
    <p class="muted">API 상태 확인: <code>/api/health</code></p>
  </div>
</body>
</html>`;
  }
}
