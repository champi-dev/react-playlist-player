"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.seekPlaying = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _store = _interopRequireDefault(require("../store/store"));

require("./AudioProgress.scss");

var _formatTime = require("../utils/formatTime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seekPlaying = function seekPlaying(e, store) {
  let testConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!store.canPlay) return undefined;
  const desiredPos = e.clientX;
  const playerWidth = getPlayerWidth(testConfig);
  const progressEl = getProgressEl(testConfig);
  const progressWidth = progressEl.offsetWidth;
  const progressOffsetLeft = progressEl.offsetLeft;
  let positionToSet = 0;

  if (playerWidth === progressWidth) {
    positionToSet = Math.round(desiredPos / progressWidth * store.setAudio().getDuration());
  } else if (playerWidth > progressWidth) {
    positionToSet = Math.round((desiredPos - progressOffsetLeft) / progressWidth * store.setAudio().getDuration());
  }

  return positionToSet;
};

exports.seekPlaying = seekPlaying;

const getPlayerWidth = _ref => {
  let {
    player
  } = _ref;
  if (player) return player.width;
  return document.getElementById('audio__player').offsetWidth;
};

const getProgressEl = _ref2 => {
  let {
    progress
  } = _ref2;
  if (progress) return {
    offsetWidth: progress.width,
    offsetLeft: progress.left
  };
  return document.getElementById('progress');
};

const AudioProgress = (0, _mobxReact.observer)(() => {
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "progress",
    className: 'progress',
    onClick: e => _store.default.setAudio().setCurrentTime(seekPlaying(e, _store.default))
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: 'current-time time'
  }, (0, _formatTime.formatTime)(_store.default.setAudio().getCurrentTime())), /*#__PURE__*/_react.default.createElement("div", {
    className: 'progress__fill',
    style: {
      width: _store.default.setProgress().get()
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: 'total-time time'
  }, (0, _formatTime.formatTime)(_store.default.setAudio().getDuration())));
});
var _default = AudioProgress;
exports.default = _default;