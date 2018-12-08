import React from 'react'
import { shallow } from 'enzyme'
import PlayerIcon, { iconToRender } from '../PlayerIcon/PlayerIcon'
import Random from './Icons/Random'
import Sync from './Icons/Sync'
import Play from './Icons/Play'
import Pause from './Icons/Pause'
import Forward from './Icons/Forward'
import Backward from './Icons/Backward'
import VolumeUp from './Icons/VolumeUp'
import VolumeDown from './Icons/VolumeDown'
import VolumeOff from './Icons/VolumeOff'

const createWrapper = () => {
  return shallow(<PlayerIcon passClass={'test'} onClick={() => {}} />)
}

describe('PlayerIcon', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).toBeTruthy()
    wrapper.unmount()
  })

  describe('iconToRender', () => {
    it('renders correct icon', () => {
      expect(iconToRender({ icon: 'random' })).toEqual(<Random />)
      expect(iconToRender({ icon: 'sync' })).toEqual(<Sync />)
      expect(iconToRender({ icon: 'play' })).toEqual(<Play />)
      expect(iconToRender({ icon: 'pause' })).toEqual(<Pause />)
      expect(iconToRender({ icon: 'forward' })).toEqual(<Forward />)
      expect(iconToRender({ icon: 'backward' })).toEqual(<Backward />)
      expect(iconToRender({ icon: 'volumeup' })).toEqual(<VolumeUp />)
      expect(iconToRender({ icon: 'volumedown' })).toEqual(<VolumeDown />)
      expect(iconToRender({ icon: 'volumeoff' })).toEqual(<VolumeOff />)
    })
  })
})
