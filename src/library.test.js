import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { readLibrary } = require('../scripts/read-library')
const { writeLibrary, runCli } = require('../scripts/write-library')
const { audioMimeType, resolveMediaSrc } = require('./utils/mediaSrc')
const { formatTime } = require('./utils/formatTime')
const { objectHasProps, testCond } = require('./utils/objectUtils')

function silentMp3(file, metadata = {}) {
  const args = ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '0.2', '-c:a', 'libmp3lame', '-q:a', '9']
  Object.keys(metadata).forEach(key => {
    args.push('-metadata', `${key}=${metadata[key]}`)
  })
  args.push(file)
  execFileSync('ffmpeg', args, { stdio: 'ignore' })
}

describe('media and time helpers', () => {
  const env = process.env

  afterEach(() => {
    process.env = env
  })

  test('resolves hosted links and files in the project', () => {
    expect(resolveMediaSrc(null)).toBe('')
    expect(resolveMediaSrc('  ')).toBe('')
    expect(resolveMediaSrc('https://cdn.example/a.mp3')).toBe('https://cdn.example/a.mp3')
    expect(resolveMediaSrc('//cdn.example/a.mp3')).toBe('//cdn.example/a.mp3')
    expect(resolveMediaSrc('/music/Jazz/a.mp3')).toBe('/music/Jazz/a.mp3')
    process.env = { ...env, PUBLIC_URL: '/player/' }
    expect(resolveMediaSrc('./music/Jazz/a.mp3')).toBe('/player/music/Jazz/a.mp3')
    process.env = { ...env, PUBLIC_URL: '' }
    expect(resolveMediaSrc('music/Jazz/a.mp3')).toBe('/music/Jazz/a.mp3')
  })

  test('returns an empty base when the environment cannot be read', () => {
    const original = Object.getOwnPropertyDescriptor(global, 'process')
    Object.defineProperty(global, 'process', {
      configurable: true,
      get() {
        throw new Error('no process')
      }
    })
    expect(resolveMediaSrc('music/a.mp3')).toBe('/music/a.mp3')
    Object.defineProperty(global, 'process', original)
  })

  test('maps audio extensions', () => {
    expect(audioMimeType('https://x/a.mp3?token=1')).toBe('audio/mpeg')
    expect(audioMimeType('/a.wav')).toBe('audio/wav')
    expect(audioMimeType('/a.ogg')).toBe('audio/ogg')
    expect(audioMimeType('/a.oga')).toBe('audio/ogg')
    expect(audioMimeType('/a.m4a')).toBe('audio/mp4')
    expect(audioMimeType('/a.mp4')).toBe('audio/mp4')
    expect(audioMimeType('/a.aac')).toBe('audio/aac')
    expect(audioMimeType('/a.flac')).toBe('audio/flac')
    expect(audioMimeType('/a.bin')).toBeUndefined()
    expect(audioMimeType('')).toBeUndefined()
  })

  test('formats timestamps and object checks', () => {
    expect(formatTime(undefined)).toBe('')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(125.4)).toBe('2:05')
    expect(objectHasProps(null)).toBe(false)
    expect(objectHasProps('x')).toBe(false)
    expect(objectHasProps({})).toBe(false)
    expect(objectHasProps({ a: 1 })).toBe(true)
    expect(testCond(null, 'a', 'fallback')).toBe('fallback')
    expect(testCond({ a: 2 }, 'a', 'fallback')).toBe(2)
  })
})

