const fs = require('fs')
const path = require('path')
const { readLibrary } = require('./read-library')

function parseArgs(argv, env) {
  const includeAt = argv.indexOf('--include')
  const outAt = argv.indexOf('--out')
  const copyAt = argv.indexOf('--copy')
  const includeValue = includeAt >= 0 ? argv[includeAt + 1] : env.LIBRARY_INCLUDE
  const destination = (outAt >= 0 ? argv[outAt + 1] : env.LIBRARY_OUT) || path.join(process.cwd(), 'public', 'library.json')
  const copyTo = (copyAt >= 0 ? argv[copyAt + 1] : env.LIBRARY_COPY_TO) || undefined

  return {
    destination,
    musicRoot: env.LIBRARY_MUSIC || undefined,
    hostedFile: env.LIBRARY_HOSTED || undefined,
    includeFolders: includeValue ? includeValue.split(',').filter(Boolean) : undefined,
    copyTo
  }
}

function copyFolders(musicRoot, copyTo, includeFolders) {
  const musicDest = path.join(copyTo, 'music')
  fs.rmSync(musicDest, { recursive: true, force: true })
  includeFolders.forEach(folder => {
    const from = path.join(musicRoot, folder)
    if (!fs.existsSync(from)) return
    const dest = path.join(musicDest, folder)
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(from).forEach(name => {
      if (name.startsWith('.')) return
      const src = path.join(from, name)
      if (!fs.statSync(src).isFile()) return
      fs.copyFileSync(src, path.join(dest, name))
    })
  })
}

function writeLibrary(destination = path.join(process.cwd(), 'public', 'library.json'), options = {}) {
  const musicRoot = options.musicRoot || path.join(process.cwd(), 'music')
  const library = readLibrary({
    musicRoot: options.musicRoot,
    hostedFile: options.hostedFile
  })

  if (Array.isArray(options.includeFolders)) {
    library.playlists = library.playlists.filter(playlist => {
      if (playlist.source !== 'folder') return true
      return options.includeFolders.includes(playlist.id.slice('folder:'.length))
    })
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, JSON.stringify(library, null, 2))

  if (options.copyTo) copyFolders(musicRoot, options.copyTo, options.includeFolders || [])
  return destination
}

function runCli(argv = process.argv.slice(2), env = process.env) {
  const options = parseArgs(argv, env)
  return writeLibrary(options.destination, options)
}

if (require.main === module) runCli()

module.exports = { writeLibrary, runCli, parseArgs }
