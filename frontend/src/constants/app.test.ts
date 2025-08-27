import { describe, it, expect } from 'vitest'
import {
  RICK_MORTY_API_MAX_ID,
  IMAGE_EXTENSIONS,
  VALID_PROTOCOLS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_TRUNCATE_LENGTH,
  GENDER_SYMBOLS,
  STATUS_COLORS
} from './app'

describe('App Constants', () => {
  it('should have correct Rick and Morty API max ID', () => {
    expect(RICK_MORTY_API_MAX_ID).toBe(826)
  })

  it('should have valid image extensions', () => {
    expect(IMAGE_EXTENSIONS).toEqual(['.jpg', '.jpeg', '.png', '.gif', '.webp'])
    expect(IMAGE_EXTENSIONS).toHaveLength(5)
  })

  it('should have valid protocols', () => {
    expect(VALID_PROTOCOLS).toEqual(['http:', 'https:'])
    expect(VALID_PROTOCOLS).toHaveLength(2)
  })

  it('should have correct pagination constants', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(20)
    expect(MAX_PAGE_SIZE).toBe(100)
    expect(MIN_PAGE_SIZE).toBe(1)
    expect(MIN_PAGE_SIZE).toBeLessThan(DEFAULT_PAGE_SIZE)
    expect(DEFAULT_PAGE_SIZE).toBeLessThan(MAX_PAGE_SIZE)
  })

  it('should have default debounce delay', () => {
    expect(DEFAULT_DEBOUNCE_DELAY).toBe(300)
  })

  it('should have default truncate length', () => {
    expect(DEFAULT_TRUNCATE_LENGTH).toBe(100)
  })

  it('should have gender symbols for all types', () => {
    expect(GENDER_SYMBOLS.Male).toBe('♂')
    expect(GENDER_SYMBOLS.Female).toBe('♀')
    expect(GENDER_SYMBOLS.Genderless).toBe('⚲')
    expect(GENDER_SYMBOLS.unknown).toBe('?')
  })

  it('should have status colors for all types', () => {
    expect(STATUS_COLORS.Alive).toBe('bg-green-100 text-green-800')
    expect(STATUS_COLORS.Dead).toBe('bg-red-100 text-red-800')
    expect(STATUS_COLORS.unknown).toBe('bg-gray-100 text-gray-800')
  })
})