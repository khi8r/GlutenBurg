import React from 'react'
import { BookCard } from './BookCard'
import { FlatList, useWindowDimensions, Text as RNText, TouchableOpacity, ActivityIndicator } from 'react-native'
import { THEME } from '../theme'
import { SkeletonBookCard } from './SkeletonBookCard'
import { ErrorView } from './ErrorView'
import { getProcessedSubjects } from '../utils/subjectUtils'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const SKELETON_CARD_COUNT = 8
const AnimatedView = Animated.View

const HomeScreen = ({ books, loading, error, loadMore, nextPage, refreshing, refresh, loadingMore, navigation }) => {
  const { width } = useWindowDimensions()

  let numColumns = 2
  if (width >= 900) numColumns = 4
  else if (width >= 600) numColumns = 3

  const [cardHeights, setCardHeights] = React.useState({})

  const getRowMaxHeight = React.useCallback((rowIdx) => {
    const rowHeights = []
    for (let i = 0; i < numColumns; i++) {
      const idx = rowIdx * numColumns + i
      if (cardHeights[idx] != null) rowHeights.push(cardHeights[idx])
    }
    return rowHeights.length ? Math.max(...rowHeights) : undefined
  }, [cardHeights, numColumns])

  const renderItem = React.useCallback(({ item, index }) => {
    const processedSubjects = getProcessedSubjects(item.subjects)
    const rowIdx = Math.floor(index / numColumns)
    const maxHeight = getRowMaxHeight(rowIdx)
    return (
      <AnimatedView
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={{ flex: 1, margin: 8 }}
      >
        <BookCard
          title={item.title && item.title.slice(0, 50) + (item.title.length > 20 ? '...' : '')}
          author={item.authors && item.authors.length > 0 ? item.authors[0].name : 'Unknown'}
          image={item.formats['image/jpeg']}
          description={item.summaries && item.summaries.length > 0 ? item.summaries[0].slice(0, 100) + (item.summaries[0].length > 100 ? '...' : '') : ''}
          formats={item.formats}
          subjects={processedSubjects}
          containerStyle={{ minHeight: maxHeight, height: maxHeight }}
          onLayout={e => {
            const h = e.nativeEvent.layout.height
            setCardHeights(prev => prev[index] === h ? prev : { ...prev, [index]: h })
          }}
          onPress={() => navigation.navigate('BookDetail', { book: item })}
          sharedElementId={`item.${item.id}.cover`}
        />
      </AnimatedView>
    )
  }, [getRowMaxHeight, numColumns, navigation])

  const renderFooter = React.useCallback(() => {
    if (!nextPage || refreshing) return null
    const isDisabled = !!loadingMore
    return (
      <AnimatedView
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={{ alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: 8, paddingBottom: 24 }}
      >
        <TouchableOpacity
          onPress={isDisabled ? undefined : loadMore}
          activeOpacity={isDisabled ? 1 : 0.7}
          disabled={isDisabled}
          style={{
            backgroundColor: isDisabled ? THEME.YELLOW : THEME.ACCENT,
            opacity: isDisabled ? 0.5 : 1,
            width: '100%',
            maxWidth: 400,
            borderRadius: 8,
            elevation: 2,
            marginTop: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDisabled && (
            <ActivityIndicator size='small' color={THEME.BASE} style={{ marginRight: 10 }} />
          )}
          <RNText
            style={{
              color: THEME.BASE,
              paddingHorizontal: 24,
              paddingVertical: 12,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16
            }}
          >
            {isDisabled ? 'Loading...' : 'Load More'}
          </RNText>
        </TouchableOpacity>
      </AnimatedView>
    )
  }, [nextPage, refreshing, loadingMore, loadMore])

  if (loading) {
    const skeletonData = Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => ({ id: `skeleton-${i}` }))
    return (
      <FlatList
        key={numColumns}
        data={skeletonData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 8, backgroundColor: THEME.BACKGROUND }}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : null}
        renderItem={() => (
          <AnimatedView entering={FadeIn.duration(400)} style={{ flex: 1, margin: 8 }}>
            <SkeletonBookCard />
          </AnimatedView>
        )}
        initialNumToRender={SKELETON_CARD_COUNT}
        maxToRenderPerBatch={8}
        windowSize={11}
        removeClippedSubviews
      />
    )
  }

  if (!loading && books.length === 0 && !error) {
    return (
      <AnimatedView entering={FadeIn.duration(400)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.BACKGROUND }}>
        <RNText style={{ color: THEME.SECONDARY_TEXT, fontSize: 18, marginTop: 32 }}>Nothing found</RNText>
      </AnimatedView>
    )
  }

  if (error) {
    return (
      <AnimatedView entering={FadeIn.duration(400)} style={{ flex: 1 }}>
        <ErrorView message='Error loading books.' />
      </AnimatedView>
    )
  }

  return (
    <FlatList
      key={numColumns}
      data={books}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 8, backgroundColor: THEME.BACKGROUND }}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : null}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      refreshing={refreshing}
      onRefresh={refresh}
      scrollEnabled
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={15}
      removeClippedSubviews
    />
  )
}

export { HomeScreen }
