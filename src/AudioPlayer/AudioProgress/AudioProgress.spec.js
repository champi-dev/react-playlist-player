import { shallow } from 'enzyme'
import React from 'react'
import AudioProgress, { seekPlaying } from './AudioProgress'

const store = {
  canPlay: false,
  setAudio: () => ({
    getDuration: () => 4000
  })
}

const createWrapper = () => {
  return shallow(<AudioProgress />)
}

describe('AudioProgress', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })

  describe('seekPlaying', () => {
    it('returns undefined if !store.canPlay', () => {
      expect(
        seekPlaying({ clientX: 200 }, store, {
          player: {
            width: 400
          },
          progress: {
            width: 400,
            left: 0
          }
        })
      ).toBe(undefined)
    })

    it('returns a number', () => {
      expect(
        typeof seekPlaying(
          { clientX: 200 },
          { ...store, canPlay: true },
          {
            player: {
              width: 400
            },
            progress: {
              width: 400,
              left: 0
            }
          }
        )
      ).toBe('number')
    })

    it('returns correct number if playerWidth === progressWidth', () => {
      expect(
        seekPlaying(
          { clientX: 200 },
          { ...store, canPlay: true },
          {
            player: {
              width: 1000
            },
            progress: {
              width: 1000,
              left: 300
            }
          }
        )
      ).toBe(800)
    })

    it('returns correct number if playerWidth > progressWidth', () => {
      expect(
        seekPlaying(
          { clientX: 800 },
          { ...store, canPlay: true },
          {
            player: {
              width: 4000
            },
            progress: {
              width: 1000,
              left: 300
            }
          }
        )
      ).toBe(2000)
    })
  })
})
