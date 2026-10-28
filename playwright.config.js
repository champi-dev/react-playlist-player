const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    channel: 'chrome',
    headless: true,
    launchOptions: {
      args: ['--mute-audio']
    }
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120000
  }
})
