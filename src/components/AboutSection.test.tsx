import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithSettings } from '../test-utils'
import AboutSection from './AboutSection'
import { describe, it, expect } from 'vitest'

describe('AboutSection', () => {
  it('renders title', () => {
    renderWithSettings(<AboutSection />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })
})
