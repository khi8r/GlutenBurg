import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { BookSearch } from '../components/BookSearch'

const mockOnSearch = jest.fn()

describe('BookSearch', () => {
  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  it('renders input and search button', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <BookSearch value='' onSearch={mockOnSearch} loading={false} />
    )
    expect(getByPlaceholderText('Search Books By Title or Author')).toBeTruthy()
    expect(getByTestId('search-btn')).toBeTruthy()
  })

  it('calls onSearch with options when search button is pressed', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <BookSearch value='gatsby' onSearch={mockOnSearch} loading={false} />
    )

    const input = getByPlaceholderText('Search Books By Title or Author')
    fireEvent.changeText(input, 'gatsby updated')
    fireEvent.press(getByTestId('search-btn'))
    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'gatsby updated' })
    )
  })

  it('updates input value and options on change', () => {
    const { getByPlaceholderText } = render(
      <BookSearch value='' onSearch={mockOnSearch} loading={false} />
    )
    const input = getByPlaceholderText('Search Books By Title or Author')
    fireEvent.changeText(input, 'new search')
    expect(input.props.value).toBe('new search')
  })

  it('disables search button when loading', () => {
    const { getByTestId } = render(
      <BookSearch value='' onSearch={mockOnSearch} loading />
    )
    const button = getByTestId('search-btn')
    expect(button.props.accessibilityState?.disabled).toBe(true)
  })

  it('toggles filters panel', async () => {
    const { getByLabelText, getByText } = render(
      <BookSearch value='' onSearch={mockOnSearch} loading={false} />
    )
    fireEvent.press(getByLabelText('Show Filters'))
    await waitFor(() => {
      expect(getByText('Author Year Start:')).toBeTruthy()
      expect(getByText('Author Year End:')).toBeTruthy()
      expect(getByText('Languages:')).toBeTruthy()
      expect(getByText('Topic:')).toBeTruthy()
    })
  })
})
