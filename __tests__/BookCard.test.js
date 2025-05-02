import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { BookCard } from '../components/BookCard'

const baseProps = {
  title: 'Test Book',
  author: 'Jane Doe',
  image: 'https://example.com/image.jpg',
  description: 'A fascinating test book.',
  skeleton: false,
  subjects: ['Fiction', 'Adventure'],
  formats: {},
  containerStyle: {},
  sharedElementId: 'book-1'
}

describe('BookCard', () => {
  it('renders title, author, and description', () => {
    const { getByText } = render(<BookCard {...baseProps} />)
    expect(getByText('Test Book')).toBeTruthy()
    expect(getByText('Jane Doe')).toBeTruthy()
    expect(getByText('A fascinating test book.')).toBeTruthy()
  })

  it('renders subject badges', () => {
    const { getByText } = render(<BookCard {...baseProps} />)
    expect(getByText('Fiction')).toBeTruthy()
    expect(getByText('Adventure')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(<BookCard {...baseProps} onPress={onPressMock} />)
    fireEvent.press(getByRole('button'))
    expect(onPressMock).toHaveBeenCalled()
  })

  it('shows skeleton when skeleton prop is true', () => {
    const { queryByText } = render(<BookCard {...baseProps} skeleton />)
    expect(queryByText('Test Book')).toBeNull()
    expect(queryByText('Jane Doe')).toBeNull()
  })

  it('does not render description if not provided', () => {
    const { queryByText } = render(<BookCard {...baseProps} description={undefined} />)
    expect(queryByText('A fascinating test book.')).toBeNull()
  })
})
