import React from 'react'
import { observer } from 'mobx-react'
import store from '../store/store'
import { resolveMediaSrc } from '../utils/mediaSrc'
import './SongInfo.scss'

const SongInfo = observer(() => {
  const song = store.state.currentSong
  const playlist = store.state.currentPlayList
  const cover = resolveMediaSrc(song.coverUrl || playlist.playlistCoverUrl)
  const artist = song.artist || playlist.bandName || ''
  const mark = (artist || song.songName || '?').trim().charAt(0).toUpperCase()

  return (
    <div className={'song-info'}>
      {cover ? (
        <img className={'song-info__cover'} src={cover} alt="" />
      ) : (
        <span className={'song-info__mark'} aria-hidden="true">{mark}</span>
      )}
      <div className={'song-info__text'}>
        <span className={'title'}>{song.songName}</span>
        <span className={'subtitle'}>{artist}</span>
      </div>
    </div>
  )
})

export default SongInfo
