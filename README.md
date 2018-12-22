# react-playlist-player

[![Build Status](https://travis-ci.org/devsarmico/react-playlist-player.svg?branch=master)](https://travis-ci.org/devsarmico/react-playlist-player)
[![npm version](https://badge.fury.io/js/react-playlist-player.svg)](https://badge.fury.io/js/react-playlist-player)
[![Dependencies](https://david-dm.org/danielsarcor/react-playlist-player.svg)](https://david-dm.org/devsarmico/react-playlist-player)
[![devDependencies Status](https://david-dm.org/devsarmico/react-playlist-player/dev-status.svg)](https://david-dm.org/devsarmico/react-playlist-player?type=dev)

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
        albumCoverUrl: 'path/to/coverUrl',
        albumName: 'album name',
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
        <AudioPlayer currentPlayList={this.state.currentPlayList} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
```

## Props

| Prop            |  Type  | Required | Description                                                    |
| --------------- | :----: | -------- | -------------------------------------------------------------- |
| currentPlayList | Object | true     | An object containing the playlist data                         |
| albumCoverUrl   | String | true     | A path to the cover image (prop of currentPlayList)            |
| albumName       | String | true     | Album name (prop of currentPlayList)                           |
| bandName        | String | true     | Band name (prop of currentPlayList)                            |
| songs           | Array  | true     | Array of songs(objects) to be played (prop of currentPlayList) |
| position        | String | false    | Song's position in playlist (prop of songs)                    |
| songName        | String | true     | Song name (prop of songs)                                      |
| songUrl         | String | true     | A path to the song (prop of songs)                             |

## Exposed api

react-playlist-player exports two functions that relate to the playback:

### toggleAudio

```javascript
import { toggleAudio } from 'react-playlist-player'

// Plays / pauses the audio
toggleAudio()
```

### audioPlaying

```javascript
import { audioPlaying } from 'react-playlist-player'

// Returns a boolean that indicates whether the audio is playing
console.log(audioPlaying()) // true or false
```