describe('readLibrary', () => {
  let root

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'library-'))
    const jazz = path.join(root, 'music', 'Jazz')
    const rock = path.join(root, 'music', 'Classic_Rock')
    const empty = path.join(root, 'music', 'Empty')
    fs.mkdirSync(jazz, { recursive: true })
    fs.mkdirSync(rock, { recursive: true })
    fs.mkdirSync(empty, { recursive: true })
    fs.mkdirSync(path.join(root, 'music', '.hidden'), { recursive: true })
    fs.writeFileSync(path.join(jazz, 'notes.txt'), 'nope')
    fs.writeFileSync(path.join(jazz, 'cover.jpg'), 'img')
    silentMp3(path.join(jazz, 'Field Notes - Harbor, 1970.mp3'))
    silentMp3(path.join(jazz, 'Field Notes - Harbor (1).mp3'))
    silentMp3(path.join(jazz, 'DAVID BOWIE - ZIGGY STARDUST (ULTRA HQ AUDIO).mp3'))
    fs.writeFileSync(path.join(jazz, 'Broken (Original Recordin.mp3'), Buffer.from('not audio'))
    fs.writeFileSync(path.join(jazz, 'Broken (Original Recordin.jpg'), 'img')
    silentMp3(path.join(rock, 'Derek - Layla (Album Version) HQ.mp3'))
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  test('reads folders, covers, duplicates, and hosted links', () => {
    const hosted = path.join(root, 'hosted.json')
    fs.writeFileSync(hosted, JSON.stringify({
      playlists: [
        { songs: [{ songUrl: '   ' }] },
        {
          bandName: 'Various',
          playlistCoverUrl: 'https://example.com/night.jpg',
          songs: [
            { songUrl: ' https://example.com/a.mp3 ', duration: 'nope' },
            { songName: 'Named', artist: 'Ada', songUrl: 'https://example.com/b.mp3', coverUrl: 'https://example.com/b.jpg', duration: 12, position: '4' }
          ]
        }
      ]
    }))

    const { playlists } = readLibrary({
      musicRoot: path.join(root, 'music'),
      hostedFile: hosted
    })

    expect(playlists.map(playlist => playlist.name)).toEqual(['Classic Rock', 'Empty', 'Jazz', 'Links 2'])
    expect(playlists[0].category).toBe('Classic Rock')
    expect(playlists[1].songs).toEqual([])
    const jazz = playlists[2]
    expect(jazz.category).toBe('Jazz')
    expect(jazz.playlistCoverUrl).toBe('/music/Jazz/cover.jpg')
    expect(jazz.songs.map(song => song.songName).sort()).toEqual(['Broken', 'Harbor', 'ZIGGY STARDUST'])
    const harbor = jazz.songs.find(song => song.songName === 'Harbor')
    const broken = jazz.songs.find(song => song.songName === 'Broken')
    expect(harbor.artist).toBe('Field Notes')
    expect(harbor.duration).toBeNull()
    expect(broken.coverUrl).toBe('/music/Jazz/Broken%20(Original%20Recordin.jpg')
    expect(broken.duration).toBeNull()
    const link = playlists[3]
    expect(link.category).toBe('Links')
    expect(link.source).toBe('link')
    expect(link.songs[0].songName).toBe('Track 1')
    expect(link.songs[0].artist).toBe('Various')
    expect(link.songs[0].duration).toBeNull()
    expect(link.songs[1].position).toBe('4')
  })

  test('accepts a top-level hosted array and a missing music folder', () => {
    const hosted = path.join(root, 'array.json')
    fs.writeFileSync(hosted, JSON.stringify([
      { name: 'Night Drive', category: 'Night', songs: [{ songName: 'Only', songUrl: 'https://example.com/only.mp3' }] }
    ]))
    const { playlists } = readLibrary({
      musicRoot: path.join(root, 'missing'),
      hostedFile: hosted
    })
    expect(playlists).toHaveLength(1)
    expect(playlists[0].name).toBe('Night Drive')
    expect(playlists[0].category).toBe('Night')
  })

  test('groups subfolders into one category', () => {
    const music = path.join(root, 'grouped')
    fs.mkdirSync(path.join(music, 'Deep_House', 'Anthems_CD1'), { recursive: true })
    fs.mkdirSync(path.join(music, 'Deep_House', 'Anthems_CD2'), { recursive: true })
    fs.mkdirSync(path.join(music, 'Deep_House', 'notes'), { recursive: true })
    fs.writeFileSync(path.join(music, 'Deep_House', 'notes', 'readme.txt'), 'nope')
    silentMp3(path.join(music, 'Deep_House', 'Anthems_CD1', 'One.mp3'))
    silentMp3(path.join(music, 'Deep_House', 'Anthems_CD2', 'Two.mp3'))
    silentMp3(path.join(music, 'Deep_House', 'Loose.mp3'))

    const { playlists } = readLibrary({
      musicRoot: music,
      hostedFile: path.join(root, 'nope.json')
    })

    expect(playlists.map(playlist => [playlist.name, playlist.category, playlist.id])).toEqual([
      ['Anthems CD1', 'Deep House', 'folder:Deep_House/Anthems_CD1'],
      ['Anthems CD2', 'Deep House', 'folder:Deep_House/Anthems_CD2'],
      ['Deep House', 'Deep House', 'folder:Deep_House']
    ])
    expect(playlists[0].songs[0].songUrl).toBe('/music/Deep_House/Anthems_CD1/One.mp3')
    expect(playlists[2].songs[0].songUrl).toBe('/music/Deep_House/Loose.mp3')
  })

  test('rejects invalid hosted json and ignores a missing file', () => {
    const bad = path.join(root, 'bad.json')
    fs.writeFileSync(bad, '{')
    expect(() => readLibrary({ musicRoot: path.join(root, 'missing'), hostedFile: bad })).toThrow(/not valid JSON/)
    const { playlists } = readLibrary({
      musicRoot: path.join(root, 'missing'),
      hostedFile: path.join(root, 'nope.json')
    })
    expect(playlists).toEqual([])
  })

  test('writes a catalog file', () => {
    const destination = path.join(root, 'out', 'library.json')
    writeLibrary(destination)
    const written = JSON.parse(fs.readFileSync(destination, 'utf8'))
    expect(written.playlists.length).toBeGreaterThan(0)
  })

  test('publishes only the folders asked for', () => {
    const jazz = path.join(root, 'music', 'Jazz')
    fs.writeFileSync(path.join(jazz, '.skip'), 'hidden')
    fs.mkdirSync(path.join(jazz, 'nested'))
    const destination = path.join(root, 'site', 'library.json')
    const copyTo = path.join(root, 'site')
    const previous = {
      LIBRARY_MUSIC: process.env.LIBRARY_MUSIC,
      LIBRARY_HOSTED: process.env.LIBRARY_HOSTED
    }
    process.env.LIBRARY_MUSIC = path.join(root, 'music')
    process.env.LIBRARY_HOSTED = path.join(root, 'missing-hosted.json')

    const writtenPath = runCli(['--include', 'Jazz,Missing', '--out', destination, '--copy', copyTo])
    const catalog = JSON.parse(fs.readFileSync(writtenPath, 'utf8'))
    expect(catalog.playlists.map(playlist => playlist.name)).toEqual(['Jazz'])
    expect(fs.existsSync(path.join(copyTo, 'music', 'Jazz', 'Field Notes - Harbor, 1970.mp3'))).toBe(true)
    expect(fs.existsSync(path.join(copyTo, 'music', 'Classic_Rock'))).toBe(false)
    expect(fs.existsSync(path.join(copyTo, 'music', 'Jazz', '.skip'))).toBe(false)
    expect(fs.existsSync(path.join(copyTo, 'music', 'Missing'))).toBe(false)

    runCli(undefined, {
      LIBRARY_OUT: path.join(root, 'site', 'fallback.json'),
      LIBRARY_MUSIC: path.join(root, 'music'),
      LIBRARY_HOSTED: path.join(root, 'missing-hosted.json')
    })
    const fallback = JSON.parse(fs.readFileSync(path.join(root, 'site', 'fallback.json'), 'utf8'))
    expect(fallback.playlists.map(playlist => playlist.name)).toEqual(['Classic Rock', 'Empty', 'Jazz'])

    if (previous.LIBRARY_MUSIC === undefined) delete process.env.LIBRARY_MUSIC
    else process.env.LIBRARY_MUSIC = previous.LIBRARY_MUSIC
    if (previous.LIBRARY_HOSTED === undefined) delete process.env.LIBRARY_HOSTED
    else process.env.LIBRARY_HOSTED = previous.LIBRARY_HOSTED
  })
})
