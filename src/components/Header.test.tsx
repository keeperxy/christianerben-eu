import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSettings } from '../test-utils'
import Header from './Header'
import { describe, it, expect } from 'vitest'

describe('Header', () => {
  it('renders navigation', () => {
    renderWithSettings(<Header />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })

})
