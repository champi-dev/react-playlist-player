"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _objectUtils = require("../../utils/objectUtils");

var _index = require("../../index");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setAudio = () => function () {
  var _this = this;

  return {
    toggle: function toggle() {
      let {
        shouldLoad
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_this.state.audioElement) {
        if (shouldLoad) _this.setAudio().load();
        _this.state.audioPlaying ? _this.setAudio().pause() : _this.setAudio().play();

        _index.exportProps.onToggle({
          audioPlaying: _this.state.audioPlaying
        });
      }
    },
    play: () => {
      this.state.audioElement.play();
      this.state.audioPlaying = true;
    },
    pause: () => {
      this.state.audioElement.pause();
      this.state.audioPlaying = false;
    },
    resetPlay: () => {
      this.setAudio().toggle();
      this.setAudio().setCurrentTime(0);
      this.setProgress().set('0%');
    },
    playFromTop: function playFromTop() {
      let {
        auto
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _this.state.playedIndexes = [];

      _this.setAudio().resetPlay();

      _this.setAudio().setSong({
        arrIndex: 0
      });

      if (auto) _this.setAudio().setAndPlay({
        shouldLoad: true
      });
    },
    load: () => this.state.audioElement.load(),
    getVolume: () => this.state.audioElement.volume,
    getDuration: () => this.state.audioElement ? this.state.audioElement.duration : undefined,
    getCurrentTime: () => this.state.audioElement ? this.state.audioElement.currentTime : undefined,
    setCurrentTime: pos => this.state.audioElement ? this.state.audioElement.currentTime = pos : '',
    setElement: () => Promise.resolve(this.state.audioElement = document.getElementById('audio')),
    setPlaylist: playlist => this.state.currentPlayList = _objectSpread({}, playlist),
    setSong: _ref => {
      let {
        arrIndex
      } = _ref;
      return (0, _objectUtils.objectHasProps)(this.state.currentPlayList) && (this.state.currentSong = _objectSpread(_objectSpread({}, this.state.currentPlayList.songs[arrIndex]), {}, {
        arrIndex
      }));
    },
    setSongBy: by => {
      this.setAudio().setSong({
        arrIndex: this.state.currentSong.arrIndex + by
      });
    },
    setVolume: volume => ({
      visual: () => this.state.audioVolume = volume,
      element: () => this.state.audioElement.volume = volume
    }),
    setAndPlay: function setAndPlay() {
      let {
        shouldLoad
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      const saveIndex = () => {
        const foundIndex = _this.state.playedIndexes.find(i => i === _this.state.currentSong.arrIndex);

        if (foundIndex === undefined) _this.state.playedIndexes.push(_this.state.currentSong.arrIndex);
      };

      if (_this.canPlay) {
        _this.setAudio().setElement().then(() => {
          saveIndex();

          _this.setAudio().toggle({
            shouldLoad
          });
        }).catch(e => e);
      }
    }
  };
};

var _default = setAudio;
exports.default = _default;