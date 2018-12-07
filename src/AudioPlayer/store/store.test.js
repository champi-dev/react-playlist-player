import store from './store'

describe('store', () => {
  describe('state', () => {
    it('has correct initial values', () => {
      expect(store.state).toEqual({
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
      })
    })
  })
})
