"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _store = _interopRequireDefault(require("../store/store"));

require("./SongInfo.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SongInfo = (0, _mobxReact.observer)(() => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: 'song-info'
  }, /*#__PURE__*/_react.default.createElement("img", {
    className: 'song-info__cover',
    src: _store.default.state.currentPlayList.playlistCoverUrl,
    alt: "cover"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: 'song-info__text'
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: 'title'
  }, _store.default.state.currentSong.songName), /*#__PURE__*/_react.default.createElement("span", {
    className: 'subtitle'
  }, _store.default.state.currentPlayList.bandName)));
});
var _default = SongInfo;
exports.default = _default;