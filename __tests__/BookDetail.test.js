import React from 'react'
import { render } from '@testing-library/react-native'
import { BookDetail } from '../components/BookDetail'

const mockRoute = {
  params: {
    book: {
      id: 1,
      title: 'Test Book',
      authors: [{ name: 'Jane Doe', birth_year: 1970, death_year: 2020 }],
      formats: {
        'image/jpeg': 'https://example.com/cover.jpg',
        'application/epub+zip': 'https://example.com/book.epub',
        'application/pdf': 'https://example.com/book.pdf'
      },
      summaries: ['A fascinating summary.'],
      subjects: ['Fiction', 'Adventure'],
      bookshelves: ['Best Sellers'],
      languages: ['en'],
      media_type: 'Text',
      copyright: false,
      download_count: 123
    }
  }
}

const renderWithRoute = (routeOverrides = {}) => {
  const route = {
    ...mockRoute,
    ...routeOverrides,
    params: {
      ...mockRoute.params,
      ...(routeOverrides.params || {}),
      book: {
        ...mockRoute.params.book,
        ...((routeOverrides.params && routeOverrides.params.book) || {})
      }
    }
  }
  return render(<BookDetail route={route} />)
}

describe('BookDetail', () => {
  it('renders book details', () => {
    const { getByText } = renderWithRoute()
    expect(getByText('Test Book')).toBeTruthy()
    expect(getByText('Jane Doe (1970 - 2020)')).toBeTruthy()
    expect(getByText('A fascinating summary.')).toBeTruthy()
    expect(getByText('Fiction, Adventure')).toBeTruthy()
    expect(getByText('Best Sellers')).toBeTruthy()
    expect(getByText('en')).toBeTruthy()
    expect(getByText('Text')).toBeTruthy()
    expect(getByText('No')).toBeTruthy()
    expect(getByText('123')).toBeTruthy()
  })

  it('renders download links', () => {
    const { getByText } = renderWithRoute()
    expect(getByText('EPUB')).toBeTruthy()
    expect(getByText('PDF')).toBeTruthy()
  })

  it('shows fallback text if no summary', () => {
    const { getByText } = renderWithRoute({ params: { book: { summaries: [] } } })
    expect(getByText('No summary available.')).toBeTruthy()
  })

  it('renders fallback for missing authors', () => {
    const { queryByText } = renderWithRoute({ params: { book: { authors: [] } } })
    expect(queryByText('Jane Doe (1970 - 2020)')).toBeNull()
  })

  it('renders fallback for missing subjects, bookshelves, languages', () => {
    const { getAllByText } = renderWithRoute({
      params: { book: { subjects: undefined, bookshelves: undefined, languages: undefined } }
    })
    expect(getAllByText('N/A').length).toBe(3)
  })

  it('renders Yes for copyright true', () => {
    const { getByText } = renderWithRoute({ params: { book: { copyright: true } } })
    expect(getByText('Yes')).toBeTruthy()
  })

  it('does not render image if missing', () => {
    const formats = { ...mockRoute.params.book.formats }
    delete formats['image/jpeg']
    const { queryByTestId } = renderWithRoute({ params: { book: { formats } } })
    expect(queryByTestId('cover-image')).toBeNull()
  })

  it('does not render download links if none', () => {
    const { queryByText } = renderWithRoute({
      params: { book: { formats: { 'image/jpeg': 'https://example.com/cover.jpg' } } }
    })
    expect(queryByText('EPUB')).toBeNull()
    expect(queryByText('PDF')).toBeNull()
  })
})
