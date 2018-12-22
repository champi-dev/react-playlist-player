module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jestConfig/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/jestConfig/fileTransform.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  setupTestFrameworkScriptFile: '<rootDir>setupEnzyme.js',
  coverageDirectory: '<rootDir>/tests/coverage'
}
