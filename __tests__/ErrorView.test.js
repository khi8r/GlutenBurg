import React from 'react'
import { render } from '@testing-library/react-native'
import { ErrorView } from '../components/ErrorView'

describe('ErrorView', () => {
  it('renders the error message', () => {
    const message = 'Something went wrong!'
    const { getByText } = render(<ErrorView message={message} />)
    expect(getByText(message)).toBeTruthy()
  })
})
