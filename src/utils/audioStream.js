import { resolveMediaSrc } from './mediaSrc'

export function ensureAudioElement() {
  if (typeof document === 'undefined') return null
  const existing = document.getElementById('audio')
  if (existing) return existing
  const audio = document.createElement('audio')
  audio.id = 'audio'
  audio.preload = 'none'
  document.body.appendChild(audio)
  return audio
}

export function absoluteMediaUrl(url) {
  if (!url) return ''
  try {
    return new URL(url, window.location.href).href
  } catch (error) {
    return url
  }
}

// Reading HTMLMediaElement.src asks the media engine and can stall the click
// that is trying to start playback. Remember the URL we assigned instead.
const assignedUrl = new WeakMap()

export function sameMedia(element, url) {
  if (!element || !url) return false
  const absolute = absoluteMediaUrl(url)
  if (assignedUrl.get(element) === absolute) return true
  return element.src === absolute
}

// Setting src once starts the byte stream. Setting it again, or calling load(), aborts it.
export function attachSource(element, url) {
  if (!element || !url) return false
  const absolute = absoluteMediaUrl(url)
  if (assignedUrl.get(element) === absolute) return false
  element.preload = 'none'
  element.src = url
  assignedUrl.set(element, absolute)
  return true
}

export function followingSongUrl(playlist, index) {
  const songs = playlist && playlist.songs
  if (!songs || songs.length < 2) return ''
  const nextIndex = index + 1 < songs.length ? index + 1 : 0
  const next = songs[nextIndex]
  return (next && next.songUrl) || ''
}

let warmer

export function openWarmer(url) {
  const resolved = resolveMediaSrc(url)
  if (!resolved || typeof Audio === 'undefined') return false
  if (!warmer) {
    warmer = new Audio()
    warmer.preload = 'auto'
    warmer.muted = true
    warmer.volume = 0
  }
  attachSource(warmer, resolved)
  return true
}

export function warmAfterStart(element, url) {
  const resolved = resolveMediaSrc(url)
  if (!element || !resolved) return false
  if (element.warmStop) element.removeEventListener('playing', element.warmStop)
  const start = () => {
    element.removeEventListener('playing', start)
    element.warmStop = null
    openWarmer(resolved)
  }
  element.warmStop = start
  element.addEventListener('playing', start)
  if (!element.paused && element.readyState >= 2) start()
  return true
}
