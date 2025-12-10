import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithSettings } from '../test-utils'
import HeroSection from './HeroSection'
import { vi, describe, it, expect } from 'vitest'

vi.mock('../hooks/use-fit-text', () => ({ useFitText: () => ({ ref: { current: null }, fontSize: 20 }) }))

describe('HeroSection', () => {
  it('renders hero name', () => {
    renderWithSettings(<HeroSection />)
    expect(screen.getByText(/christian erben/i)).toBeInTheDocument()
  })
})
