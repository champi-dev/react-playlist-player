import React from 'react'
import { shallow } from 'enzyme'
import SongInfo from './SongInfo'

const createWrapper = () => {
  const audioInfo = {
    coverImage: 'test',
    songName: 'test',
    artistName: 'test'
  }
  return shallow(<SongInfo audioInfo={audioInfo} />)
}

describe('SongInfo', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })
})
