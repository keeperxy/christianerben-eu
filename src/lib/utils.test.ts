import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins class names with space', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges duplicate classes', () => {
    expect(cn('bg-red-500', 'bg-red-500')).toBe('bg-red-500')
  })

  it('keeps custom font sizes next to text colors', () => {
    expect(cn('text-small', 'text-foreground')).toBe('text-small text-foreground')
    expect(cn('text-title', 'text-body')).toBe('text-body')
  })
})
