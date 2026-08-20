/// <reference types="vitest/config" />
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

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

// 프리렌더는 @prerenderer/rollup-plugin 대신 빌드 완료 후(closeBundle) 직접 실행한다. 이유:
// 1) rollup-plugin 은 "번들 안의 파일"만 서빙하고 나머지는 index.html 로 fallback 하므로,
//    public/ 의 locales·data JSON 이 빈 채로 스냅샷되는 문제가 있었다. dist 를 통째로
//    정적 서빙하면 해결된다 (별도 JSON 번들 주입 핵 불필요).
// 2) puppeteer 의 page.evaluate 가 pending promise 를 기다리는 동안 V8 GC 가 promise 를
//    수집하면 "Protocol error (Runtime.callFunctionOn): Promise was collected" 로 간헐
//    실패한다. 계측 결과 페이지 crash/reload 는 없었고(두 번째 framenavigated 는 react-router
//    초기화의 same-document replaceState), renderAfterTime 제거·GIF 차단으로도 재현되어
//    CDP 수준 flake 로 판단 — 실패 시 전체 라우트를 최대 3회 재시도한다 (1회 ~6초).
const prerenderPlugin = (routes: string[]): Plugin => ({
  name: 'mogiyoon-prerender',
  apply: 'build',
  enforce: 'post',
  closeBundle: {
    sequential: true,
    order: 'post',
    async handler() {
      const distDir = resolve(__dirname, 'dist')
      const { default: Prerenderer } = await import('@prerenderer/prerenderer')
      const { default: PuppeteerRenderer } = await import('@prerenderer/renderer-puppeteer')

      const MAX_ATTEMPTS = 3
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const prerenderer = new Prerenderer({
          staticDir: distDir,
          renderer: new PuppeteerRenderer({
            renderAfterDocumentEvent: 'render-event',
            timeout: 20000,
            maxConcurrentRoutes: 1,
            // 데모 GIF(6~36MB, 총 ~180MB)는 프리렌더 HTML 에 영향이 없으므로 차단 (속도·메모리).
            // renderer 가 이미 setRequestInterception(true) + continue-all 리스너를 걸어두므로
            // 리스너를 교체하는 방식으로만 안전하게 개입할 수 있다.
            pageSetup: async (page) => {
              page.removeAllListeners('request')
              page.on('request', (req) => {
                if (/\.gif(\?|$)/i.test(req.url())) return void req.abort()
                return void req.continue()
              })
            },
          }),
        })
        try {
          await prerenderer.initialize()
          const rendered = await prerenderer.renderRoutes([...routes])
          for (const route of rendered) {
            const out = join(distDir, route.originalRoute.replace(/^\//, ''), 'index.html')
            mkdirSync(dirname(out), { recursive: true })
            writeFileSync(out, route.html.trim() + '\n')
          }
          console.log(`[prerender] ${rendered.length} routes prerendered (attempt ${attempt})`)
          return
        } catch (error) {
          console.warn(`[prerender] attempt ${attempt}/${MAX_ATTEMPTS} failed:`, (error as Error).message)
          if (attempt === MAX_ATTEMPTS) throw error
        } finally {
          await prerenderer.destroy()
        }
      }
    },
  },
})

export default defineConfig(({ command }) => {
  const routes = command === 'build' ? [...STATIC_ROUTES, ...readProjectRoutes()] : STATIC_ROUTES

  return {
    plugins: [
      react(),
      command === 'build' && sitemapPlugin(routes),
      command === 'build' && prerenderPlugin(routes),
    ].filter(Boolean),
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
    },
  }
})
