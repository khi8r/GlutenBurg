import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated from 'react-native-reanimated'
import { THEME } from '../theme'

const Skeleton = () => (
  <View style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 12, backgroundColor: THEME.SKELETON }} />
)

const Badge = ({ color, text }) => (
  <View style={{
    backgroundColor: color,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginRight: 6
  }}
  >
    <Text style={{ color: THEME.BASE, fontWeight: 'bold', fontSize: 12 }}>{text}</Text>
  </View>
)

const BookCardComponent = ({ title, author, image, description, skeleton, subjects = [], formats = {}, containerStyle = {}, onLayout, onPress, sharedElementId }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={skeleton}
    >
      <View
        style={{
          backgroundColor: THEME.CARD_BG,
          borderRadius: 10,
          padding: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: THEME.CARD_BORDER,
          shadowColor: THEME.OVERLAY1,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 3,
          ...containerStyle
        }}
        onLayout={onLayout}
      >
        {skeleton
          ? (
            <Skeleton />
            )
          : (
            <Animated.Image
              source={{ uri: image, cache: 'force-cache' }}
              style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 12, backgroundColor: THEME.SURFACE1, borderWidth: 2, borderColor: THEME.LAVENDER }}
              resizeMode='cover'
              sharedTransitionTag={sharedElementId}
            />
            )}
        <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {!skeleton && subjects && subjects.map((subj, idx) => (
            <Badge key={`subject-${idx}`} color={THEME.ACCENT} text={subj} />
          ))}
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: THEME.MAUVE, fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>
            {skeleton ? ' ' : title}
          </Text>
          <Text style={{ color: THEME.FLAMINGO, fontSize: 14, fontWeight: '600' }}>
            {skeleton ? ' ' : author}
          </Text>
        </View>
        {skeleton
          ? (
            <Text style={{ color: THEME.SECONDARY_TEXT, fontSize: 13 }}> </Text>
            )
          : description
            ? (
              <Text
                style={{ color: THEME.SUBTEXT0, fontSize: 13, maxWidth: '100%', flexShrink: 1 }}
                numberOfLines={3}
                ellipsizeMode='tail'
              >
                {description}
              </Text>
              )
            : null}
      </View>
    </TouchableOpacity>
  )
}

export const BookCard = React.memo(BookCardComponent)
