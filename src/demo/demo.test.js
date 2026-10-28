import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Library, mountLibrary } from './index'

const folder = {
  id: 'folder:Jazz',
  name: 'Jazz',
  source: 'folder',
  location: 'music/Jazz',
  playlistCoverUrl: '/music/Jazz/cover.jpg',
  songs: [
    {
      position: '1',
      songName: 'Harbor',
      artist: 'Field Notes',
      songUrl: '/music/Jazz/harbor.mp3',
      coverUrl: '',
      duration: 12
    },
    {
      position: '2',
      songName: 'Glasshouse',
      artist: 'Field Notes',
      songUrl: '/music/Jazz/glass.mp3',
      coverUrl: '/music/Jazz/glass.jpg',
      duration: 20
    }
  ]
}

const linked = {
  id: 'link:Night',
  name: 'Night Drive',
  source: 'link',
  location: 'hosted-playlists.json',
  bandName: 'Various',
  playlistCoverUrl: 'https://example.com/night.jpg',
  songs: [
    {
      position: '1',
      songName: 'Signal',
      artist: '',
      songUrl: 'https://example.com/signal.mp3',
      coverUrl: '',
      duration: null
    }
  ]
}

function ok(body) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
}

function clickPlaylist(view, name) {
  const button = view.getAllByRole('button', { name }).find(element => element.classList.contains('library__playlist'))
  fireEvent.click(button)
}

describe('library screen', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
  })

  afterEach(() => {
    delete window.fetch
  })

  test('lists folder and link playlists and selects a song', async () => {
    window.fetch = jest.fn().mockReturnValue(ok({ playlists: [folder, linked] }))
    const view = render(<Library />)
    await waitFor(() => expect(view.getByRole('heading', { name: 'Jazz' })).toBeTruthy())
    expect(view.getByRole('button', { name: /Harbor/ })).toBeTruthy()
    fireEvent.click(view.getByRole('button', { name: /Everything/ }))
    expect(view.getByRole('heading', { name: 'Everything' })).toBeTruthy()
    expect(view.getAllByText('Jazz').length).toBeGreaterThan(1)
    clickPlaylist(view, /Night Drive/)
    fireEvent.click(view.getByRole('button', { name: /Signal/ }))
    await waitFor(() => expect(document.querySelector('.song-info .title').textContent).toBe('Signal'))
    fireEvent.focus(window)
    await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(2))
    clickPlaylist(view, /^Jazz/)
    fireEvent.mouseEnter(view.getByRole('button', { name: /Harbor/ }))
    fireEvent.focus(view.getByRole('button', { name: /Harbor/ }))
    fireEvent.click(view.getByRole('button', { name: /Harbor/ }))
    await waitFor(() => expect(document.querySelector('.song-info .title').textContent).toBe('Harbor'))
    fireEvent.click(view.getByRole('button', { name: /Glasshouse/ }))
    await waitFor(() => expect(document.querySelector('.song-info .title').textContent).toBe('Glasshouse'))
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  test('shows a category and switches between its playlists', async () => {
    const track = (songName, songUrl) => ({
      position: '1',
      songName,
      artist: 'Ada',
      songUrl,
      coverUrl: '',
      duration: 3
    })
    window.fetch = jest.fn().mockReturnValue(ok({
      playlists: [
        {
          id: 'folder:Deep_House/Anthems_CD1',
          name: 'Anthems CD1',
          category: 'Deep House',
          source: 'folder',
          playlistCoverUrl: '',
          songs: [track('One', '/a.mp3')]
        },
        {
          id: 'folder:Deep_House/Anthems_CD2',
          name: 'Anthems CD2',
          category: 'Deep House',
          source: 'folder',
          playlistCoverUrl: '',
          songs: [track('Two', '/b.mp3')]
        },
        {
          id: 'folder:Jazz',
          name: 'Jazz',
          category: 'Jazz',
          source: 'folder',
          playlistCoverUrl: '/music/Jazz/cover.jpg',
          songs: [track('Harbor', '/c.mp3')]
        }
      ]
    }))
    const view = render(<Library />)
    await waitFor(() => expect(view.getByRole('heading', { name: 'Deep House' })).toBeTruthy())
    expect(view.getByRole('button', { name: /One/ })).toBeTruthy()
    fireEvent.click(view.getByRole('button', { name: /Deep House/ }))
    fireEvent.click(view.getByRole('button', { name: 'Anthems CD2' }))
    expect(view.getByRole('button', { name: /Two/ })).toBeTruthy()
    fireEvent.click(view.getByRole('button', { name: /^Jazz/ }))
    expect(view.getByRole('heading', { name: 'Jazz' })).toBeTruthy()
  })

  test('tells you where an empty category keeps its songs', async () => {
    window.fetch = jest.fn().mockReturnValue(ok({
      playlists: [{
        id: 'folder:Salsa',
        name: 'Salsa',
        source: 'folder',
        location: 'music/Salsa',
        playlistCoverUrl: '',
        songs: []
      }]
    }))
    const view = render(<Library />)
    await waitFor(() => expect(view.getByText(/music\/Salsa/)).toBeTruthy())
  })

  test('falls back to the static catalog and reports a hard failure', async () => {
    window.fetch = jest.fn()
      .mockReturnValueOnce(Promise.resolve({ ok: false, json: () => Promise.resolve({}) }))
      .mockReturnValueOnce(ok({ playlists: [] }))
    const view = render(<Library />)
    await waitFor(() => expect(view.getByText(/Add a folder inside music/)).toBeTruthy())

    window.fetch = jest.fn()
      .mockReturnValueOnce(Promise.reject(new Error('offline')))
      .mockReturnValueOnce(Promise.resolve({ ok: false, json: () => Promise.resolve({}) }))
    const failed = render(<Library />)
    await waitFor(() => expect(failed.getByText('Could not read the music folder')).toBeTruthy())
  })

  test('mounts into a root node and does nothing without one', () => {
    window.fetch = jest.fn().mockReturnValue(new Promise(() => {}))
    expect(mountLibrary(null)).toBeNull()
    expect(mountLibrary(document.getElementById('root'))).toBeTruthy()
  })
})
