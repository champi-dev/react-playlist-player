const path = require('path')
const rules = require('./webpack.rules')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build_component'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
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
