import React from 'react'
import { observer } from 'mobx-react'
import store from '../store/store'
import './AudioVolume.sass'
import PlayerIcon from '../PlayerIcon/PlayerIcon'

export const volumeClass = state => {
  if (state.audioVolume >= 0.5) {
    return 'volumeup'
  } else if (state.audioVolume < 0.5 && state.audioVolume > 0) {
    return 'volumedown'
  } else {
    return 'volumeoff'
  }
}

export const toggleVolume = state => (state.audioVolume > 0.0 ? 0.0 : 1.0)

export const seekVolume = (e, testConfig = {}) => {
  const desiredPos = e.clientX
  const volumeOffsetLeft = getVolumeOffsetLeft(testConfig)
  const volumeBarOffsetLeft = getVolumeBarOffsetLeft(testConfig)
  const volumeBarWidth = getVolumeBarWidth(testConfig)

  return Math.round(((desiredPos - volumeOffsetLeft - volumeBarOffsetLeft) / volumeBarWidth) * 10) / 10
}

const getVolumeOffsetLeft = ({ volume }) => {
  if (volume) return volume.offsetLeft
  return document.getElementById('audio-volume').offsetLeft
}

const getVolumeBarOffsetLeft = ({ volumeBar }) => {
  if (volumeBar) return volumeBar.offsetLeft
  return document.getElementsByClassName('audio-volume__level')[0].offsetLeft
}

const getVolumeBarWidth = ({ volumeBar }) => {
  if (volumeBar) return volumeBar.width
  return document.getElementsByClassName('audio-volume__level')[0].offsetWidth
}

const AudioVolume = observer(() => {
  return (
    <div id="audio-volume" className={'audio-volume'}>
      <PlayerIcon
        passClass={volumeClass(store.state)}
        icon={volumeClass(store.state)}
        onClick={() =>
          store
            .setAudio()
            .setVolume(toggleVolume(store.state))
            .visual()
        }
      />
      <div
        className={'audio-volume__level'}
        onClick={e =>
          store
            .setAudio()
            .setVolume(seekVolume(e))
            .visual()
        }
      >
        <div className={'audio-volume__fill'} style={{ width: `${store.state.audioVolume * 100}%` }} />
      </div>
    </div>
  )
})

export default AudioVolume
