import { observable, action, computed, reaction } from 'mobx'
import { objectHasProps } from '../utils/objectUtils'
import reactions from './reactions'
import setAudio from './actions/setAudio'
import setControls from './actions/setControls'
import setProgress from './actions/setProgress'

class Store {
  constructor() {
    reactions(this).forEach(r => reaction(r.data, r.effect))
  }

  @observable state = {
    audioElement: undefined,
    audioVolume: 1,
    audioProgress: '0%',
    audioPlaying: false,
    randomize: false,
    repeat: 'off',
    playedIndexes: [],
    backwardTimes: 0,
    currentSong: {},
    currentPlayList: {}
  }

  @action setAudio = setAudio().bind(this)
  @action setControls = setControls().bind(this)
  @action setProgress = setProgress().bind(this)

  @computed get canPlay() {
    return objectHasProps(this.state.currentPlayList)
  }
  @computed get shouldSyncVolume() {
    return {
      elementIsSetted: !!this.state.audioElement,
      volumeVisual: this.state.audioVolume
    }
  }
  @computed get songAndPlaylistAreSetted() {
    return (
      objectHasProps(this.state.currentSong) &&
      objectHasProps(this.state.currentPlayList)
    )
  }
}

export default new Store()
