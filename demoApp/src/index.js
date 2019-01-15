import React, { Component } from 'react'
import { render } from 'react-dom'
import '../../styles/index.sass'
import './demo.sass'
import AudioPlayer from '../../src/index'

class Demo extends Component {
  state = {
    currentPlayList: {}
  }

  loadPlayList = () =>
    this.setState({
      currentPlayList: {
        playlistCoverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/81eaKFGNhSL._SL1500_.jpg',
        albumName: 'ten',
        bandName: 'pearl jam',
        songs: [
          {
            position: '1',
            songName: 'once',
            songUrl:
              'https://firebasestorage.googleapis.com/v0/b/devsarmico-heavycol.appspot.com/o/audios%2F01%20-%20Once.mp3?alt=media&token=1f326545-e3d4-4ccb-a0c6-c92291aad62b'
          },
          {
            position: '2',
            songName: 'even flow',
            songUrl:
              'https://firebasestorage.googleapis.com/v0/b/devsarmico-heavycol.appspot.com/o/audios%2F02%20-%20Even%20Flow.mp3?alt=media&token=a2fa2b54-337f-4097-ba16-38e2283588be'
          },
          {
            position: '3',
            songName: 'alive',
            songUrl:
              'https://firebasestorage.googleapis.com/v0/b/devsarmico-heavycol.appspot.com/o/audios%2F03%20-%20Alive.mp3?alt=media&token=c2aacdd0-0037-4fdc-8467-593a0a95ab5b'
          }
        ],
        type: 'album'
      }
    })

  render() {
    return (
      <div className={'Demo'}>
        <a
          className={'Demo__github-logo'}
          href="https://github.com/devsarmico/react-playlist-player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path
              fill="#FFFFFF"
              d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"
            />
          </svg>
        </a>
        <button className={'Demo__load-btn'} onClick={this.loadPlayList}>
          load playlist
        </button>
        <AudioPlayer currentPlayList={this.state.currentPlayList} onToggle={({audioPlaying}) => console.log({audioPlaying})}/>
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
