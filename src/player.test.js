import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { runInAction } from 'mobx'
import AudioPlayer from './index'
import AudioControls, { playClasses, randomClasses, repeatClasses } from './AudioControls/AudioControls'
import AudioProgress, { bindScrub, commitScrub, previewScrub, progressBox, seekPlaying } from './AudioProgress/AudioProgress'
import AudioVolume, { seekVolume, toggleVolume, volumeClass } from './AudioVolume/AudioVolume'
import PlayerIcon from './PlayerIcon/PlayerIcon'
import store from './store/store'

function flush() {
  return Promise.resolve().then(() => Promise.resolve())
}

function resetStore() {
  runInAction(() => {
    store.startIndex = null
    store.state.audioElement = undefined
    store.state.audioVolume = 1
    store.state.audioProgress = '0%'
    store.state.scrubbing = false
    store.state.audioPlaying = false
    store.state.randomize = false
    store.state.repeat = 'off'
    store.state.playedIndexes = []
    store.state.backwardTimes = 0
    store.state.currentSong = {}
    store.state.currentPlayList = {}
  })
}

function playlist(songs = 2) {
  return {
    playlistName: 'Shelf',
    bandName: 'House',
    playlistCoverUrl: '',
    songs: Array.from({ length: songs }, (_, index) => ({
      position: String(index + 1),
      songName: `Song ${index + 1}`,
      artist: `Artist ${index + 1}`,
      songUrl: index === 0 ? '/music/Jazz/one.mp3' : 'https://example.com/two.mp3',
      coverUrl: index === 1 ? 'https://example.com/two.jpg' : ''
    }))
  }
}

