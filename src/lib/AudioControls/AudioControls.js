import React from 'react'
import { observer } from 'mobx-react'
import { objectHasProps } from '../utils/objectUtils'
import store from '../store/store'
import './AudioControls.scss'
import PlayerIcon from '../PlayerIcon/PlayerIcon'
import AudioVolume from '../AudioVolume/AudioVolume'

export const randomClasses = ({ randomize }) => (randomize ? 'random active' : 'random')
export const playClasses = ({ audioPlaying }) => (audioPlaying ? 'pause' : 'play')
export const repeatClasses = ({ repeat }) => {
  switch (repeat) {
    case 'off':
      return 'sync'
    case 'all':
      return 'sync active'
    case 'one':
      return 'sync active active--twice'
    default:
      break
  }
}

const toggleHandler = () => {
  if (objectHasProps(store.state.currentPlayList)) {
    store.setAudio().toggle()
  }
}

const AudioControls = observer((props) => (
  <div className={'icons'}>
    <PlayerIcon
      passClass={randomClasses(store.state)}
      icon="random"
      onClick={() => store.setControls().toggleRandomize()}
    />
    <PlayerIcon passClass="backward" icon="backward" onClick={() => store.setControls().skipBackward()} />

    <PlayerIcon
      passClass={playClasses(store.state)}
      icon={playClasses(store.state)}
      onClick={() => toggleHandler(props)}
    />

    <PlayerIcon passClass="forward" icon="forward" onClick={() => store.setControls().skipForward()} />
    <PlayerIcon passClass={repeatClasses(store.state)} icon="sync" onClick={() => store.setControls().toggleRepeat()} />
    <AudioVolume />
  </div>
))

export default AudioControls
