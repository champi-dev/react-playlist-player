"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../index");

const setControls = () => function () {
  var _this = this;

  return {
    toggleRandomize: () => {
      this.state.randomize = !this.state.randomize;
    },
    toggleRepeat: () => {
      const setRepeat = repeat => {
        this.state.repeat = repeat;
      };

      switch (this.state.repeat) {
        case 'off':
          setRepeat('all');
          break;

        case 'all':
          setRepeat('one');
          break;

        case 'one':
          setRepeat('off');
          break;

        default:
          break;
      }
    },
    skipBackward: () => {
      if (this.state.playedIndexes.length > 1) {
        this.state.backwardTimes += 1;
        this.setControls().skipSong({
          to: this.state.playedIndexes[this.state.playedIndexes.length - this.state.backwardTimes - 1]
        });

        if (this.state.backwardTimes === this.state.playedIndexes.length - 1) {
          this.state.backwardTimes = 0;
          this.state.playedIndexes = [];
        }
      }
    },
    skipForward: () => {
      if (this.state.randomize) {
        const index = this.setControls().findRandomIndex();

        if (!index && this.setControls().playedAllSongs()) {
          this.state.repeat === 'all' ? this.setAudio().playFromTop({
            auto: true
          }) : this.setAudio().playFromTop({
            auto: null
          });
        } else {
          this.setControls().skipSong({
            to: index
          });
        }
      } else {
        this.setControls().skipSong({
          by: 1
        });
      }
    },
    skipSong: function skipSong() {
      let {
        by,
        to
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      const skipper = skipFn => {
        _this.setAudio().resetPlay();

        skipFn();

        _this.setAudio().setAndPlay({
          shouldLoad: true
        });

        _index.exportProps.onSongChanged({
          currentSong: _this.state.currentSong
        });
      };

      if (_this.songAndPlaylistAreSetted) {
        if (_this.state.repeat === 'all' && _this.setControls().playedAllSongs() && by > 0) {
          _this.setAudio().playFromTop({
            auto: true
          });

          return;
        }

        if (typeof by === 'number') {
          const nextIndex = _this.state.currentSong.arrIndex + by;

          if (nextIndex >= 0 && nextIndex < _this.state.currentPlayList.songs.length) {
            skipper(() => _this.setAudio().setSongBy(by));
          }
        } else if (typeof to === 'number' && to >= 0) {
          skipper(() => _this.setAudio().setSong({
            songs: _this.state.currentPlayList.songs,
            arrIndex: to
          }));
        }
      }
    },
    findRandomIndex: () => {
      const plLength = this.state.currentPlayList.songs.length - 1;

      const randomIndex = () => Math.round(Math.random() * plLength * 10 / 10);

      const generatedIndex = randomIndex();

      if (this.state.playedIndexes.find(i => i === generatedIndex) === undefined) {
        return generatedIndex;
      } else if (this.setControls().playedAllSongs()) {
        return;
      }

      return this.setControls().findRandomIndex();
    },
    playedAllSongs: () => this.state.currentPlayList.songs.length === this.state.playedIndexes.length
  };
};

var _default = setControls;
exports.default = _default;