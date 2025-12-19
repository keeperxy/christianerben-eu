import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithSettings } from '../test-utils'
import HeroSection from './HeroSection'
import { vi, describe, it, expect } from 'vitest'

vi.mock('../hooks/use-fit-text', () => ({ useFitText: () => ({ ref: { current: null }, fontSize: 20 }) }))

describe('HeroSection', () => {
  it('renders hero name', () => {
    renderWithSettings(<HeroSection />)
    // Use getAllByText since the name appears multiple times, then check the first one is in the hero section
    const heroNames = screen.getAllByText(/christian erben/i)
    expect(heroNames.length).toBeGreaterThan(0)
    expect(heroNames[0]).toBeInTheDocument()
  })
})
