/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import prerender from '@prerenderer/rollup-plugin'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'build' && prerender({
      routes: ['/', '/resume-preview'],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 15000,
        maxConcurrentRoutes: 2,
      },
    }),
  ].filter(Boolean),
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
}))
