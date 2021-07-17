"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const setProgress = () => function () {
  return {
    completed: () => this.state.audioProgress === '100%',
    get: () => this.state.audioProgress,
    set: manualProgress => {
      this.state.audioProgress = manualProgress || "".concat(Math.round(this.setAudio().getCurrentTime() / this.setAudio().getDuration() * 100 * 10) / 10, "%");
    }
  };
};

var _default = setProgress;
exports.default = _default;