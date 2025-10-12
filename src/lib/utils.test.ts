import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins class names with space', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges duplicate classes', () => {
    expect(cn('bg-red-500', 'bg-red-500')).toBe('bg-red-500')
  })
})
