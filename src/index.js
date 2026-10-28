import React, { Component } from "react";
import { observer } from "mobx-react";
import store from "./store/store";
import "./AudioPlayer.scss";
import SongInfo from "./SongInfo/SongInfo";
import AudioControls from "./AudioControls/AudioControls";
import AudioProgress from "./AudioProgress/AudioProgress";
import { objectHasProps } from "./utils/objectUtils";
import { ensureAudioElement } from "./utils/audioStream";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDQIw1I-nOVu2Tk_qpYdPDVLAC79HIioT4",
  authDomain: "react-playlist-player-e1bba.firebaseapp.com",
  projectId: "react-playlist-player-e1bba",
  storageBucket: "react-playlist-player-e1bba.firebasestorage.app",
  messagingSenderId: "847090071206",
  appId: "1:847090071206:web:530799dddcab9bcd84e667",
};

// const app =
initializeApp(firebaseConfig);

export const exportProps = {
  onToggle: () => {},
  onSongChanged: () => {},
};

@observer
class AudioPlayer extends Component {
  componentDidMount() {
    const { onToggle } = this.props;
    if (onToggle) exportProps.onToggle = onToggle;

    const { onSongChanged } = this.props;
    if (onSongChanged) exportProps.onSongChanged = onSongChanged;
    const audio = ensureAudioElement();
    audio.ontimeupdate = () => store.setProgress().set();
    store.setAudio().setElement();
  }

  componentDidUpdate(prevProps) {
    const { onToggle, onSongChanged } = this.props;
    if (onToggle) exportProps.onToggle = onToggle;
    if (onSongChanged) exportProps.onSongChanged = onSongChanged;

    const playlistChanged =
      prevProps.currentPlayList !== this.props.currentPlayList;
    const indexChanged =
      prevProps.activeSongIndex !== this.props.activeSongIndex;

    if (playlistChanged && objectHasProps(this.props.currentPlayList)) {
      store.startIndex = Number.isInteger(this.props.activeSongIndex)
        ? this.props.activeSongIndex
        : 0;
      store.setAudio().setPlaylist(this.props.currentPlayList);
      return;
    }

    if (
      indexChanged &&
      Number.isInteger(this.props.activeSongIndex) &&
      store.songAndPlaylistAreSetted &&
      store.state.currentSong.arrIndex !== this.props.activeSongIndex
    ) {
      store.setControls().skipSong({ to: this.props.activeSongIndex });
    }
  }

  render() {
    const SongInfoComponent = store.canPlay && <SongInfo />;

    return (
      <div className={"audio"}>
        <div id="audio__player" className={"audio__player"}>
          <div className={"audio__controls"}>
            {SongInfoComponent}
            <div className={"group"}>
              <AudioControls onToggle={this.props.onToggle} />
              <AudioProgress />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const toggleAudio = store.setAudio().toggle;
export default AudioPlayer;
