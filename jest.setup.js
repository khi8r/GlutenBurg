jest.mock('react-native-navigation-bar-color', () => jest.fn())
jest.mock('react-native-bootsplash', () => ({ hide: jest.fn() }))

require('react-native-reanimated').setUpTests()

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated')
  global.ProgressTransitionRegister = {
    addProgressAnimation: jest.fn(),
    removeProgressAnimation: jest.fn()
  }

  return Object.assign({}, Reanimated, {
    Image: 'Image',
    View: jest.fn((props) => <div {...props} />)
  })
})

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

global.requestAnimationFrame = null

jest.mock('react-native-vector-icons/Feather', () => 'Feather')
jest.mock('@react-native-picker/picker', () => {
  const Picker = ({ children, ...props }) => <select {...props}>{children}</select>
  Picker.Item = ({ label, value }) => <option value={value}>{label}</option>
  return { Picker }
})
