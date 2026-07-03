import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSettings } from '../test-utils'
import Header from './Header'
import { describe, it, expect } from 'vitest'

describe('Header', () => {
  it('renders navigation', () => {
    renderWithSettings(<Header />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })

  it('names and closes the mobile navigation sheet after selecting an in-page link', async () => {
    const user = userEvent.setup()
    renderWithSettings(<Header />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    expect(screen.getByRole('dialog', { name: /navigation/i })).toBeInTheDocument()

    await user.click(screen.getAllByRole('link', { name: /about/i })[0])

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /navigation/i })).not.toBeInTheDocument()
    })
  })

})
