import React from 'react'
import { shallow } from 'enzyme'
import AudioVolume, { volumeClass, toggleVolume, seekVolume } from './AudioVolume'

const createWrapper = () => shallow(<AudioVolume />)

describe('AudioVolume', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })

  describe('volumeClass', () => {
    it('returns correct values', () => {
      expect(volumeClass({ audioVolume: 0.6 })).toBe('volumeup')
      expect(volumeClass({ audioVolume: 0.4 })).toBe('volumedown')
      expect(volumeClass({ audioVolume: 0 })).toBe('volumeoff')
    })
  })

  describe('toggleVolume', () => {
    it('returns correct values', () => {
      expect(toggleVolume({ audioVolume: 0.4 })).toBe(0.0)
      expect(toggleVolume({ audioVolume: 0.0 })).toBe(1.0)
    })
  })

  describe('seekVolume', () => {
    it('returns a number', () => {
      expect(
        typeof seekVolume(
          { clientX: 2000 },
          {
            volume: {
              offsetLeft: 1500
            },
            volumeBar: {
              offsetLeft: 26,
              width: 100
            }
          }
        )
      ).toBe('number')
    })

    it('returns correct value', () => {
      expect(
        seekVolume(
          { clientX: 1047 },
          {
            volume: {
              offsetLeft: 994
            },
            volumeBar: {
              offsetLeft: 26,
              width: 74
            }
          }
        )
      ).toBe(0.4)
    })
  })
})
