import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSettings } from '../test-utils'
import Header from './Header'
import { vi, describe, it, expect } from 'vitest'

vi.mock('../hooks/use-mobile', () => ({ useIsMobile: () => false }))

describe('Header', () => {
  it('renders navigation', () => {
    renderWithSettings(<Header />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })

})
