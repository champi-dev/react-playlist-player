"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.seekVolume = exports.toggleVolume = exports.volumeClass = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _store = _interopRequireDefault(require("../store/store"));

require("./AudioVolume.scss");

var _PlayerIcon = _interopRequireDefault(require("../PlayerIcon/PlayerIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const volumeClass = state => {
  if (state.audioVolume >= 0.5) {
    return 'volumeup';
  } else if (state.audioVolume < 0.5 && state.audioVolume > 0) {
    return 'volumedown';
  } else {
    return 'volumeoff';
  }
};

exports.volumeClass = volumeClass;

const toggleVolume = state => state.audioVolume > 0.0 ? 0.0 : 1.0;

exports.toggleVolume = toggleVolume;

const seekVolume = function seekVolume(e) {
  let testConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const desiredPos = e.clientX;
  const volumeOffsetLeft = getVolumeOffsetLeft(testConfig);
  const volumeBarOffsetLeft = getVolumeBarOffsetLeft(testConfig);
  const volumeBarWidth = getVolumeBarWidth(testConfig);
  return Math.round((desiredPos - volumeOffsetLeft - volumeBarOffsetLeft) / volumeBarWidth * 10) / 10;
};

exports.seekVolume = seekVolume;

const getVolumeOffsetLeft = _ref => {
  let {
    volume
  } = _ref;
  if (volume) return volume.offsetLeft;
  return document.getElementById('audio-volume').offsetLeft;
};

const getVolumeBarOffsetLeft = _ref2 => {
  let {
    volumeBar
  } = _ref2;
  if (volumeBar) return volumeBar.offsetLeft;
  return document.getElementsByClassName('audio-volume__level')[0].offsetLeft;
};

const getVolumeBarWidth = _ref3 => {
  let {
    volumeBar
  } = _ref3;
  if (volumeBar) return volumeBar.width;
  return document.getElementsByClassName('audio-volume__level')[0].offsetWidth;
};

const AudioVolume = (0, _mobxReact.observer)(() => {
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "audio-volume",
    className: 'audio-volume'
  }, /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
    passClass: volumeClass(_store.default.state),
    icon: volumeClass(_store.default.state),
    onClick: () => _store.default.setAudio().setVolume(toggleVolume(_store.default.state)).visual()
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: 'audio-volume__level',
    onClick: e => _store.default.setAudio().setVolume(seekVolume(e)).visual()
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: 'audio-volume__fill',
    style: {
      width: "".concat(_store.default.state.audioVolume * 100, "%")
    }
  })));
});
var _default = AudioVolume;
exports.default = _default;