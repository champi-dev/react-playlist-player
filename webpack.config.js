const path = require('path')
const rules = require('./webpack.rules')

const HtmlWebPackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebPackPlugin({
  template: './demoApp/src/index.html',
  filename: './index.html'
})

module.exports = {
  entry: './demoApp/src/index.js',
  output: {
    path: path.resolve(__dirname, 'build_demo'),
    filename: 'index.js'
  },
  module: {
    rules: rules
  },
  plugins: [htmlPlugin]
}
