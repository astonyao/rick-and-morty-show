/**
 * Application constants to eliminate magic numbers and hardcoded values
 */

// Rick and Morty API Constants
export const RICK_MORTY_API_MAX_ID = 826

// Image validation constants
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const
export const VALID_PROTOCOLS = ['http:', 'https:'] as const

// Pagination constants  
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const MIN_PAGE_SIZE = 1

// Debounce timing
export const DEFAULT_DEBOUNCE_DELAY = 300

// Text truncation
export const DEFAULT_TRUNCATE_LENGTH = 100

// Gender display symbols
export const GENDER_SYMBOLS = {
  Male: '♂',
  Female: '♀', 
  Genderless: '⚲',
  unknown: '?'
} as const

// Status badge colors
export const STATUS_COLORS = {
  Alive: 'bg-green-100 text-green-800',
  Dead: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-800'
} as const