const fs = require('fs')
const path = require('path')

const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.oga', '.m4a', '.aac', '.flac'])
const COVER_EXT = ['.jpg', '.jpeg', '.png', '.webp']
const ROOT = process.cwd()
const HOSTED_FILE = path.join(ROOT, 'hosted-playlists.json')

function isDirectory(dir) {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (error) {
    return false
  }
}

// Checkouts keep the committed Music/ name. macOS treats that as music/; Linux does not.
function resolveMusicRoot(start = ROOT) {
  const preferred = path.join(start, 'music')
  let names
  try {
    names = fs.readdirSync(start)
  } catch (error) {
    return preferred
  }

  const exact = names.find(name => name === 'music' && isDirectory(path.join(start, name)))
  if (exact) return path.join(start, exact)
  const folded = names.find(name => name.toLowerCase() === 'music' && isDirectory(path.join(start, name)))
  return folded ? path.join(start, folded) : preferred
}

const MUSIC_ROOT = resolveMusicRoot(ROOT)

function cleanLabel(value) {
  return String(value || '')
    .replace(/\s*[\[(](?:ultra\s*)?hq(?:\s*audio)?[\])]/gi, '')
    .replace(/\s*[\[(](?:original recording|album version|hd)[\])]/gi, '')
    .replace(/\s+(?:ultra\s+)?hq(?:\s+audio)?$/i, '')
    .replace(/\s*,\s*(?:19|20)\d{2}$/, '')
    .replace(/\s*[\[(][^)\]]*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleFromFile(fileName) {
  const base = fileName.replace(/\.[^.]+$/, '')
  const parts = base.split(/\s+-\s+/)
  if (parts.length >= 2) {
    return {
      artist: cleanLabel(parts[0]),
      songName: cleanLabel(parts.slice(1).join(' - '))
    }
  }
  return { artist: '', songName: cleanLabel(base) }
}

function publicPath(parts) {
  return `/${parts.map(part => encodeURIComponent(part)).join('/')}`
}

function findSidecar(dir, audioFile) {
  const base = audioFile.replace(/\.[^.]+$/, '')
  for (const ext of COVER_EXT) {
    const candidate = base + ext
    if (fs.existsSync(path.join(dir, candidate))) return candidate
  }
  return ''
}

function findFolderCover(dir) {
  for (const ext of COVER_EXT) {
    const candidate = `cover${ext}`
    if (fs.existsSync(path.join(dir, candidate))) return candidate
  }
  return ''
}

function fileScore(name) {
  let score = name.length
  if (/\(\d+\)\.[a-z0-9]+$/i.test(name)) score -= 50
  if (/\s{2,}/.test(name)) score -= 5
  return score
}

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .replace(/\[[^\]]*$|\([^)]*$/g, ' ')
    .replace(/\b(?:ultra|hq|audio|hd)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function dedupe(songs) {
  const kept = new Map()
  songs.forEach(song => {
    const key = `${norm(song.artist)}|${norm(song.songName) || norm(song.fileName)}`
    const previous = kept.get(key)
    if (!previous || fileScore(song.fileName) > fileScore(previous.fileName)) {
      kept.set(key, song)
    }
  })
  return Array.from(kept.values())
}

function displayName(folderName) {
  return folderName.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function directoryNames(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name)
}

function hasAudio(dir) {
  return fs.readdirSync(dir).some(name => {
    if (name.startsWith('.')) return false
    return AUDIO_EXT.has(path.extname(name).toLowerCase())
  })
}

function readFolderPlaylist(relativeParts, musicRoot, category) {
  const folderName = relativeParts[relativeParts.length - 1]
  const dir = path.join(musicRoot, ...relativeParts)
  const folderCover = findFolderCover(dir)
  const files = fs.readdirSync(dir).filter(name => {
    if (name.startsWith('.')) return false
    return AUDIO_EXT.has(path.extname(name).toLowerCase())
  })

  const songs = files.map(fileName => {
    const meta = titleFromFile(fileName)
    const sidecar = findSidecar(dir, fileName)
    return {
      fileName,
      artist: meta.artist,
      songName: meta.songName || fileName,
      duration: null,
      songUrl: publicPath(['music', ...relativeParts, fileName]),
      coverUrl: sidecar ? publicPath(['music', ...relativeParts, sidecar]) : ''
    }
  })

  const unique = dedupe(songs).sort((a, b) => {
    const artist = a.artist.localeCompare(b.artist, undefined, { sensitivity: 'base' })
    if (artist !== 0) return artist
    return a.songName.localeCompare(b.songName, undefined, { sensitivity: 'base' })
  })

  return {
    id: `folder:${relativeParts.join('/')}`,
    name: displayName(folderName),
    category,
    source: 'folder',
    location: `music/${relativeParts.join('/')}`,
    playlistCoverUrl: folderCover ? publicPath(['music', ...relativeParts, folderCover]) : '',
    songs: unique.map((song, index) => ({
      position: String(index + 1),
      songName: song.songName,
      artist: song.artist,
      songUrl: song.songUrl,
      coverUrl: song.coverUrl,
      duration: song.duration
    }))
  }
}

function readHostedPlaylists(hostedFile) {
  if (!fs.existsSync(hostedFile)) return []
  let data
  try {
    data = JSON.parse(fs.readFileSync(hostedFile, 'utf8'))
  } catch (error) {
    throw new Error(`hosted-playlists.json is not valid JSON (${error.message})`)
  }

  const list = Array.isArray(data) ? data : data.playlists || []
  return list
    .map((playlist, index) => {
      const songs = (playlist.songs || [])
        .filter(song => song && typeof song.songUrl === 'string' && song.songUrl.trim())
        .map((song, songIndex) => ({
          position: String(song.position || songIndex + 1),
          songName: song.songName || `Track ${songIndex + 1}`,
          artist: song.artist || playlist.bandName || '',
          songUrl: song.songUrl.trim(),
          coverUrl: song.coverUrl || '',
          duration: Number.isFinite(song.duration) ? song.duration : null
        }))

      return {
        id: `link:${playlist.name || index}`,
        name: playlist.name || `Links ${index + 1}`,
        category: playlist.category || 'Links',
        source: 'link',
        location: 'hosted-playlists.json',
        playlistCoverUrl: playlist.playlistCoverUrl || '',
        bandName: playlist.bandName || '',
        songs
      }
    })
    .filter(playlist => playlist.songs.length > 0)
}

function readLibrary(options = {}) {
  const musicRoot = options.musicRoot || MUSIC_ROOT
  const hostedFile = options.hostedFile || HOSTED_FILE
  const folders = fs.existsSync(musicRoot) ? directoryNames(musicRoot) : []
  const playlists = []

  folders.forEach(name => {
    const dir = path.join(musicRoot, name)
    const children = directoryNames(dir).filter(child => hasAudio(path.join(dir, child)))
    const category = displayName(name)
    // A folder of folders is a category. A folder of audio files is one playlist.
    if (children.length) {
      children.forEach(child => playlists.push(readFolderPlaylist([name, child], musicRoot, category)))
      if (hasAudio(dir)) playlists.push(readFolderPlaylist([name], musicRoot, category))
      return
    }
    // A folder of audio is a playlist. An empty folder is a category waiting for songs.
    playlists.push(readFolderPlaylist([name], musicRoot, category))
  })

  const listed = playlists
    .filter(playlist => playlist.source === 'folder')
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

  return { playlists: listed.concat(readHostedPlaylists(hostedFile)) }
}

module.exports = { readLibrary, resolveMusicRoot, MUSIC_ROOT }
