"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.repeatClasses = exports.playClasses = exports.randomClasses = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _objectUtils = require("../utils/objectUtils");

var _store = _interopRequireDefault(require("../store/store"));

require("./AudioControls.scss");

var _PlayerIcon = _interopRequireDefault(require("../PlayerIcon/PlayerIcon"));

var _AudioVolume = _interopRequireDefault(require("../AudioVolume/AudioVolume"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const randomClasses = _ref => {
  let {
    randomize
  } = _ref;
  return randomize ? 'random active' : 'random';
};

exports.randomClasses = randomClasses;

const playClasses = _ref2 => {
  let {
    audioPlaying
  } = _ref2;
  return audioPlaying ? 'pause' : 'play';
};

exports.playClasses = playClasses;

const repeatClasses = _ref3 => {
  let {
    repeat
  } = _ref3;

  switch (repeat) {
    case 'off':
      return 'sync';

    case 'all':
      return 'sync active';

    case 'one':
      return 'sync active active--twice';

    default:
      break;
  }
};

exports.repeatClasses = repeatClasses;

const toggleHandler = () => {
  if ((0, _objectUtils.objectHasProps)(_store.default.state.currentPlayList)) {
    _store.default.setAudio().toggle();
  }
};

const AudioControls = (0, _mobxReact.observer)(props => /*#__PURE__*/_react.default.createElement("div", {
  className: 'icons'
}, /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
  passClass: randomClasses(_store.default.state),
  icon: "random",
  onClick: () => _store.default.setControls().toggleRandomize()
}), /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
  passClass: "backward",
  icon: "backward",
  onClick: () => _store.default.setControls().skipBackward()
}), /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
  passClass: playClasses(_store.default.state),
  icon: playClasses(_store.default.state),
  onClick: () => toggleHandler(props)
}), /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
  passClass: "forward",
  icon: "forward",
  onClick: () => _store.default.setControls().skipForward()
}), /*#__PURE__*/_react.default.createElement(_PlayerIcon.default, {
  passClass: repeatClasses(_store.default.state),
  icon: "sync",
  onClick: () => _store.default.setControls().toggleRepeat()
}), /*#__PURE__*/_react.default.createElement(_AudioVolume.default, null)));
var _default = AudioControls;
exports.default = _default;