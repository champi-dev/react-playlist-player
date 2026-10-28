import { absoluteMediaUrl, attachSource, ensureAudioElement, followingSongUrl, openWarmer, sameMedia, warmAfterStart } from './audioStream'

describe('audio streaming helpers', () => {
  test('starts one request and warms the following song', () => {
    document.body.innerHTML = ''
    const created = ensureAudioElement()
    expect(created.id).toBe('audio')
    expect(ensureAudioElement()).toBe(created)
    const audio = document.createElement('audio')
    expect(absoluteMediaUrl('')).toBe('')
    expect(absoluteMediaUrl('http://[')).toBe('http://[')
    expect(attachSource(null, '/music/a.mp3')).toBe(false)
    expect(attachSource(audio, '')).toBe(false)
    expect(attachSource(audio, '/music/a.mp3')).toBe(true)
    expect(attachSource(audio, '/music/a.mp3')).toBe(false)
    expect(sameMedia(audio, '/music/a.mp3')).toBe(true)
    expect(sameMedia(null, '/music/a.mp3')).toBe(false)
    const plain = document.createElement('audio')
    plain.src = '/music/plain.mp3'
    expect(sameMedia(plain, plain.src)).toBe(true)

    expect(followingSongUrl(null, 0)).toBe('')
    expect(followingSongUrl({ songs: [{ songUrl: '/a.mp3' }] }, 0)).toBe('')
    expect(followingSongUrl({ songs: [{ songUrl: '/a.mp3' }, {}] }, 0)).toBe('')
    expect(followingSongUrl({ songs: [{ songUrl: '/a.mp3' }, { songUrl: '/b.mp3' }] }, 0)).toBe('/b.mp3')
    expect(followingSongUrl({ songs: [{ songUrl: '/a.mp3' }, { songUrl: '/b.mp3' }] }, 1)).toBe('/a.mp3')

    expect(openWarmer('')).toBe(false)
    expect(warmAfterStart(null, '/b.mp3')).toBe(false)
    expect(warmAfterStart(audio, '')).toBe(false)
    expect(openWarmer('/music/next.mp3')).toBe(true)
    expect(openWarmer('/music/next.mp3')).toBe(true)

    const waiting = document.createElement('audio')
    expect(warmAfterStart(waiting, '/music/later.mp3')).toBe(true)
    expect(warmAfterStart(waiting, '/music/later.mp3')).toBe(true)
    waiting.dispatchEvent(new Event('playing'))

    const ready = document.createElement('audio')
    Object.defineProperty(ready, 'paused', { value: false, configurable: true })
    Object.defineProperty(ready, 'readyState', { value: 3, configurable: true })
    expect(warmAfterStart(ready, '/music/ready.mp3')).toBe(true)
  })
})
