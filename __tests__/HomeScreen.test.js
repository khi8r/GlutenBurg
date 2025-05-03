import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { HomeScreen } from '../components/HomeScreen'

const mockNavigation = { navigate: jest.fn() }
const mockBook = {
  id: 1,
  title: 'Test Book',
  authors: [{ name: 'Author' }],
  formats: { 'image/jpeg': 'http://example.com/cover.jpg' },
  subjects: ['Fiction'],
  summaries: ['A summary of the book.']
}

const renderHomeScreen = (props = {}) => {
  const defaultProps = {
    books: [],
    loading: false,
    error: null,
    loadMore: jest.fn(),
    nextPage: null,
    refreshing: false,
    refresh: jest.fn(),
    loadingMore: false,
    navigation: mockNavigation
  }
  return render(<HomeScreen {...defaultProps} {...props} />)
}

describe('HomeScreen', () => {
  it('shows skeletons when loading', () => {
    const { getAllByTestId } = renderHomeScreen({ loading: true })
    expect(getAllByTestId('skeleton-book-card').length).toBeGreaterThan(0)
  })

  it('shows nothing found when no books and not loading or error', () => {
    const { getByText } = renderHomeScreen()
    expect(getByText('Nothing found')).toBeTruthy()
  })

  it('shows error view when error is present', () => {
    const { getByText } = renderHomeScreen({ error: true })
    expect(getByText('Error loading books.')).toBeTruthy()
  })

  it('renders a list of books', () => {
    const { getByText } = renderHomeScreen({ books: [mockBook] })
    expect(getByText('Test Book')).toBeTruthy()
    expect(getByText('Author')).toBeTruthy()
  })

  it('renders and interacts with Load More button', () => {
    const loadMore = jest.fn()
    const { getByText } = renderHomeScreen({
      books: [mockBook],
      loadMore,
      nextPage: 2
    })
    const btn = getByText('Load More')
    fireEvent.press(btn)
    expect(loadMore).toHaveBeenCalled()
  })
})
