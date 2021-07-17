> https://www.patreon.com/champipatreon

# react-playlist-player

[Open live demo](https://react-playlist-player.firebaseapp.com/)

## Install

```javascript
  npm install react-playlist-player mobx mobx-react --save
```

## Usage

```javascript
import React, { Component } from 'react'
import { render } from 'react-dom'
import AudioPlayer from 'react-playlist-player'

class Demo extends Component {
  state = {
    currentPlayList: {}
  }

  loadPlayList = () =>
    this.setState({
      currentPlayList: {
        playlistCoverUrl: 'path/to/coverUrl',
        playlistName: 'playlist name',
        bandName: 'band name',
        songs: [
          {
            position: '1',
            songName: 'foo',
            songUrl: 'path/to/songUrl'
          },
          {
            position: '2',
            songName: 'bar',
            songUrl: 'path/to/songUrl'
          },
          {
            position: '3',
            songName: 'baz',
            songUrl: 'path/to/songUrl'
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
        <AudioPlayer currentPlayList={this.state.currentPlayList} onToggle={({audioPlaying}) => console.log({audioPlaying})}/>
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
```

## Props

| Prop            |  Type  | Required | Description                                                    |
| --------------- | :----: | -------- | -------------------------------------------------------------- |
| onToggle | Function |     | A function to be excuted on audio toggle. It'll get passed {audioPlaying} as an argument                         |
| onSongChanged | Function | | A function that is called when a song changes, receives {currentSong} as param |
| currentPlayList | Object | *     | An object containing the playlist data                         |
| playlistCoverUrl | String | *     | A path to the cover image (prop of currentPlayList)            |
| playlistName    | String | *     | Playlist name (prop of currentPlayList)                           |
| bandName        | String | *     | Band name (prop of currentPlayList)                            |
| songs           | Array  | *     | Array of songs(objects) to be played (prop of currentPlayList) |
| position        | String |     | Song's position in playlist (prop of songs)                    |
| songName        | String | *     | Song name (prop of songs)                                      |
| songUrl         | String | *     | A path to the song (prop of songs)                             |

## Exposed api

### toggleAudio

```javascript
import { toggleAudio } from 'react-playlist-player'

// Plays / pauses the audio
toggleAudio()
```
