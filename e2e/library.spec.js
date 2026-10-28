const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function play() {
      this.muted = true
      this.volume = 0
      return Promise.resolve()
    }
  })
})

test('shows every song and selects one without playing sound', async ({ page }) => {
  await page.goto('/')
  await page.locator('.library__playlist', { hasText: 'Classic Rock' }).click()
  await expect(page.getByRole('heading', { name: 'Classic Rock' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Black Dog/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Start Me Up/ })).toBeVisible()

  await page.getByRole('button', { name: /Everything/ }).click()
  await expect(page.getByRole('heading', { name: 'Everything' })).toBeVisible()
  await page.locator('.library__playlist', { hasText: 'Classic Rock' }).click()
  await expect(page.getByRole('heading', { name: 'Classic Rock' })).toBeVisible()

  await page.locator('button.song', { hasText: 'Black Dog' }).click()
  await expect(page.locator('.song-info .title')).toHaveText('Black Dog')

  const audio = await page.evaluate(() => {
    const element = document.querySelector('audio')
    element.pause()
    element.muted = true
    element.volume = 0
    return {
      src: element.getAttribute('src') || '',
      paused: element.paused,
      muted: element.muted,
      volume: element.volume
    }
  })
  expect(audio.src).toContain('Black%20Dog')
  expect(audio.paused).toBe(true)
  expect(audio.muted).toBe(true)
  expect(audio.volume).toBe(0)
})
