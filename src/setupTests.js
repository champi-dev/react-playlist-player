// Tests must never play sound. jsdom has no speakers; this also blocks a
// real media element if one is ever constructed.
HTMLMediaElement.prototype.play = function play() {
  this.muted = true
  this.volume = 0
  return Promise.resolve()
}
HTMLMediaElement.prototype.pause = function pause() {}
HTMLMediaElement.prototype.load = function load() {}
