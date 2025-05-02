require('react-native-reanimated').setUpTests()

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated')
  global.ProgressTransitionRegister = {
    addProgressAnimation: jest.fn(),
    removeProgressAnimation: jest.fn()
  }

  return Object.assign({}, Reanimated, {
    Image: 'Image'
  })
})
