import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

/**
 * Serves the `api/` functions during `npm run dev`.
 *
 * Vercel runs those files itself in production; the dev server does not, so
 * without this the blog editor would only be able to translate after a deploy.
 * A missing dependency or key answers 503, which the editor reports as "not
 * connected" rather than as a crash.
 */
function devApi(): Plugin {
  return {
    name: 'epm-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/translate', (req, res, next) => {
        server
          .ssrLoadModule('/api/translate.ts')
          .then((mod) => (mod.default as (q: unknown, s: unknown) => Promise<void>)(req, res))
          .catch((error: unknown) => {
            if (error instanceof Error && /Failed to (load|resolve)/i.test(error.message)) {
              res.statusCode = 503
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'not_configured', message: error.message }))
              return
            }
            next(error)
          })
      })
    },
  }
}

/**
 * Preloads the two font files the first screen actually needs.
 *
 * Without this the browser only discovers them after it has downloaded and
 * parsed the stylesheet, which on a slow phone is a visible second of
 * fallback type. The filenames are hashed at build time, so they are read
 * out of the bundle rather than hardcoded.
 */
function preloadFonts(): Plugin {
  const CRITICAL = /(fraunces-subset|space-grotesk-latin-wght-normal)-[^.]+\.woff2$/
  return {
    name: 'epm-preload-fonts',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(_html, ctx) {
      return Object.keys(ctx.bundle ?? {})
        .filter((file) => CRITICAL.test(file))
        .map((file) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${file}`,
            crossorigin: '',
          },
          injectTo: 'head-prepend' as const,
        }))
    },
  }
}

/**
 * Makes `npm run preview` resolve prerendered pages the way a static host does.
 *
 * Vite's preview server only serves `dist/en/services/index.html` for a URL
 * with a trailing slash; without one it falls through to the SPA fallback and
 * hands back the homepage. Vercel resolves the directory index either way, so
 * without this the local preview would show a hydration mismatch that does not
 * exist in production, and hide real ones.
 */
function previewCleanUrls(): Plugin {
  return {
    name: 'epm-preview-clean-urls',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? '/'
        const [pathname, query = ''] = url.split('?')
        if (pathname !== '/' && !pathname.endsWith('/') && !path.extname(pathname)) {
          const candidate = path.join(__dirname, 'dist', pathname, 'index.html')
          if (fs.existsSync(candidate)) {
            req.url = `${pathname}/${query ? `?${query}` : ''}`
          }
        }
        next()
      })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), devApi(), preloadFonts(), previewCleanUrls()],
  server: {
    // The preview harness picks a free port and hands it over as PORT; Vite
    // reads no such variable on its own, so without this it would bind its
    // own default and the preview would point at nothing. 5180 stays the
    // default for a plain `npm run dev`, which is the URL docs/ADMIN.md gives.
    port: Number(process.env.PORT) || 5180,
    strictPort: Boolean(process.env.PORT),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: isSsrBuild
        ? // The prerender bundle runs in Node and is never shipped, so it keeps
          // React external and needs no chunking.
          {}
        : {
            // Keep framework code in a stable, separately-cached chunk so an
            // app edit doesn't re-hash React and the router for returning users.
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            },
          },
    },
  },
}))
