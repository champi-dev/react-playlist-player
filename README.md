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
            artist: 'someone',
            songUrl: '/music/Jazz/foo.mp3',
            coverUrl: '/music/Jazz/foo.jpg'
          },
          {
            position: '2',
            songName: 'bar',
            songUrl: 'https://example.com/audio/bar.mp3',
            coverUrl: 'https://example.com/covers/bar.jpg'
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
          activeSongIndex={0}
          onToggle={({audioPlaying}) => console.log({audioPlaying})}
          onSongChanged={({currentSong}) => {console.log(currentSong)}}
        />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
```

`songUrl` and `coverUrl` accept either kind of address:

- A hosted link, such as `https://example.com/audio/bar.mp3`
- A file in this project. Put audio in a folder under `music/`. A folder of songs is a category and a playlist (`music/Classic_Rock`, `music/Jazz`). A folder of folders is a category whose subfolders are playlists (`music/Deep_House/Anthems_CD1`). A cover image with the same name as the track, or `cover.jpg` in the folder, is used for that song.

`npm start` reads those folders and lists every song. An empty folder is a category waiting for files. Audio is requested only after you press a song. Link playlists go in `hosted-playlists.json`:

```json
{
  "playlists": [
    {
      "name": "Night Drive",
      "bandName": "Various",
      "playlistCoverUrl": "https://example.com/covers/night.jpg",
      "songs": [
        {
          "songName": "Harbor",
          "artist": "Field Notes",
          "songUrl": "https://example.com/audio/harbor.mp3",
          "coverUrl": "https://example.com/covers/harbor.jpg"
        }
      ]
    }
  ]
}
```

## Props

| Prop            |  Type  | Required | Description                                                    |
| --------------- | :----: | -------- | -------------------------------------------------------------- |
| onToggle | Function |     | A function to be excuted on audio toggle. It'll get passed {audioPlaying} as an argument                         |
| onSongChanged | Function | | A function that is called when a song changes, receives {currentSong} as param |
| currentPlayList | Object | *     | An object containing the playlist data                         |
| playlistCoverUrl | String | *     | Cover used when a song has no coverUrl. Hosted URL or a file in this project |
| playlistName    | String | *     | Playlist name (prop of currentPlayList)                           |
| bandName        | String | *     | Band name (prop of currentPlayList)                            |
| songs           | Array  | *     | Array of songs(objects) to be played (prop of currentPlayList) |
| position        | String |     | Song's position in playlist (prop of songs)                    |
| songName        | String | *     | Song name (prop of songs)                                      |
| artist          | String |     | Shown under the title. Falls back to bandName                  |
| songUrl         | String | *     | Hosted audio URL, or a file path such as /music/Jazz/foo.mp3   |
| coverUrl        | String |     | Cover for this song. Same kind of address as songUrl           |
| activeSongIndex | Number |     | Song to start when the playlist loads. First song when omitted |

## Exposed api

### toggleAudio

```javascript
import { toggleAudio } from 'react-playlist-player'

// Plays / pauses the audio
toggleAudio()
```
