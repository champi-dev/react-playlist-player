const path = require('path')
const express = require('express')
const { readLibrary, MUSIC_ROOT } = require('./scripts/read-library')

function swapEntry(value, demo) {
  if (Array.isArray(value)) return value.map(item => swapEntry(item, demo))
  if (typeof value === 'string' && value.endsWith(`${path.sep}src${path.sep}index.js`)) return demo
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((next, key) => {
      next[key] = swapEntry(value[key], demo)
      return next
    }, {})
  }
  return value
}

function useDartSass(webpackConfig) {
  const sass = require('sass')
  const walk = rule => {
    if (!rule) return
    if (Array.isArray(rule)) {
      rule.forEach(walk)
      return
    }
    if (rule.oneOf) walk(rule.oneOf)
    if (rule.rules) walk(rule.rules)
    const use = Array.isArray(rule.use) ? rule.use : rule.use ? [rule.use] : []
    use.forEach(loader => {
      if (loader && typeof loader.loader === 'string' && loader.loader.includes('sass-loader')) {
        loader.options = { ...(loader.options || {}), implementation: sass }
      }
    })
  }
  walk(webpackConfig.module.rules)
  return webpackConfig
}

module.exports = {
  reactScriptsVersion: 'react-scripts',
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  webpack: {
    configure: webpackConfig => {
      const demo = path.resolve(__dirname, 'src/demo/index.js')
      webpackConfig.entry = swapEntry(webpackConfig.entry, demo)
      return useDartSass(webpackConfig)
    }
  },
  devServer: devServerConfig => {
    const previousBefore = devServerConfig.before
    devServerConfig.before = (app, server, compiler) => {
      if (typeof previousBefore === 'function') previousBefore(app, server, compiler)

      app.get('/api/library', (req, res) => {
        try {
          res.json(readLibrary())
        } catch (error) {
          res.status(500).json({ error: error.message })
        }
      })

      app.use('/music', (req, res, next) => {
        // Gzip would buffer the file. The media element needs the first frames immediately.
        delete req.headers['accept-encoding']
        next()
      }, express.static(MUSIC_ROOT, {
        acceptRanges: true,
        fallthrough: false,
        index: false,
        maxAge: '1d'
      }))
    }
    return devServerConfig
  }
}
