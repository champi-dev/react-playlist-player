import React from 'react'
import { observer } from 'mobx-react'
import store from '../store/store'
import './AudioProgress.sass'
import { formatTime } from '../../utils/formatTime'

export const seekPlaying = (e, store, testConfig = {}) => {
  if (!store.canPlay) return undefined

  const desiredPos = e.clientX
  const playerWidth = getPlayerWidth(testConfig)
  const progressEl = getProgressEl(testConfig)
  const progressWidth = progressEl.offsetWidth
  const progressOffsetLeft = progressEl.offsetLeft
  let positionToSet = 0

  if (playerWidth === progressWidth) {
    positionToSet = Math.round(
      (desiredPos / progressWidth) * store.setAudio().getDuration()
    )
  } else if (playerWidth > progressWidth) {
    positionToSet = Math.round(
      ((desiredPos - progressOffsetLeft) / progressWidth) *
        store.setAudio().getDuration()
    )
  }

  return positionToSet
}

const getPlayerWidth = ({ player }) => {
  if (player) return player.width
  return document.getElementById('audio__player').offsetWidth
}

const getProgressEl = ({ progress }) => {
  if (progress)
    return { offsetWidth: progress.width, offsetLeft: progress.left }
  return document.getElementById('progress')
}

const AudioProgress = observer(() => {
  return (
    <div
      id="progress"
      className={'progress'}
      onClick={e => store.setAudio().setCurrentTime(seekPlaying(e, store))}
    >
      <span className={'current-time time'}>
        {formatTime(store.setAudio().getCurrentTime())}
      </span>
      <div
        className={'progress__fill'}
        style={{ width: store.setProgress().get() }}
      />
      <span className={'total-time time'}>
        {formatTime(store.setAudio().getDuration())}
      </span>
    </div>
  )
})

export default AudioProgress
