import React from 'react'
import { View, Text as RNText } from 'react-native'
import { THEME } from '../theme'

const ErrorView = ({ message }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.BACKGROUND }}>
    <RNText style={{ color: 'red', fontSize: 16 }}>{message}</RNText>
  </View>
)

export { ErrorView }
