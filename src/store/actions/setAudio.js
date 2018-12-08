import { objectHasProps } from '../../../utils/objectUtils'

const setAudio = () =>
  function() {
    return {
      toggle: ({ shouldLoad } = {}) => {
        if (this.state.audioElement) {
          if (shouldLoad) this.setAudio().load()
          this.state.audioPlaying
            ? this.setAudio().pause()
            : this.setAudio().play()
        }
      },

      play: () => {
        this.state.audioElement.play()
        this.state.audioPlaying = true
      },

      pause: () => {
        this.state.audioElement.pause()
        this.state.audioPlaying = false
      },

      resetPlay: () => {
        this.setAudio().toggle()
        this.setAudio().setCurrentTime(0)
        this.setProgress().set('0%')
      },

      playFromTop: ({ auto } = {}) => {
        this.state.playedIndexes = []
        this.setAudio().resetPlay()
        this.setAudio().setSong({ arrIndex: 0 })
        if (auto) this.setAudio().setAndPlay({ shouldLoad: true })
      },

      load: () => this.state.audioElement.load(),

      getVolume: () => this.state.audioElement.volume,

      getDuration: () =>
        this.state.audioElement ? this.state.audioElement.duration : undefined,

      getCurrentTime: () =>
        this.state.audioElement
          ? this.state.audioElement.currentTime
          : undefined,

      setCurrentTime: pos =>
        this.state.audioElement
          ? (this.state.audioElement.currentTime = pos)
          : '',

      setElement: () =>
        Promise.resolve(
          (this.state.audioElement = document.getElementById('audio'))
        ),

      setPlaylist: playlist => (this.state.currentPlayList = { ...playlist }),

      setSong: ({ arrIndex }) =>
        objectHasProps(this.state.currentPlayList) &&
        (this.state.currentSong = {
          ...this.state.currentPlayList.songs[arrIndex],
          arrIndex
        }),

      setSongBy: by => {
        this.setAudio().setSong({
          arrIndex: this.state.currentSong.arrIndex + by
        })
      },

      setVolume: volume => ({
        visual: () => (this.state.audioVolume = volume),
        element: () => (this.state.audioElement.volume = volume)
      }),

      setAndPlay: ({ shouldLoad } = {}) => {
        const saveIndex = () => {
          const foundIndex = this.state.playedIndexes.find(
            i => i === this.state.currentSong.arrIndex
          )
          if (foundIndex === undefined)
            this.state.playedIndexes.push(this.state.currentSong.arrIndex)
        }

        if (this.canPlay) {
          this.setAudio()
            .setElement()
            .then(() => {
              this.setAudio().toggle({ shouldLoad })
              saveIndex()
            })
            .catch(e => e)
        }
      }
    }
  }

export default setAudio
