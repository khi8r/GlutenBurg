import React from 'react'
import { render } from '@testing-library/react-native'
import { SkeletonBookCard } from '../components/SkeletonBookCard'

describe('SkeletonBookCard', () => {
  it('renders the skeleton book card container', () => {
    const { getByTestId } = render(<SkeletonBookCard />)
    expect(getByTestId('skeleton-book-card')).toBeTruthy()
  })

  it('renders BookCard in skeleton mode', () => {
    const { UNSAFE_queryByProps } = render(<SkeletonBookCard />)
    expect(UNSAFE_queryByProps({ skeleton: true })).not.toBeNull()
  })
})
