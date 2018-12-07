import React, { Component } from 'react'
import { observer } from 'mobx-react'
import store from './store/store'
import './AudioPlayer.sass'
import SongInfo from './SongInfo/SongInfo'
import AudioControls from './AudioControls/AudioControls'
import AudioProgress from './AudioProgress/AudioProgress'
import isEqual from 'lodash/isEqual'
import { testCond } from '../../utils/objectUtils'

@observer
class AudioPlayer extends Component {
  componentDidUpdate(prevProps) {
    this.onPlaylistChanged(prevProps)
  }

  onPlaylistChanged = (prevProps, testConfig = {}) => {
    if (testCond(testConfig, 'ifBool', !isEqual(prevProps.currentPlayList, this.props.currentPlayList))) {
      store.setAudio().setPlaylist(this.props.currentPlayList)
    }
  }

  render() {
    const SongInfoComponent = store.canPlay && <SongInfo />
    const AudioElement = (
      <audio id="audio" onTimeUpdate={() => store.setProgress().set()} preload="auto">
        <source src={store.state.currentSong.songUrl} type="audio/mp3" />
      </audio>
    )

    return (
      <div className={'audio'}>
        <div id="audio__player" className={'audio__player'}>
          {AudioElement}
          <div className={'audio__controls'}>
            {SongInfoComponent}
            <div className={'group'}>
              <AudioControls />
              <AudioProgress />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const toggleAudio = store.setAudio().toggle
export const audioPlaying = () => store.state.audioPlaying
export default AudioPlayer
