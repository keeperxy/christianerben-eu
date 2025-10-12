import { screen } from '@testing-library/react'
import { renderWithSettings } from '../test-utils'
import Footer from './Footer'
import { describe, it, expect } from 'vitest'

describe('Footer', () => {
  it('renders privacy link', () => {
    renderWithSettings(<Footer />)
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
  })
})
