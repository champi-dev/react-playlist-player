import React, { Component } from 'react'
import { render } from 'react-dom'
import AudioPlayer from '../index'
import { formatTime } from '../utils/formatTime'
import { resolveMediaSrc } from '../utils/mediaSrc'
import store from '../store/store'
import '../styles/index.scss'
import './demo.scss'

function artwork(song, playlist) {
  return (song && (song.coverUrl || (playlist && playlist.playlistCoverUrl))) || ''
}

function initial(value) {
  const text = String(value || '').trim()
  return text ? text.charAt(0).toUpperCase() : '?'
}

const ALL_ID = 'all'

function toPlayerPlaylist(playlist) {
  return {
    playlistCoverUrl: playlist.playlistCoverUrl || '',
    playlistName: playlist.name,
    bandName: playlist.bandName || playlist.name,
    type: playlist.source === 'link' ? 'links' : 'folder',
    songs: playlist.songs.map(song => ({
      position: song.position,
      songName: song.songName,
      artist: song.artist,
      songUrl: song.songUrl,
      coverUrl: song.coverUrl || playlist.playlistCoverUrl || '',
      duration: song.duration,
      playlistName: song.playlistName || playlist.name
    }))
  }
}

function categoryName(playlist) {
  return playlist.category || playlist.name
}

function categoriesFrom(playlists) {
  const groups = []
  playlists.forEach(playlist => {
    if (playlist.source === 'all') return
    const name = categoryName(playlist)
    let group = groups.find(item => item.name === name)
    if (!group) {
      group = { id: `category:${name}`, name, playlists: [] }
      groups.push(group)
    }
    group.playlists.push(playlist)
  })
  groups.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  return groups
}

function withEverything(playlists) {
  const songs = playlists.reduce((all, playlist) => {
    playlist.songs.forEach(song => {
      all.push({ ...song, playlistName: playlist.name })
    })
    return all
  }, [])

  return [
    {
      id: ALL_ID,
      name: 'Everything',
      source: 'all',
      location: 'music',
      playlistCoverUrl: '',
      songs: songs.map((song, index) => ({ ...song, position: String(index + 1) }))
    },
    ...playlists
  ]
}

export class Library extends Component {
  state = {
    playlists: [],
    error: '',
    selectedId: null,
    playingId: null,
    activeSongIndex: null,
    currentPlayList: {}
  }

  componentDidMount() {
    this.load()
    window.addEventListener('focus', this.load)
  }

  componentWillUnmount() {
    this.unmounted = true
    window.removeEventListener('focus', this.load)
  }

  load = () => {
    fetch('/api/library')
      .then(response => {
        if (!response.ok) throw new Error('api')
        return response.json()
      })
      .catch(() =>
        fetch('/library.json').then(response => {
          if (!response.ok) throw new Error('Could not read the music folder')
          return response.json()
        })
      )
      .then(body => {
        const playlists = withEverything(body.playlists || [])
        const categories = categoriesFrom(playlists)
        const first = (categories[0] && categories[0].playlists[0]) || playlists[0]
        this.setState(state => {
          const known = playlists.some(playlist => playlist.id === state.selectedId)
          return {
            playlists,
            error: '',
            selectedId: known ? state.selectedId : first.id
          }
        })
      })
      .catch(error => this.setState({ error: error.message }))
  }

  selectedPlaylist() {
    return this.state.playlists.find(playlist => playlist.id === this.state.selectedId) || this.state.playlists[0]
  }

  selectCategory = category => {
    const current = this.selectedPlaylist()
    if (current && category.playlists.some(playlist => playlist.id === current.id)) return
    this.setState({ selectedId: category.playlists[0].id })
  }

  playSong = index => {
    const playlist = this.selectedPlaylist()
    if (!playlist || !playlist.songs[index]) return
    const song = playlist.songs[index]
    const url = resolveMediaSrc(song.songUrl)
    // Start the byte stream before React renders. The play() promise resolves
    // once audio is actually moving, and only then do we repaint the library.
    const pending = store.setAudio().prime(url)
    this.markPlaying(index)
    const apply = () => {
      if (this.unmounted) return
      this.setState(state => ({
        playingId: playlist.id,
        activeSongIndex: index,
        currentPlayList:
          state.playingId === playlist.id && state.currentPlayList && state.currentPlayList.songs
            ? state.currentPlayList
            : toPlayerPlaylist(playlist)
      }))
    }
    Promise.resolve(pending).then(() => window.setTimeout(apply, 0), () => window.setTimeout(apply, 0))
  }

  markPlaying(index) {
    const rows = document.querySelectorAll('.library__list .song')
    rows.forEach((row, rowIndex) => {
      const playing = rowIndex === index
      row.classList.toggle('is-playing', playing)
      if (playing) row.setAttribute('aria-current', 'true')
      else row.removeAttribute('aria-current')
    })
  }

