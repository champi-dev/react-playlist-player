const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i

function publicUrl() {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) {
      return process.env.PUBLIC_URL
    }
  } catch (error) {
    return ''
  }
  return ''
}

// Hosted links stay as they are. A path inside this project is served from the site root.
export function resolveMediaSrc(src) {
  if (typeof src !== 'string') return ''
  const value = src.trim()
  if (!value || ABSOLUTE.test(value) || value.startsWith('/')) return value
  const base = String(publicUrl()).replace(/\/$/, '')
  return `${base}/${value.replace(/^\.\//, '')}`
}

export function audioMimeType(src) {
  const filePath = String(src || '').split('?')[0].split('#')[0].toLowerCase()
  if (filePath.endsWith('.mp3')) return 'audio/mpeg'
  if (filePath.endsWith('.wav')) return 'audio/wav'
  if (filePath.endsWith('.ogg') || filePath.endsWith('.oga')) return 'audio/ogg'
  if (filePath.endsWith('.m4a') || filePath.endsWith('.mp4')) return 'audio/mp4'
  if (filePath.endsWith('.aac')) return 'audio/aac'
  if (filePath.endsWith('.flac')) return 'audio/flac'
  return undefined
}
