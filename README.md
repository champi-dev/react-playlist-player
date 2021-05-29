> https://www.patreon.com/champipatreon

> I'm not maintaining this project and also the current npm lib seems to be a bit broken

> If you think that this project could help you, you're better of forking it

> If you absolutely need this lib to work just leave me a comment and I'll fix what's missing

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
| onToggle | Function | false     | A function to be excuted on audio toggle. It'll get passed {audioPlaying} as an argument                         |
| currentPlayList | Object | true     | An object containing the playlist data                         |
| playlistCoverUrl | String | true     | A path to the cover image (prop of currentPlayList)            |
| playlistName    | String | true     | Playlist name (prop of currentPlayList)                           |
| bandName        | String | true     | Band name (prop of currentPlayList)                            |
| songs           | Array  | true     | Array of songs(objects) to be played (prop of currentPlayList) |
| position        | String | false    | Song's position in playlist (prop of songs)                    |
| songName        | String | true     | Song name (prop of songs)                                      |
| songUrl         | String | true     | A path to the song (prop of songs)                             |

## Exposed api

### toggleAudio

```javascript
import { toggleAudio } from 'react-playlist-player'

// Plays / pauses the audio
toggleAudio()
```
