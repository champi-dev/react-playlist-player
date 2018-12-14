const path = require('path')

module.exports = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['react']
        }
      }
    ]
  },
  {
    test: [/\.sass$/, /\.scss$/],
    use: ['style-loader', 'css-loader', 'sass-loader']
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.svg$/,
    loader: 'svg-inline-loader'
  }
]
