import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const require = createRequire(import.meta.url)
const root = path.dirname(fileURLToPath(import.meta.url))
const { readLibrary, MUSIC_ROOT } = require('./scripts/read-library')
const { writeLibrary } = require('./scripts/write-library')

const MIME = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

function requestPath(req) {
  const raw = (req.url || '').split('?')[0]
  try {
    return decodeURIComponent(raw)
  } catch (error) {
    return raw
  }
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function serveMusic(url, req, res) {
  const rel = url.slice('/music'.length).replace(/^\/+/, '')
  if (!rel || rel.includes('\0') || rel.split('/').includes('..')) {
    res.statusCode = 404
    res.end()
    return
  }

  const rootDir = path.resolve(MUSIC_ROOT)
  const file = path.resolve(rootDir, rel)
  if (file !== rootDir && !file.startsWith(rootDir + path.sep)) {
    res.statusCode = 403
    res.end()
    return
  }

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      res.statusCode = 404
      res.end()
      return
    }

    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Content-Type', type)

    const range = req.headers.range
    let start = 0
    let end = stat.size - 1
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range)
      const rangeStart = match && match[1] ? Number(match[1]) : 0
      const rangeEnd = match && match[2] ? Number(match[2]) : stat.size - 1
      if (!match || rangeStart > rangeEnd || rangeStart >= stat.size) {
        res.statusCode = 416
        res.setHeader('Content-Range', `bytes */${stat.size}`)
        res.end()
        return
      }
      start = rangeStart
      end = Math.min(rangeEnd, stat.size - 1)
      res.statusCode = 206
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`)
      res.setHeader('Content-Length', end - start + 1)
    } else {
      res.statusCode = 200
      res.setHeader('Content-Length', stat.size)
    }

    if (req.method === 'HEAD') {
      res.end()
      return
    }

    const stream = fs.createReadStream(file, { start, end })
    stream.on('error', () => {
      if (!res.headersSent) res.statusCode = 500
      res.end()
    })
    stream.pipe(res)
  })
}

function libraryMiddleware(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next()
    return
  }

  const url = requestPath(req)
  if (url === '/api/library') {
    if (req.method === 'HEAD') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end()
      return
    }
    try {
      sendJson(res, 200, readLibrary())
    } catch (error) {
      sendJson(res, 500, { error: error.message })
    }
    return
  }

  if (url === '/music' || url.startsWith('/music/')) {
    serveMusic(url, req, res)
    return
  }

  next()
}

function libraryServer() {
  let outDir = path.join(root, 'dist')
  return {
    name: 'library-server',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use(libraryMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(libraryMiddleware)
    },
    closeBundle() {
      if (process.env.VITEST) return
      writeLibrary(path.join(outDir, 'library.json'))
    }
  }
}

export default defineConfig({
  plugins: [
    babel({
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      parserOpts: {
        sourceType: 'module',
        plugins: ['jsx']
      },
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }),
    react({
      jsxRuntime: 'classic',
      include: /\.[jt]sx$/
    }),
    libraryServer()
  ],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
    allowedHosts: ['.onrender.com']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/vitest.setup.js'],
    include: ['src/**/*.test.js'],
    testTimeout: 30000,
    hookTimeout: 30000
  }
})
