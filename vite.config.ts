/// <reference types="vitest/config" />
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import prerender from '@prerenderer/rollup-plugin'

const SITE_URL = 'https://mogiyoon.com'

// 프로젝트 상세 페이지는 카드 onClick 으로만 진입했기 때문에 프리렌더 대상에서 빠져 있었다.
// 공유 미리보기(카카오·링크드인 봇은 JS 를 실행하지 않음)와 검색 노출을 위해
// projects-list.json 을 읽어 /project/{id} 경로를 모두 프리렌더 목록에 넣는다.
const readProjectRoutes = (): string[] => {
  const raw = readFileSync(resolve(__dirname, 'public/data/projects-list.json'), 'utf-8')
  const list = JSON.parse(raw) as Array<{ id: string }>
  return list.map((project) => `/project/${project.id}`)
}

const STATIC_ROUTES = ['/', '/resume-preview']

// @prerenderer/rollup-plugin 은 generateBundle 단계에서 "rollup 번들 안에 있는 파일"만 서빙하고
// 나머지는 index.html 로 fallback 한다. public/ 의 locales·data JSON 은 Vite 가 번들 밖에서 복사하므로
// 프리렌더 중 fetch 가 전부 index.html 을 받아 번역·프로젝트 데이터가 빈 채로 스냅샷됐다.
// 프리렌더 플러그인보다 먼저(order: 'pre') 해당 JSON 들을 번들 asset 으로 넣어 서빙되게 한다.
// (같은 경로로 public 복사본이 덮어써도 내용이 동일하므로 결과물은 변하지 않는다)
const PRERENDER_PUBLIC_DIRS = ['locales', 'data']

const listFilesRecursive = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? listFilesRecursive(full) : [full]
  })

const exposePublicJsonToPrerender = (): Plugin => ({
  name: 'mogiyoon-expose-public-json-to-prerender',
  apply: 'build',
  generateBundle: {
    order: 'pre',
    handler() {
      const publicRoot = resolve(__dirname, 'public')
      for (const dir of PRERENDER_PUBLIC_DIRS) {
        for (const file of listFilesRecursive(join(publicRoot, dir))) {
          if (!file.endsWith('.json')) continue
          this.emitFile({
            type: 'asset',
            fileName: relative(publicRoot, file).split('\\').join('/'),
            source: readFileSync(file),
          })
        }
      }
    },
  },
})

// 상세 페이지로 가는 링크가 JS 내비게이션뿐이라 "내부 링크로 모두 닿는 사이트" 조건을 만족하지 못하므로
// sitemap.xml 을 빌드 시 dist 에 함께 쓴다. (robots.txt 의 Sitemap: 지시어가 이 파일을 가리킨다)
const sitemapPlugin = (routes: string[]): Plugin => ({
  name: 'mogiyoon-sitemap',
  apply: 'build',
  closeBundle() {
    const lastmod = new Date().toISOString().slice(0, 10)
    const urls = routes
      .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
      .join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), xml)
  },
})

export default defineConfig(({ command }) => {
  const routes = command === 'build' ? [...STATIC_ROUTES, ...readProjectRoutes()] : STATIC_ROUTES

  return {
    plugins: [
      react(),
      command === 'build' && exposePublicJsonToPrerender(),
      command === 'build' && prerender({
        routes,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterDocumentEvent: 'render-event',
          renderAfterTime: 15000,
          // 2 로 두면 puppeteer 가 간헐적으로 "Promise was collected" 로 죽는다 (탭 동시 종료 race).
          // 라우트당 1~2초라 직렬화해도 빌드 시간 영향은 몇 초 수준.
          maxConcurrentRoutes: 1,
        },
      }),
      command === 'build' && sitemapPlugin(routes),
    ].filter(Boolean),
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
    },
  }
})
