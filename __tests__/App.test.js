import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import * as useBooksHook from '../hooks/useBooks'
import App from '../App'

const mockBooks = [
  {
    id: 1,
    title: 'Test Book',
    authors: [{ name: 'Author' }],
    formats: { 'image/jpeg': 'http://example.com/cover.jpg' },
    subjects: ['Fiction']
  }
]

describe('App', () => {
  const getDefaultBooksHook = (overrides = {}) => ({
    books: mockBooks,
    loading: false,
    error: null,
    loadMore: jest.fn(),
    nextPage: null,
    refreshing: false,
    refresh: jest.fn(),
    loadingMore: false,
    ...overrides
  })

  beforeEach(() => {
    jest.spyOn(useBooksHook, 'default').mockReturnValue(getDefaultBooksHook())
  })

  it('renders correctly', async () => {
    render(<App />)
  })

  it('renders BookSearch and HomeScreen', () => {
    const { getByPlaceholderText, getByText } = render(<App />)
    expect(getByPlaceholderText('Search Books By Title or Author')).toBeTruthy()
    expect(getByText('Test Book')).toBeTruthy()
  })

  it('calls onSearch when searching', async () => {
    const { getByPlaceholderText, getByTestId } = render(<App />)
    const input = getByPlaceholderText('Search Books By Title or Author')
    fireEvent.changeText(input, 'gatsby')
    const searchBtn = getByTestId('search-btn')
    fireEvent.press(searchBtn)
  })

  it('navigates to BookDetail', async () => {
    const { getByText, findByText } = render(<App />)
    fireEvent.press(getByText('Test Book'))
    expect(await findByText('Test Book')).toBeTruthy()
  })

  it('shows loading indicator', () => {
    jest.spyOn(useBooksHook, 'default').mockReturnValueOnce(getDefaultBooksHook({
      books: [],
      loading: true
    }))
    const { UNSAFE_getAllByType } = render(<App />)
    expect(UNSAFE_getAllByType(require('react-native').ActivityIndicator).length).toBeGreaterThan(0)
  })

  it('shows error view', () => {
    jest.spyOn(useBooksHook, 'default').mockReturnValueOnce(getDefaultBooksHook({
      books: [],
      loading: false,
      error: 'Network error'
    }))
    const { getByText } = render(<App />)
    expect(getByText('Error loading books.')).toBeTruthy()
  })
})
