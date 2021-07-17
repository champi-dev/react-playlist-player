"use strict";

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.array.reverse.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mobx = require("mobx");

var _objectUtils = require("../utils/objectUtils");

var _reactions = _interopRequireDefault(require("./reactions"));

var _setAudio = _interopRequireDefault(require("./actions/setAudio"));

var _setControls = _interopRequireDefault(require("./actions/setControls"));

var _setProgress = _interopRequireDefault(require("./actions/setProgress"));

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

let Store = (_class = class Store {
  constructor() {
    _initializerDefineProperty(this, "state", _descriptor, this);

    _initializerDefineProperty(this, "setAudio", _descriptor2, this);

    _initializerDefineProperty(this, "setControls", _descriptor3, this);

    _initializerDefineProperty(this, "setProgress", _descriptor4, this);

    (0, _reactions.default)(this).forEach(r => (0, _mobx.reaction)(r.data, r.effect));
  }

  get canPlay() {
    return (0, _objectUtils.objectHasProps)(this.state.currentPlayList);
  }

  get shouldSyncVolume() {
    return {
      elementIsSetted: !!this.state.audioElement,
      volumeVisual: this.state.audioVolume
    };
  }

  get songAndPlaylistAreSetted() {
    return (0, _objectUtils.objectHasProps)(this.state.currentSong) && (0, _objectUtils.objectHasProps)(this.state.currentPlayList);
  }

}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "state", [_mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      audioElement: undefined,
      audioVolume: 1,
      audioProgress: '0%',
      audioPlaying: false,
      randomize: false,
      repeat: 'off',
      playedIndexes: [],
      backwardTimes: 0,
      currentSong: {},
      currentPlayList: {}
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "setAudio", [_mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _setAudio.default)().bind(this);
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "setControls", [_mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _setControls.default)().bind(this);
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "setProgress", [_mobx.action], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _setProgress.default)().bind(this);
  }
}), _applyDecoratedDescriptor(_class.prototype, "canPlay", [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "canPlay"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "shouldSyncVolume", [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "shouldSyncVolume"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "songAndPlaylistAreSetted", [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "songAndPlaylistAreSetted"), _class.prototype)), _class);

var _default = new Store();

exports.default = _default;