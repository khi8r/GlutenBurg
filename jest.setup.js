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
