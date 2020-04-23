# react-playlist-player

[Open live demo](https://react-playlist-player.firebaseapp.com/)

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

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