  renderCategoryButton(category) {
    const selected = category.playlists.some(playlist => playlist.id === this.state.selectedId)
    const songs = category.playlists.reduce((count, playlist) => count + playlist.songs.length, 0)
    const source = category.playlists.find(playlist => playlist.playlistCoverUrl || (playlist.songs[0] && playlist.songs[0].coverUrl)) || category.playlists[0]
    const cover = resolveMediaSrc(source.playlistCoverUrl || (source.songs[0] && source.songs[0].coverUrl) || '')
    const meta = category.playlists.length > 1
      ? `${category.playlists.length} playlists`
      : `${songs} ${songs === 1 ? 'song' : 'songs'}`

    return (
      <button
        key={category.id}
        type="button"
        className={selected ? 'library__playlist is-selected' : 'library__playlist'}
        aria-current={selected ? 'true' : undefined}
        onClick={() => this.selectCategory(category)}
      >
        {cover ? (
          <img className="library__playlist-art" src={cover} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="library__playlist-art library__playlist-art--mark" aria-hidden="true">{initial(category.name)}</span>
        )}
        <span className="library__playlist-copy">
          <span className="library__playlist-name">{category.name}</span>
          <span className="library__playlist-meta">{meta}</span>
        </span>
      </button>
    )
  }

  renderPlaylistButton(playlist) {
    const selected = playlist.id === this.state.selectedId
    const cover = resolveMediaSrc(playlist.playlistCoverUrl || (playlist.songs[0] && playlist.songs[0].coverUrl) || '')

    return (
      <button
        key={playlist.id}
        type="button"
        className={selected ? 'library__playlist is-selected' : 'library__playlist'}
        aria-current={selected ? 'true' : undefined}
        onClick={() => this.setState({ selectedId: playlist.id })}
      >
        {cover ? (
          <img className="library__playlist-art" src={cover} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="library__playlist-art library__playlist-art--mark" aria-hidden="true">{initial(playlist.name)}</span>
        )}
        <span className="library__playlist-copy">
          <span className="library__playlist-name">{playlist.name}</span>
          <span className="library__playlist-meta">
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </span>
        </span>
      </button>
    )
  }

  render() {
    const playlist = this.selectedPlaylist()
    const playingHere = playlist && playlist.id === this.state.playingId
    const categories = categoriesFrom(this.state.playlists)
    const everything = this.state.playlists.find(item => item.source === 'all')
    const category = playlist && playlist.source !== 'all'
      ? categories.find(item => item.name === categoryName(playlist))
      : null
    const grouped = category && category.playlists.length > 1

    return (
      <div className="library">
        <nav className="library__playlists" aria-label="Categories">
          {everything && this.renderPlaylistButton(everything)}
          {categories.map(item => this.renderCategoryButton(item))}
        </nav>
        <main className="library__songs">
          {this.state.error && <p className="library__error">{this.state.error}</p>}
          {playlist && (
            <header className="library__heading">
              <h1>{grouped ? category.name : playlist.name}</h1>
              <p>
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </header>
          )}
          {grouped && (
            <div className="library__discs">
              {category.playlists.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === playlist.id ? 'library__disc is-selected' : 'library__disc'}
                  aria-current={item.id === playlist.id ? 'true' : undefined}
                  onClick={() => this.setState({ selectedId: item.id })}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          {playlist && playlist.songs.length === 0 && (
            <p className="library__empty">
              {playlist.source === 'folder'
                ? `Add audio files to ${playlist.location}. They show up in this category.`
                : 'Add a folder inside music, such as music/Jazz, and put your audio files in it. For files that live on a server, add their links to hosted-playlists.json.'}
            </p>
          )}
          {playlist && (
            <ol className="library__list">
              {playlist.songs.map((song, index) => {
                const playing = playingHere && index === this.state.activeSongIndex
                const cover = resolveMediaSrc(artwork(song, playlist))
                return (
                  <li key={`${song.songUrl}-${song.position}`}>
                    <button
                      type="button"
                      className={playing ? 'song is-playing' : 'song'}
                      aria-current={playing ? 'true' : undefined}
                      onClick={() => this.playSong(index)}
                    >
                      <span className="song__art" aria-hidden="true">
                        {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : <span className="song__mark">{initial(song.artist || song.songName)}</span>}
                      </span>
                      <span className="song__name">{song.songName}</span>
                      <span className="song__artist">{song.artist}</span>
                      {playlist.source === 'all' && (
                        <span className="song__from">{song.playlistName}</span>
                      )}
                      <span className="song__time">
                        {Number.isFinite(song.duration) ? formatTime(song.duration) : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </main>
        <AudioPlayer
          currentPlayList={this.state.currentPlayList}
          activeSongIndex={this.state.activeSongIndex}
          onSongChanged={({ currentSong }) => {
            if (currentSong && Number.isInteger(currentSong.arrIndex)) {
              const index = currentSong.arrIndex
              window.setTimeout(() => {
                if (this.unmounted) return
                this.setState({ activeSongIndex: index })
              }, 0)
            }
          }}
        />
      </div>
    )
  }
}

export function mountLibrary(node = document.getElementById('root')) {
  if (!node) return null
  return render(<Library />, node)
}

if (process.env.NODE_ENV !== 'test') mountLibrary()
