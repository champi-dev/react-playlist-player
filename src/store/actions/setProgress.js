const setProgress = () =>
  function() {
    return {
      completed: () => this.state.audioProgress === '100%',

      get: () => this.state.audioProgress,

      set: manualProgress => {
        if (manualProgress == null && this.state.scrubbing) return
        this.state.audioProgress =
          manualProgress ||
          `${Math.round((this.setAudio().getCurrentTime() / this.setAudio().getDuration()) * 100 * 10) / 10}%`
      }
    }
  }

export default setProgress
