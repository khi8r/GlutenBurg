import React from 'react'
import useBooks from './hooks/useBooks'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import RNBootSplash from 'react-native-bootsplash'
import { BookSearch } from './components/BookSearch'
import { View, StatusBar } from 'react-native'
import { THEME } from './theme'
import { HomeScreen } from './components/HomeScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BookDetail } from './components/BookDetail'

const Stack = createNativeStackNavigator()

export default () => {
  const [options, setOptions] = React.useState({ search: '' })
  const { books, loading, error, loadMore, nextPage, refreshing, refresh, loadingMore } = useBooks(options)

  React.useEffect(() => {
    changeNavigationBarColor(THEME.BACKGROUND, true)
    RNBootSplash.hide({ fade: true })
  }, [])

  const handleSearch = (opts) => {
    setOptions(opts)
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={THEME.BACKGROUND}
        barStyle='light-content'
      />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: THEME.BACKGROUND },
          headerTintColor: THEME.BASE,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen name='Home' options={{ title: 'Gutenberg Books', headerShown: false }}>
          {props => (
            <View style={{ flex: 1, backgroundColor: THEME.BACKGROUND }}>
              <BookSearch value={options.search} onChange={v => setOptions(o => ({ ...o, search: v }))} onSearch={handleSearch} loading={loading} />
              <HomeScreen
                books={books}
                loading={loading}
                error={error}
                loadMore={loadMore}
                nextPage={nextPage}
                refreshing={refreshing}
                refresh={refresh}
                loadingMore={loadingMore}
                navigation={props.navigation}
              />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen
          name='BookDetail'
          component={BookDetail}
          options={({ route }) => ({
            title: route.params?.book?.title || 'Book Detail'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
