import React from 'react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { screen } from '@testing-library/react'
import { renderWithSettings } from '../test-utils'
import { siteContent } from '@/content/content'
import AboutSection from './AboutSection'
import { describe, it, expect } from 'vitest'

describe('AboutSection', () => {
  it('renders title', () => {
    renderWithSettings(<AboutSection />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })

  it('uses a concrete responsive stats grid class', () => {
    const source = readFileSync(path.resolve(process.cwd(), 'src/components/AboutSection.tsx'), 'utf8')
    expect(source).not.toContain('sm:grid-cols-${')

    renderWithSettings(<AboutSection />)
    const firstStatLabel = screen.getByText(siteContent.about.labels.experience.en)
    expect(firstStatLabel.closest('.grid')).toHaveClass('sm:grid-cols-3')
  })
})
