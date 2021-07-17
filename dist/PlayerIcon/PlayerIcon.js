"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.iconToRender = void 0;

var _react = _interopRequireDefault(require("react"));

require("./PlayerIcon.scss");

var _Random = _interopRequireDefault(require("./Icons/Random"));

var _Sync = _interopRequireDefault(require("./Icons/Sync"));

var _Play = _interopRequireDefault(require("./Icons/Play"));

var _Pause = _interopRequireDefault(require("./Icons/Pause"));

var _Forward = _interopRequireDefault(require("./Icons/Forward"));

var _Backward = _interopRequireDefault(require("./Icons/Backward"));

var _VolumeUp = _interopRequireDefault(require("./Icons/VolumeUp"));

var _VolumeDown = _interopRequireDefault(require("./Icons/VolumeDown"));

var _VolumeOff = _interopRequireDefault(require("./Icons/VolumeOff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const iconToRender = props => {
  const requestedIcon = props.icon;

  switch (requestedIcon) {
    case 'random':
      return /*#__PURE__*/_react.default.createElement(_Random.default, null);

    case 'sync':
      return /*#__PURE__*/_react.default.createElement(_Sync.default, null);

    case 'play':
      return /*#__PURE__*/_react.default.createElement(_Play.default, null);

    case 'pause':
      return /*#__PURE__*/_react.default.createElement(_Pause.default, null);

    case 'forward':
      return /*#__PURE__*/_react.default.createElement(_Forward.default, null);

    case 'backward':
      return /*#__PURE__*/_react.default.createElement(_Backward.default, null);

    case 'volumeup':
      return /*#__PURE__*/_react.default.createElement(_VolumeUp.default, null);

    case 'volumedown':
      return /*#__PURE__*/_react.default.createElement(_VolumeDown.default, null);

    case 'volumeoff':
      return /*#__PURE__*/_react.default.createElement(_VolumeOff.default, null);

    default:
      break;
  }
};

exports.iconToRender = iconToRender;

const PlayerIcon = props => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(props.passClass, " icon"),
    onClick: props.onClick
  }, iconToRender(props));
};

var _default = PlayerIcon;
exports.default = _default;