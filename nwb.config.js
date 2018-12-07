module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactPlaylistPlayer',
      externals: {
        react: 'React'
      }
    }
  }
}
