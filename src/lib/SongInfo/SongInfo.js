import React from 'react'
import { observer } from 'mobx-react'
import store from '../store/store'
import './SongInfo.scss'

const SongInfo = observer(() => {
  return (
    <div className={'song-info'}>
      <img className={'song-info__cover'} src={store.state.currentPlayList.playlistCoverUrl} alt="cover" />
      <div className={'song-info__text'}>
        <span className={'title'}>{store.state.currentSong.songName}</span>
        <span className={'subtitle'}>{store.state.currentPlayList.bandName}</span>
      </div>
    </div>
  )
})

export default SongInfo
