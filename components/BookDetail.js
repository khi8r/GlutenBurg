import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { THEME } from '../theme'

const getFormatLabel = (type) => {
  if (type.includes('epub')) return 'EPUB'
  if (type.includes('pdf')) return 'PDF'
  if (type.includes('plain')) return 'Plain Text'
  if (type.includes('html')) return 'HTML'
  if (type.includes('kindle')) return 'Kindle'
  return type.split('/')[1]?.toUpperCase() || type
}

function getBadgeStyle (type) {
  if (type.includes('epub')) return { backgroundColor: THEME.GREEN }
  if (type.includes('pdf')) return { backgroundColor: THEME.RED }
  if (type.includes('plain')) return { backgroundColor: THEME.YELLOW }
  if (type.includes('html')) return { backgroundColor: THEME.SKY }
  if (type.includes('kindle')) return { backgroundColor: THEME.PEACH }
  return { backgroundColor: THEME.LAVENDER }
}

export const BookDetail = ({ route }) => {
  const { book } = route.params
  const author = book.authors && book.authors.length > 0 ? book.authors[0] : null
  const cover = book.formats['image/jpeg']
  const downloadLinks = Object.entries(book.formats)
    .filter(([type, url]) => type !== 'image/jpeg')
    .map(([type, url]) => ({ type, url }))

  return (
    <ScrollView style={{ flex: 1, backgroundColor: THEME.BACKGROUND }} contentContainerStyle={{ padding: 20 }}>
      <Animated.Image
        source={{ uri: cover, cache: 'force-cache' }}
        style={styles.cover}
        resizeMode='contain'
        sharedTransitionTag={`item.${book.id}.cover`}
      />
      <Animated.View entering={FadeIn.delay(500).duration(400)}>
        <Text style={styles.title}>{book.title}</Text>
        {author && (
          <Text style={styles.author}>{author.name}{author.birth_year ? ` (${author.birth_year} - ${author.death_year || ''})` : ''}</Text>
        )}
        <Text style={styles.label}>Summary:</Text>
        {book.summaries && book.summaries.length > 0
          ? (
            <Text style={styles.text}>{book.summaries[0]}</Text>
            )
          : (
            <Text style={styles.text}>No summary available.</Text>
            )}
        <Text style={styles.label}>Subjects:</Text>
        <Text style={styles.text}>{book.subjects ? book.subjects.join(', ') : 'N/A'}</Text>
        <Text style={styles.label}>Bookshelves:</Text>
        <Text style={styles.text}>{book.bookshelves ? book.bookshelves.join(', ') : 'N/A'}</Text>
        <Text style={styles.label}>Languages:</Text>
        <Text style={styles.text}>{book.languages ? book.languages.join(', ') : 'N/A'}</Text>
        <Text style={styles.label}>Media Type:</Text>
        <Text style={styles.text}>{book.media_type}</Text>
        <Text style={styles.label}>Copyright:</Text>
        <Text style={styles.text}>{book.copyright ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>Download Count:</Text>
        <Text style={styles.text}>{book.download_count}</Text>
        <Text style={styles.label}>Download Links:</Text>
        <View style={styles.badgeContainer}>
          {downloadLinks.map(link => (
            <TouchableOpacity
              key={link.type}
              style={[styles.badge, getBadgeStyle(link.type)]}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.8}
            >
              <Text style={styles.badgeText}>{getFormatLabel(link.type)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 10,
    marginBottom: 18,
    backgroundColor: THEME.SURFACE1,
    borderWidth: 2,
    borderColor: THEME.LAVENDER
  },
  title: {
    color: THEME.MAUVE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6
  },
  author: {
    color: THEME.FLAMINGO,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  label: {
    color: THEME.ACCENT,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 2,
    fontSize: 15
  },
  text: {
    color: THEME.SUBTEXT0,
    fontSize: 14,
    marginBottom: 2
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16
  },
  badge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60
  },
  badgeText: {
    color: THEME.BACKGROUND,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5
  }
})
