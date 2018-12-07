import { shallow } from 'enzyme'
import React from 'react'
import AudioControls from './AudioControls'
import { randomClasses, playClasses, repeatClasses } from './AudioControls'

const createWrapper = () => shallow(<AudioControls />)

describe('AudioControls', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })

  describe('randomClasses', () => {
    it('returns correct values', () => {
      expect(randomClasses({ randomize: true })).toBe('random active')
      expect(randomClasses({ randomize: false })).toBe('random')
    })
  })

  describe('playClasses', () => {
    it('returns correct values', () => {
      expect(playClasses({ audioPlaying: true })).toBe('pause')
      expect(playClasses({ audioPlaying: false })).toBe('play')
    })
  })

  describe('repeatClasses', () => {
    it('returns correct values', () => {
      expect(repeatClasses({ repeat: 'off' })).toBe('sync')
      expect(repeatClasses({ repeat: 'all' })).toBe('sync active')
      expect(repeatClasses({ repeat: 'one' })).toBe('sync active active--twice')
    })
  })
})
