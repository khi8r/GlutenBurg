const modulesToTransform = [
  'react-native',
  '@react-native',
  'react-native-reanimated',
  '@react-native-picker',
  '@react-native-async-storage',
  'react-native-vector-icons',
  '@react-navigation'
]

const pattern = `node_modules/(?!((${modulesToTransform.join('|')})/))`

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [pattern]
}
