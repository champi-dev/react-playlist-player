"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.toggleAudio = exports.exportProps = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _mobxReact = require("mobx-react");

var _store = _interopRequireDefault(require("./store/store"));

require("./AudioPlayer.scss");

var _SongInfo = _interopRequireDefault(require("./SongInfo/SongInfo"));

var _AudioControls = _interopRequireDefault(require("./AudioControls/AudioControls"));

var _AudioProgress = _interopRequireDefault(require("./AudioProgress/AudioProgress"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _objectUtils = require("./utils/objectUtils");

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const exportProps = {
  onToggle: () => {},
  onSongChanged: () => {}
};
exports.exportProps = exportProps;

let AudioPlayer = (0, _mobxReact.observer)(_class = class AudioPlayer extends _react.Component {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "onPlaylistChanged", function (prevProps) {
      let testConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if ((0, _objectUtils.testCond)(testConfig, 'ifBool', !(0, _isEqual.default)(prevProps.currentPlayList, _this.props.currentPlayList))) {
        _store.default.setAudio().setPlaylist(_this.props.currentPlayList);
      }
    });
  }

  componentDidMount() {
    const {
      onToggle
    } = this.props;
    if (onToggle) exportProps.onToggle = onToggle;
    const {
      onSongChanged
    } = this.props;
    if (onSongChanged) exportProps.onSongChanged = onSongChanged;
  }

  componentDidUpdate(prevProps) {
    this.onPlaylistChanged(prevProps);
  }

  render() {
    const SongInfoComponent = _store.default.canPlay && /*#__PURE__*/_react.default.createElement(_SongInfo.default, null);

    const AudioElement = /*#__PURE__*/_react.default.createElement("audio", {
      id: "audio",
      onTimeUpdate: () => _store.default.setProgress().set(),
      preload: "auto"
    }, /*#__PURE__*/_react.default.createElement("source", {
      src: _store.default.state.currentSong.songUrl,
      type: "audio/mp3"
    }));

    return /*#__PURE__*/_react.default.createElement("div", {
      className: 'audio'
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "audio__player",
      className: 'audio__player'
    }, AudioElement, /*#__PURE__*/_react.default.createElement("div", {
      className: 'audio__controls'
    }, SongInfoComponent, /*#__PURE__*/_react.default.createElement("div", {
      className: 'group'
    }, /*#__PURE__*/_react.default.createElement(_AudioControls.default, {
      onToggle: this.props.onToggle
    }), /*#__PURE__*/_react.default.createElement(_AudioProgress.default, null)))));
  }

}) || _class;

const toggleAudio = _store.default.setAudio().toggle;

exports.toggleAudio = toggleAudio;
var _default = AudioPlayer;
exports.default = _default;