describe('player store and controls', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    resetStore()
  })

  test('class helpers cover every branch', () => {
    expect(randomClasses({ randomize: true })).toBe('random active')
    expect(randomClasses({ randomize: false })).toBe('random')
    expect(playClasses({ audioPlaying: true })).toBe('pause')
    expect(playClasses({ audioPlaying: false })).toBe('play')
    expect(repeatClasses({ repeat: 'off' })).toBe('sync')
    expect(repeatClasses({ repeat: 'all' })).toBe('sync active')
    expect(repeatClasses({ repeat: 'one' })).toBe('sync active active--twice')
    expect(repeatClasses({ repeat: 'other' })).toBeUndefined()
    expect(volumeClass({ audioVolume: 0.5 })).toBe('volumeup')
    expect(volumeClass({ audioVolume: 0.2 })).toBe('volumedown')
    expect(volumeClass({ audioVolume: 0 })).toBe('volumeoff')
    expect(toggleVolume({ audioVolume: 0.4 })).toBe(0)
    expect(toggleVolume({ audioVolume: 0 })).toBe(1)
    expect(seekVolume({ clientX: 30 }, {
      volume: { offsetLeft: 10 },
      volumeBar: { offsetLeft: 5, width: 20 }
    })).toBe(0.8)
  })

  test('seeks with the live progress bar and the volume bar', () => {
    document.body.innerHTML = `
      <div id="audio__player"></div>
      <div id="progress"></div>
      <div id="audio-volume"></div>
      <div class="audio-volume__level"></div>
      <audio id="audio"></audio>
    `
    const audio = document.getElementById('audio')
    Object.defineProperty(audio, 'duration', { value: 200, configurable: true })
    audio.currentTime = 10
    const player = document.getElementById('audio__player')
    const progress = document.getElementById('progress')
    Object.defineProperty(player, 'offsetWidth', { value: 100, configurable: true })
    Object.defineProperty(progress, 'offsetWidth', { value: 100, configurable: true })
    Object.defineProperty(progress, 'offsetLeft', { value: 0, configurable: true })
    runInAction(() => {
      store.state.currentPlayList = playlist()
      store.state.audioElement = audio
    })
    expect(seekPlaying({ clientX: 50 }, store)).toBe(100)
    expect(seekPlaying({ clientX: 40 }, store, {
      player: { width: 200 },
      progress: { width: 100, left: 20 }
    })).toBe(40)
    expect(seekPlaying({ clientX: -10 }, store, { progress: { width: 100, left: 0 } })).toBe(0)
    expect(seekPlaying({ clientX: 500 }, store, { progress: { width: 100, left: 0 } })).toBe(200)
    expect(seekPlaying({ clientX: 10 }, store, { progress: { width: 0, left: 0 } })).toBeUndefined()
    Object.defineProperty(audio, 'duration', { value: NaN })
    expect(seekPlaying({ clientX: 10 }, store)).toBeUndefined()
    Object.defineProperty(audio, 'duration', { value: 200 })
    Object.defineProperty(progress, 'offsetWidth', { value: 100 })
    expect(seekPlaying({ clientX: 90 }, store)).toBe(180)
    runInAction(() => {
      store.state.currentPlayList = {}
    })
    expect(seekPlaying({ clientX: 10 }, store)).toBeUndefined()
    expect(progressBox(null)).toEqual({ width: 0, left: 0 })
    previewScrub({ clientX: 10 }, store)
    commitScrub({ clientX: 10 }, store)
    expect(seekPlaying({ clientX: 10 }, store, {
      player: { width: 100 },
      progress: { width: 100, left: 0 }
    })).toBeUndefined()

    const level = document.getElementsByClassName('audio-volume__level')[0]
    Object.defineProperty(document.getElementById('audio-volume'), 'offsetLeft', { value: 0 })
    Object.defineProperty(level, 'offsetLeft', { value: 0 })
    Object.defineProperty(level, 'offsetWidth', { value: 10 })
    expect(seekVolume({ clientX: 4 })).toBe(0.4)
  })

  test('plays, seeks, repeats, and shuffles without sound', async () => {
    const onToggle = jest.fn()
    const onSongChanged = jest.fn()
    const view = render(
      <AudioPlayer currentPlayList={{}} onToggle={onToggle} onSongChanged={onSongChanged} />
    )
    const songs = playlist(3)
    view.rerender(
      <AudioPlayer currentPlayList={songs} activeSongIndex={1} onToggle={onToggle} onSongChanged={onSongChanged} />
    )
    await flush()
    expect(store.state.currentSong.songName).toBe('Song 2')
    expect(document.getElementById('audio').src).toContain('example.com/two.mp3')

    view.rerender(
      <AudioPlayer currentPlayList={songs} activeSongIndex={0} onToggle={onToggle} onSongChanged={onSongChanged} />
    )
    await flush()
    expect(onSongChanged).toHaveBeenCalled()
    expect(store.state.currentSong.songName).toBe('Song 1')

    store.setAudio().toggle()
    expect(store.state.audioPlaying).toBe(false)
    store.setAudio().toggle({ shouldLoad: true })
    expect(store.state.audioPlaying).toBe(true)
    expect(store.setAudio().getVolume()).toBe(0)
    store.setAudio().setVolume(0.4).visual()
    store.setAudio().setVolume(0.4).element()
    expect(store.state.audioVolume).toBe(0.4)

    store.state.repeat = 'hold'
    store.setProgress().set('40%')
    expect(store.setProgress().get()).toBe('40%')
    store.state.audioElement.currentTime = 50
    fireEvent.timeUpdate(store.state.audioElement)
    store.setProgress().set()
    expect(store.setProgress().completed()).toBe(false)
    store.setProgress().set('100%')
    expect(store.state.audioProgress).toBe('100%')
    expect(store.setProgress().completed()).toBe(true)

    store.setAudio().setCurrentTime(3)
    expect(store.state.audioElement.currentTime).toBe(3)
    const removed = store.state.audioElement
    store.state.audioElement = undefined
    expect(store.setAudio().getDuration()).toBeUndefined()
    expect(store.setAudio().getCurrentTime()).toBeUndefined()
    expect(store.setAudio().setCurrentTime(1)).toBe('')
    store.setAudio().toggle()
    store.state.audioElement = removed

    store.setAudio().playFromTop({ auto: false, arrIndex: -4 })
    expect(store.state.currentSong.arrIndex).toBe(0)
    store.setAudio().playFromTop({ auto: false, arrIndex: 99 })
    expect(store.state.currentSong.arrIndex).toBe(2)
    store.setAudio().playFromTop({ arrIndex: 0 })
    await flush()

    store.state.repeat = 'off'
    store.setControls().toggleRepeat()
    store.setControls().toggleRepeat()
    store.setControls().toggleRepeat()
    expect(store.state.repeat).toBe('off')
    store.state.repeat = 'other'
    store.setControls().toggleRepeat()
    expect(store.state.repeat).toBe('other')

    store.state.audioElement.currentTime = 8
    store.setControls().skipBackward()
    expect(store.state.audioElement.currentTime).toBe(0)
    store.state.currentSong = { ...songs.songs[2], arrIndex: 2 }
    store.setControls().skipBackward()
    expect(store.state.currentSong.arrIndex).toBe(1)
    store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
    store.setControls().skipBackward()
    expect(store.state.currentSong.arrIndex).toBe(0)

    store.state.randomize = false
    store.state.repeat = 'off'
    store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
    store.setControls().skipForward()
    await flush()
    expect(store.state.currentSong.arrIndex).toBe(1)

    store.state.currentSong = { ...songs.songs[2], arrIndex: 2 }
    store.setControls().skipSong({ by: 1 })
    store.setControls().skipSong({ by: -10 })
    store.setControls().skipSong({ to: -1 })
    store.setControls().skipSong({})

    store.state.repeat = 'all'
    store.state.playedIndexes = [0, 1, 2]
    store.state.currentSong = { ...songs.songs[2], arrIndex: 2 }
    store.setControls().skipSong({ by: 1 })
    await flush()

    const random = jest.spyOn(Math, 'random')
    store.state.randomize = true
    store.state.repeat = 'off'
    store.state.playedIndexes = [0]
    store.state.currentPlayList = playlist(3)
    store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
    random.mockReturnValue(0.99)
    store.setControls().skipForward()
    await flush()
    expect(store.state.currentSong.arrIndex).toBe(2)

    store.state.playedIndexes = [0, 1, 2]
    store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
    random.mockReturnValue(0)
    store.setControls().skipForward()
    store.state.repeat = 'all'
    store.state.playedIndexes = [0, 1, 2]
    store.setControls().skipForward()

    store.state.currentPlayList = playlist(3)
    store.state.playedIndexes = [0]
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.99)
    const found = store.setControls().findRandomIndex()
    expect(found).not.toBe(0)
    random.mockRestore()

    store.state.currentPlayList = {}
    store.state.currentSong = {}
    store.setControls().skipSong({ by: 1 })
    store.state.audioPlaying = false
    store.state.audioElement = undefined
    store.state.currentPlayList = playlist()
    store.state.currentSong = { songName: 'Song 1', songUrl: '/music/Jazz/one.mp3', arrIndex: 0 }
    store.setControls().skipSong({ by: 1 })
    await flush()
    store.setAudio().setSong({ arrIndex: 0 })
    store.setAudio().playFromTop({ auto: false })

    const setAndPlay = store.setAudio().setAndPlay({ shouldLoad: true })
    await setAndPlay
    const originalGet = document.getElementById
    document.getElementById = () => {
      throw new Error('missing')
    }
    runInAction(() => {
      store.state.currentPlayList = playlist()
    })
    store.setAudio().setAndPlay({ shouldLoad: true })
    await flush()
    document.getElementById = originalGet
    runInAction(() => {
      store.state.currentPlayList = playlist()
      store.state.currentSong = { ...playlist().songs[0], arrIndex: 0 }
      store.state.audioElement = document.getElementById('audio')
    })
    await flush()

    const clickAudio = document.getElementById('audio')
    Object.defineProperty(clickAudio, 'duration', { value: 100, configurable: true })
    Object.defineProperty(document.getElementById('audio__player'), 'offsetWidth', { value: 100, configurable: true })
    Object.defineProperty(document.getElementById('progress'), 'offsetWidth', { value: 100, configurable: true })
    Object.defineProperty(document.getElementById('progress'), 'offsetLeft', { value: 0, configurable: true })
    Object.defineProperty(document.getElementById('audio-volume'), 'offsetLeft', { value: 0, configurable: true })
    const level = document.querySelector('.audio-volume__level')
    Object.defineProperty(level, 'offsetLeft', { value: 0, configurable: true })
    Object.defineProperty(level, 'offsetWidth', { value: 10, configurable: true })

    fireEvent.click(document.querySelector('.play, .pause'))
    fireEvent.click(document.querySelector('.random'))
    fireEvent.click(document.querySelector('.backward'))
    fireEvent.click(document.querySelector('.forward'))
    fireEvent.click(document.querySelector('.sync'))
    fireEvent.click(document.querySelector('.audio-volume__level'))
    fireEvent.click(document.querySelector('#progress'))
    fireEvent.pointerDown(document.querySelector('#progress'), { clientX: 25, button: 0 })
    fireEvent.pointerMove(window, { clientX: 60 })
    fireEvent.pointerUp(window, { clientX: 60 })
    fireEvent.pointerDown(document.querySelector('#progress'), { clientX: 10, button: 2 })
    store.state.scrubbing = true
    store.setProgress().set()
    expect(store.state.audioProgress).not.toBeUndefined()
    store.state.scrubbing = false
    previewScrub({ clientX: 10 }, store)
    commitScrub({ clientX: 10 }, store)
    bindScrub({ clientX: 10, button: 0 }, store)
    fireEvent.pointerUp(window, { clientX: 10 })
    fireEvent.click(document.querySelector('.volumeup, .volumedown, .volumeoff'))
  })

  test('ignores a seek before the audio file is ready', () => {
    const audio = document.createElement('audio')
    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      get() {
        return 0
      },
      set() {
        throw new Error('not ready')
      }
    })
    runInAction(() => {
      store.state.audioElement = audio
    })
    expect(store.setAudio().setCurrentTime(4)).toBe('')
    expect(store.setAudio().setCurrentTime(Number.NaN)).toBe('')
    const queued = document.createElement('audio')
    let seeking = true
    let queuedTime = 0
    Object.defineProperty(queued, 'seeking', { configurable: true, get: () => seeking })
    Object.defineProperty(queued, 'duration', { configurable: true, get: () => 80 })
    Object.defineProperty(queued, 'paused', { configurable: true, get: () => true })
    Object.defineProperty(queued, 'currentTime', {
      configurable: true,
      get: () => queuedTime,
      set(value) {
        queuedTime = value
      }
    })
    queued.play = () => Promise.resolve()
    runInAction(() => {
      store.state.audioElement = queued
      store.state.audioPlaying = true
      store.state.currentPlayList = playlist()
    })
    expect(store.setAudio().setCurrentTime(12)).toBe(12)
    expect(queuedTime).toBe(0)
    queued.__pendingTime = null
    queued.dispatchEvent(new Event('seeked'))
    expect(queuedTime).toBe(0)
    seeking = true
    expect(store.setAudio().setCurrentTime(30)).toBe(30)
    seeking = false
    queued.dispatchEvent(new Event('seeked'))
    expect(queuedTime).toBe(30)
    expect(store.setAudio().setCurrentTime(-4)).toBe(0)
    expect(store.setAudio().setCurrentTime(500)).toBe(80)
    expect(store.setAudio().prime('')).toBe(false)

    const live = document.createElement('audio')
    Object.defineProperty(live, 'paused', { configurable: true, get: () => false })
    const songs = playlist()
    runInAction(() => {
      store.state.audioElement = live
      store.state.currentPlayList = songs
    })
    store.setAudio().prime('https://example.com/two.mp3')
    store.setAudio().playFromTop({ auto: true, arrIndex: 1 })
    expect(store.state.audioPlaying).toBe(true)
    expect(store.state.currentSong.songName).toBe('Song 2')
    expect(store.state.playedIndexes).toEqual([1])
  })

  test('renders every icon and an unknown one', () => {
    const icons = ['random', 'sync', 'play', 'pause', 'forward', 'backward', 'volumeup', 'volumedown', 'volumeoff', 'nope']
    icons.forEach(icon => {
      const { unmount } = render(<PlayerIcon passClass={icon} icon={icon} onClick={() => {}} />)
      unmount()
    })
    render(<AudioControls />)
    render(<AudioProgress />)
    render(<AudioVolume />)
  })

  test('reactions advance, repeat, and sync the volume', async () => {
    document.body.innerHTML = '<audio id="audio"></audio><div id="audio__player"></div><div id="progress"></div>'
    const audio = document.getElementById('audio')
    Object.defineProperty(audio, 'duration', { value: 10, configurable: true })
    const songs = playlist(2)
    runInAction(() => {
      store.state.audioElement = audio
      store.startIndex = 1
      store.state.currentPlayList = songs
    })
    await flush()
    expect(store.state.currentSong.arrIndex).toBe(1)

    runInAction(() => {
      store.state.repeat = 'one'
      store.state.audioProgress = '100%'
    })
    await flush()

    runInAction(() => {
      store.state.repeat = 'all'
      store.state.playedIndexes = [0, 1]
      store.state.currentSong = { ...songs.songs[1], arrIndex: 1 }
      store.state.audioProgress = '0%'
    })
    runInAction(() => {
      store.state.audioProgress = '100%'
    })
    await flush()

    runInAction(() => {
      store.state.randomize = true
      store.state.repeat = 'hold'
      store.state.playedIndexes = []
      store.state.currentPlayList = songs
      store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
      store.state.audioProgress = '0%'
    })
    jest.spyOn(Math, 'random').mockReturnValue(0.99)
    runInAction(() => {
      store.state.audioProgress = '100%'
    })
    await flush()
    expect(store.state.currentSong.arrIndex).toBe(1)
    Math.random.mockRestore()

    runInAction(() => {
      store.state.randomize = false
      store.state.repeat = 'off'
      store.state.currentSong = { ...songs.songs[1], arrIndex: 1 }
      store.state.audioProgress = '99%'
    })
    runInAction(() => {
      store.state.audioProgress = '100%'
    })
    await flush()

    runInAction(() => {
      store.state.currentSong = { ...songs.songs[0], arrIndex: 0 }
      store.state.audioProgress = '0%'
    })
    runInAction(() => {
      store.state.audioProgress = '100%'
    })
    await flush()
    expect(store.state.currentSong.arrIndex).toBe(1)

    runInAction(() => {
      store.state.audioElement = audio
      store.state.audioVolume = 0.3
    })
    await flush()
    expect(audio.volume).toBe(0.3)
  })
})
