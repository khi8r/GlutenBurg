import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { Picker } from '@react-native-picker/picker'
import { LANGUAGES } from '../utils/filterOptions'

import { View, TextInput, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, ActivityIndicator, Text, LayoutAnimation } from 'react-native'
import { THEME } from '../theme'

const FiltersPanel = React.memo(({ options, handleFilterChange, styles }) => {
  const languageValue = options.languages || ''
  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Author Year Start:</Text>
        <TextInput
          style={[styles.filterInput, styles.filterInputSelect]}
          keyboardType='numeric'
          placeholder='E.g. 1800'
          value={options.author_year_start ? String(options.author_year_start) : ''}
          onChangeText={v => handleFilterChange('author_year_start', v ? parseInt(v, 10) : undefined)}
          placeholderTextColor={THEME.SECONDARY_TEXT}
        />
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Author Year End:</Text>
        <TextInput
          style={[styles.filterInput, styles.filterInputSelect]}
          keyboardType='numeric'
          placeholder='E.g. 1899'
          value={options.author_year_end ? String(options.author_year_end) : ''}
          onChangeText={v => handleFilterChange('author_year_end', v ? parseInt(v, 10) : undefined)}
          placeholderTextColor={THEME.SECONDARY_TEXT}
        />
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Languages:</Text>
        <View style={{ flex: 1, borderRadius: 6, backgroundColor: THEME.BACKGROUND, borderWidth: 1, borderColor: THEME.SURFACE1, justifyContent: 'center' }}>
          <Picker
            selectedValue={languageValue}
            onValueChange={v => handleFilterChange('languages', v)}
            style={{ width: '100%', color: THEME.BLUE, minWidth: 0 }}
            dropdownIconColor={THEME.BLUE}
            mode='dialog'
          >
            <Picker.Item label='All Languages' value='' />
            {LANGUAGES.map(lang => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Topic:</Text>
        <TextInput
          style={[styles.filterInput, styles.filterInputSelect]}
          placeholder='E.g. Fiction, Science, History'
          value={options.topic || ''}
          onChangeText={v => handleFilterChange('topic', v)}
          placeholderTextColor={THEME.SECONDARY_TEXT}
        />
      </View>
    </View>
  )
})

export const BookSearch = ({ value, onSearch, loading }) => {
  const inputRef = React.useRef()
  const [input, setInput] = React.useState(value || '')
  const [filtersVisible, setFiltersVisible] = React.useState(false)
  const [options, setOptions] = React.useState({
    search: value || '',
    author_year_start: undefined,
    author_year_end: undefined,
    languages: '',
    topic: ''
  })

  const [initialOptions, setInitialOptions] = React.useState({
    search: value || '',
    author_year_start: undefined,
    author_year_end: undefined,
    languages: '',
    topic: ''
  })
  const [lastSearchedOptions, setLastSearchedOptions] = React.useState({
    search: value || '',
    author_year_start: undefined,
    author_year_end: undefined,
    languages: '',
    topic: ''
  })
  const [searchDisabled, setSearchDisabled] = React.useState(false)

  React.useEffect(() => {
    if (value === initialOptions.search) return
    setInput(value || '')
    setOptions(prev => ({
      ...prev,
      search: value || '',
      author_year_start: undefined,
      author_year_end: undefined,
      languages: '',
      topic: ''
    }))
    setInitialOptions({
      search: value || '',
      author_year_start: undefined,
      author_year_end: undefined,
      languages: '',
      topic: ''
    })
    setLastSearchedOptions({
      search: value || '',
      author_year_start: undefined,
      author_year_end: undefined,
      languages: '',
      topic: ''
    })
  }, [value])

  const isOptionsChanged = React.useMemo(() => {
    const initial = initialOptions
    const current = options
    return (
      (initial.search || '') !== (current.search || '') ||
      (initial.author_year_start || '') !== (current.author_year_start || '') ||
      (initial.author_year_end || '') !== (current.author_year_end || '') ||
      (initial.languages || '') !== (current.languages || '') ||
      (initial.topic || '') !== (current.topic || '')
    )
  }, [options, initialOptions])

  const handleCardPress = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [])

  const handleInputChange = React.useCallback((text) => {
    setInput(text)
    setOptions(prev => ({ ...prev, search: text }))
  }, [])

  const handleSearch = React.useCallback(() => {
    if (onSearch) onSearch(options)
    setLastSearchedOptions({ ...options })
    setSearchDisabled(true)
  }, [onSearch, options])

  React.useEffect(() => {
    if (!loading) {
      setInitialOptions({ ...lastSearchedOptions })
      setInput(lastSearchedOptions.search || '')
      setSearchDisabled(false)
    }
  }, [loading])

  const handleFilterChange = React.useCallback((key, val) => {
    setOptions(prev => ({ ...prev, [key]: val }))
  }, [])

  const toggleFilters = React.useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    setFiltersVisible(v => !v)
  }, [])

  return (
    <TouchableWithoutFeedback onPress={handleCardPress}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            ref={inputRef}
            placeholder='Search Books By Title or Author'
            value={input}
            onChangeText={handleInputChange}
            style={styles.input}
            placeholderTextColor={THEME.SECONDARY_TEXT}
            selectionColor={THEME.PRIMARY_TEXT}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={toggleFilters}
            style={[styles.iconButton, { backgroundColor: THEME.SURFACE1, marginRight: 8 }]}
            accessibilityLabel='Show Filters'
            accessible
          >
            <Feather name={filtersVisible ? 'chevron-up' : 'filter'} size={22} color={THEME.ACCENT} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearch}
            style={[
              styles.iconButton,
              { backgroundColor: THEME.ACCENT },
              (loading || !isOptionsChanged || searchDisabled) && { opacity: 0.5, backgroundColor: THEME.SURFACE2 }
            ]}
            disabled={loading || !isOptionsChanged || searchDisabled}
            accessibilityLabel='Search'
            accessible
          >
            {loading
              ? <ActivityIndicator size='small' color={THEME.ACCENT} />
              : <Feather name='search' size={22} color={THEME.BASE} />}
          </TouchableOpacity>
        </View>
        {filtersVisible && (
          <FiltersPanel options={options} handleFilterChange={handleFilterChange} styles={styles} />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 2,
    margin: 12,
    backgroundColor: THEME.BACKGROUND,
    borderWidth: 2,
    borderColor: THEME.SURFACE0,
    shadowColor: THEME.SURFACE0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    padding: 10
  },
  input: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: THEME.BASE,
    color: THEME.BLUE,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: THEME.SURFACE1
  },
  iconButton: {
    marginLeft: 8,
    padding: 0,
    borderRadius: 10,
    backgroundColor: THEME.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36
  },
  filtersContainer: {
    marginTop: 12,
    backgroundColor: THEME.BASE,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.SURFACE1
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  filterLabel: {
    width: 120,
    color: THEME.BLUE,
    fontSize: 14
  },
  filterInput: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: THEME.BACKGROUND,
    color: THEME.BLUE,
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: THEME.SURFACE1
  },
  filterInputSelect: {
    height: 50,
    minHeight: 50,
    maxHeight: 50
  }
})
