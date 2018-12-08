import React from 'react'
import './PlayerIcon.sass'
import Random from './Icons/Random'
import Sync from './Icons/Sync'
import Play from './Icons/Play'
import Pause from './Icons/Pause'
import Forward from './Icons/Forward'
import Backward from './Icons/Backward'
import VolumeUp from './Icons/VolumeUp'
import VolumeDown from './Icons/VolumeDown'
import VolumeOff from './Icons/VolumeOff'

export const iconToRender = props => {
  const requestedIcon = props.icon

  switch (requestedIcon) {
    case 'random':
      return <Random />
    case 'sync':
      return <Sync />
    case 'play':
      return <Play />
    case 'pause':
      return <Pause />
    case 'forward':
      return <Forward />
    case 'backward':
      return <Backward />
    case 'volumeup':
      return <VolumeUp />
    case 'volumedown':
      return <VolumeDown />
    case 'volumeoff':
      return <VolumeOff />
    default:
      break
  }
}

const PlayerIcon = props => {
  return (
    <div className={`${props.passClass} icon`} onClick={props.onClick}>
      {iconToRender(props)}
    </div>
  )
}

export default PlayerIcon
