import { describe, it, expect } from 'vitest'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  IMAGE_EXTENSIONS,
  VALID_PROTOCOLS
} from './app'

describe('Backend App Constants', () => {
  it('should have correct pagination constants', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(20)
    expect(MAX_PAGE_SIZE).toBe(100)
    expect(MIN_PAGE_SIZE).toBe(1)
    expect(MIN_PAGE_SIZE).toBeLessThan(DEFAULT_PAGE_SIZE)
    expect(DEFAULT_PAGE_SIZE).toBeLessThan(MAX_PAGE_SIZE)
  })

  it('should have valid image extensions', () => {
    expect(IMAGE_EXTENSIONS).toEqual(['.jpg', '.jpeg', '.png', '.gif', '.webp'])
    expect(IMAGE_EXTENSIONS).toHaveLength(5)
  })

  it('should have valid protocols', () => {
    expect(VALID_PROTOCOLS).toEqual(['http:', 'https:'])
    expect(VALID_PROTOCOLS).toHaveLength(2)
  })
})