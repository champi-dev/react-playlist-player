import React, { Component } from 'react'
import { render } from 'react-dom'
import '../../styles/index.sass'
import './demo.sass'
import AudioPlayer from '../../src/AudioPlayer/AudioPlayer'

class Demo extends Component {
  state = {
    currentPlayList: {}
  }

  loadPlayList = () =>
    this.setState({
      currentPlayList: {
        albumCoverUrl:
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
        <button className={'Demo__load-btn'} onClick={this.loadPlayList}>
          load playlist
        </button>
        <AudioPlayer currentPlayList={this.state.currentPlayList} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
