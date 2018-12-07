const reactions = store => [
  {
    data: () => store.state.currentPlayList,
    effect: () => {
      store.setAudio().playFromTop({ auto: true })
    }
  },

  {
    data: () => store.state.repeat === 'one' && store.setProgress().completed(),
    effect: shouldRepeatOne =>
      shouldRepeatOne && store.setControls().skipSong({ by: 0 })
  },

  {
    data: () =>
      store.state.repeat === 'all' &&
      store.setProgress().completed() &&
      store.setControls().playedAllSongs(),
    effect: shouldRepeatPlayList =>
      shouldRepeatPlayList && store.setAudio().playFromTop({ auto: true })
  },

  {
    data: () => store.state.randomize && store.setProgress().completed(),
    effect: shouldPlayRandom => {
      if (shouldPlayRandom) {
        const index = store.setControls().findRandomIndex()
        index && store.setControls().skipSong({ to: index })
      }
    }
  },

  {
    data: () => store.setProgress().completed() && store.state.repeat === 'off',
    effect: shouldPlayNextSong => {
      if (shouldPlayNextSong) {
        if (
          store.state.currentSong.arrIndex + 1 <
          store.state.currentPlayList.songs.length
        ) {
          store.setControls().skipSong({ by: 1 })
        } else {
          store.setAudio().resetPlay()
        }
      }
    }
  },

  {
    data: () => store.shouldSyncVolume,
    effect: ({ elementIsSetted, volumeVisual }) =>
      elementIsSetted &&
      store
        .setAudio()
        .setVolume(volumeVisual)
        .element()
  }
]

export default reactions
