import React from 'react'
import { observer } from 'mobx-react'
import store from '../store/store'
import './AudioProgress.scss'
import { formatTime } from '../utils/formatTime'

export function progressBox(element, testConfig = {}) {
  if (testConfig.progress) return { width: testConfig.progress.width, left: testConfig.progress.left }
  if (!element) return { width: 0, left: 0 }
  const rect = element.getBoundingClientRect()
  return { width: rect.width || element.offsetWidth, left: rect.left }
}

export const seekPlaying = (e, store, testConfig = {}) => {
  if (!store.canPlay) return undefined
  const duration = store.setAudio().getDuration()
  if (!Number.isFinite(duration) || duration <= 0) return undefined
  const box = progressBox(getProgressEl(testConfig), testConfig)
  if (!box.width) return undefined
  const ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width))
  return ratio * duration
}

const getProgressEl = ({ progress } = {}) => {
  if (progress) return { offsetWidth: progress.width, offsetLeft: progress.left }
  return document.getElementById('progress')
}

export function previewScrub(event, store) {
  const time = seekPlaying(event, store)
  if (!Number.isFinite(time)) return
  const duration = store.setAudio().getDuration()
  store.state.scrubbing = true
  store.setProgress().set(`${Math.round((time / duration) * 1000) / 10}%`)
}

export function commitScrub(event, store) {
  const time = seekPlaying(event, store)
  store.state.scrubbing = false
  if (!Number.isFinite(time)) return
  store.setAudio().setCurrentTime(time)
}

export function bindScrub(event, store) {
  if (event.button != null && event.button !== 0) return
  const move = ev => previewScrub(ev, store)
  const up = ev => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    commitScrub(ev, store)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  previewScrub(event, store)
}

const AudioProgress = observer(() => {
  return (
    <div
      id="progress"
      className={'progress'}
      onPointerDown={event => bindScrub(event, store)}
      onClick={event => commitScrub(event, store)}
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
