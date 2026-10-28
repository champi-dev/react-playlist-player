import { objectHasProps } from '../../utils/objectUtils'
import { resolveMediaSrc } from '../../utils/mediaSrc'
import { attachSource, ensureAudioElement, sameMedia } from '../../utils/audioStream'
import { exportProps } from '../../index'

function beginPlayback(element) {
  const pending = element.play()
  if (pending && typeof pending.catch === 'function') pending.catch(() => {})
  return pending
}

const setAudio = () =>
  function() {
    return {
      prime: url => {
        const element = this.state.audioElement || ensureAudioElement()
        if (!element || !url) return false
        this.state.audioElement = element
        attachSource(element, url)
        // The click already started this file. resetPlay must not pause it.
        this.state.audioPlaying = false
        return beginPlayback(element) || true
      },

      toggle: () => {
        if (this.state.audioElement) {
          this.state.audioPlaying
            ? this.setAudio().pause()
            : this.setAudio().play()

          exportProps.onToggle({audioPlaying: this.state.audioPlaying})
        }
      },

      play: () => {
        const element = this.state.audioElement
        if (element) {
          const song = this.state.currentSong || {}
          attachSource(element, resolveMediaSrc(song.songUrl))
          beginPlayback(element)
        }
        this.state.audioPlaying = true
      },

      pause: () => {
        this.state.audioElement.pause()
        this.state.audioPlaying = false
      },

      resetPlay: () => {
        if (this.state.audioPlaying) this.setAudio().pause()
        const element = this.state.audioElement
        if (element && element.readyState) this.setAudio().setCurrentTime(0)
        this.setProgress().set('0%')
      },

      playFromTop: ({ auto, arrIndex = 0 } = {}) => {
        const songs = (this.state.currentPlayList && this.state.currentPlayList.songs) || []
        const index = songs.length ? Math.min(Math.max(arrIndex, 0), songs.length - 1) : 0
        const song = songs[index] || {}
        const element = this.state.audioElement
        const url = resolveMediaSrc(song.songUrl)
        // prime() may already be streaming this file. Seeking or playing again restarts it.
        const streaming = !!(element && url && sameMedia(element, url) && element.paused === false)
        this.state.playedIndexes = []
        if (!streaming) this.setAudio().resetPlay()
        this.setAudio().setSong({ arrIndex: index })
        if (!auto) return
        if (streaming) {
          this.state.audioPlaying = true
          this.state.playedIndexes.push(index)
          return
        }
        this.setAudio().setAndPlay()
      },

      getVolume: () => this.state.audioElement.volume,

      getDuration: () =>
        this.state.audioElement ? this.state.audioElement.duration : undefined,

      getCurrentTime: () =>
        this.state.audioElement
          ? this.state.audioElement.currentTime
          : undefined,

      setCurrentTime: pos => {
        const element = this.state.audioElement
        if (!element || !Number.isFinite(pos)) return ''
        const duration = element.duration
        let time = pos
        if (Number.isFinite(duration) && duration > 0) time = Math.min(Math.max(pos, 0), duration)
        else if (pos < 0) time = 0

        const apply = value => {
          try {
            element.currentTime = value
          } catch (error) {
            return ''
          }
          this.setProgress().set()
          // A seek can pause the element while the store still says it is playing.
          if (this.state.audioPlaying && element.paused) beginPlayback(element)
          return value
        }

        // Overlapping seeks leave the media element stuck in `seeking`.
        if (element.seeking) {
          element.__pendingTime = time
          if (!element.__onSeeked) {
            element.__onSeeked = () => {
              element.removeEventListener('seeked', element.__onSeeked)
              element.__onSeeked = null
              const pending = element.__pendingTime
              element.__pendingTime = null
              if (Number.isFinite(pending)) apply(pending)
            }
            element.addEventListener('seeked', element.__onSeeked)
          }
          return time
        }
        return apply(time)
      },

      setElement: () =>
        Promise.resolve().then(() => {
          this.state.audioElement = ensureAudioElement()
          return this.state.audioElement
        }),

      setPlaylist: playlist => (this.state.currentPlayList = { ...playlist }),

      setSong: ({ arrIndex }) => {
        if (!objectHasProps(this.state.currentPlayList)) return
        this.state.currentSong = {
          ...this.state.currentPlayList.songs[arrIndex],
          arrIndex
        }
        if (this.state.audioElement) {
          attachSource(
            this.state.audioElement,
            resolveMediaSrc(this.state.currentSong.songUrl)
          )
        }
      },

      setSongBy: by => {
        this.setAudio().setSong({
          arrIndex: this.state.currentSong.arrIndex + by
        })
      },

      setVolume: volume => ({
        visual: () => (this.state.audioVolume = volume),
        element: () => (this.state.audioElement.volume = volume)
      }),

      setAndPlay: () => {
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
              saveIndex()
              this.setAudio().toggle()
            })
            .catch(e => e)
        }
      }
    }
  }

export default setAudio
