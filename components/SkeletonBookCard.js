import React from 'react'
import { View } from 'react-native'
import { BookCard } from './BookCard'

const SkeletonBookCard = () => (
  <View style={{ flex: 1, margin: 8 }}>
    <BookCard skeleton />
  </View>
)

export { SkeletonBookCard }
