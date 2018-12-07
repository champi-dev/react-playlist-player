import { shallow } from 'enzyme'
import React from 'react'
import AudioPlayer from './AudioPlayer'
import store from './store/store'

const currentPlayList = { bandName: 'test', songUrl: 'url', songs: [{}] }
const createWrapper = () => shallow(<AudioPlayer currentPlayList={currentPlayList} />)

describe('AudioPlayer', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })

  describe('componentDidUpdate', () => {
    it('calls onPlaylistChanged', () => {
      const wrapper = createWrapper()
      const spy = jest.spyOn(wrapper.instance(), 'onPlaylistChanged')
      wrapper.instance().componentDidUpdate({ currentPlayList: {} })
      expect(spy).toBeCalled()
      spy.mockClear()
      wrapper.unmount()
    })
  })

  describe('onPlaylistChanged', () => {
    it('sets store.state.currentPlaylist inside if branch', () => {
      const wrapper = createWrapper()
      wrapper.instance().onPlaylistChanged({ currentPlayList: {} }, { ifBool: true })
      expect(store.state.currentPlayList).toEqual({ bandName: 'test', songUrl: 'url', songs: [{}] })
      store.state.currentPlayList = {}
      wrapper.unmount()
    })

    it('doesnt set store.state.currentPlaylist outside if branch', () => {
      const wrapper = createWrapper()
      wrapper.instance().onPlaylistChanged({ currentPlayList: {} }, { ifBool: false })
      expect(store.state.currentPlayList).toEqual({})
      wrapper.unmount()
    })
  })
})
