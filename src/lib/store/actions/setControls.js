const setControls = () =>
  function() {
    return {
      toggleRandomize: () => {
        this.state.randomize = !this.state.randomize
      },

      toggleRepeat: () => {
        const setRepeat = repeat => {
          this.state.repeat = repeat
        }

        switch (this.state.repeat) {
          case 'off':
            setRepeat('all')
            break
          case 'all':
            setRepeat('one')
            break
          case 'one':
            setRepeat('off')
            break
          default:
            break
        }
      },

      skipBackward: () => {
        if (this.state.playedIndexes.length > 1) {
          this.state.backwardTimes += 1
          this.setControls().skipSong({
            to: this.state.playedIndexes[this.state.playedIndexes.length - this.state.backwardTimes - 1]
          })
          if (this.state.backwardTimes === this.state.playedIndexes.length - 1) {
            this.state.backwardTimes = 0
            this.state.playedIndexes = []
          }
        }
      },

      skipForward: () => {
        if (this.state.randomize) {
          const index = this.setControls().findRandomIndex()
          if (!index && this.setControls().playedAllSongs()) {
            this.state.repeat === 'all'
              ? this.setAudio().playFromTop({ auto: true })
              : this.setAudio().playFromTop({ auto: null })
          } else {
            this.setControls().skipSong({ to: index })
          }
        } else {
          this.setControls().skipSong({ by: 1 })
        }
      },

      skipSong: ({ by, to } = {}) => {
        const skipper = skipFn => {
          this.setAudio().resetPlay()
          skipFn()
          this.setAudio().setAndPlay({ shouldLoad: true })
        }

        if (this.songAndPlaylistAreSetted) {
          if (this.state.repeat === 'all' && this.setControls().playedAllSongs() && by > 0) {
            this.setAudio().playFromTop({ auto: true })
            return
          }
          if (typeof by === 'number') {
            const nextIndex = this.state.currentSong.arrIndex + by
            if (nextIndex >= 0 && nextIndex < this.state.currentPlayList.songs.length) {
              skipper(() => this.setAudio().setSongBy(by))
            }
          } else if (typeof to === 'number' && to >= 0) {
            skipper(() => this.setAudio().setSong({ songs: this.state.currentPlayList.songs, arrIndex: to }))
          }
        }
      },

      findRandomIndex: () => {
        const plLength = this.state.currentPlayList.songs.length - 1
        const randomIndex = () => Math.round((Math.random() * plLength * 10) / 10)
        const generatedIndex = randomIndex()

        if (this.state.playedIndexes.find(i => i === generatedIndex) === undefined) {
          return generatedIndex
        } else if (this.setControls().playedAllSongs()) {
          return
        }
        return this.setControls().findRandomIndex()
      },

      playedAllSongs: () => this.state.currentPlayList.songs.length === this.state.playedIndexes.length
    }
  }

export default setControls
