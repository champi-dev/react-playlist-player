const path = require('path')
const rules = require('./webpack.rules')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build_component'),
    filename: 'index.js',
    library: 'react-playlist-player',
    libraryTarget: 'umd'
  },
  module: {
    rules: rules
  },
  externals: {
    react: 'commonjs react',
    mobx: 'mobx',
    'mobx-react': 'mobx-react'
  }
}
