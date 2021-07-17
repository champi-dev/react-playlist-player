> https://www.patreon.com/champipatreon

# react-playlist-player

[Open live demo](https://react-playlist-player.firebaseapp.com/)

## Install

```javascript
  npm install react-playlist-player mobx mobx-react --save
```

You'll also need the following devDependencies:

```json
"devDependencies": {
    "@babel/cli": "^7.14.5",
    "@babel/core": "^7.14.6",
    "@babel/plugin-proposal-decorators": "^7.14.5",
    "@babel/plugin-syntax-jsx": "^7.14.5",
    "@babel/polyfill": "^7.12.1",
    "@babel/preset-env": "^7.14.7",
    "@craco/craco": "^5.6.4",
    "node-sass": "^6.0.1"
  }
```

then update the scripts:

```json
"scripts": {
    "start": "craco start",
    "build": "craco build"
  }
```

and add a craco.config.js at the root of your project:

```javascript
module.exports = {
  reactScriptsVersion: "react-scripts",
  babel: {
    plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
  }
};
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
        <AudioPlayer currentPlayList={this.state.currentPlayList} 
          onToggle={({audioPlaying}) => console.log({audioPlaying})}
          onSongChanged={({currentSong}) => {console.log(currentSong)}}
        />
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
