import type { Character } from '../types/character'
import { 
  RICK_MORTY_API_MAX_ID,
  GENDER_SYMBOLS,
  STATUS_COLORS
} from '../constants/app'
import { isValidImageUrl } from './validation'

/**
 * Format date string to human-readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return 'Unknown date'
  }
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: Character['status']): string {
  return STATUS_COLORS[status] || STATUS_COLORS.unknown
}

/**
 * Get gender icon or text
 */
export function getGenderDisplay(gender: Character['gender']): string {
  return GENDER_SYMBOLS[gender] || GENDER_SYMBOLS.unknown
}

/**
 * Check if character is custom (has numeric ID > 826 or custom URL)
 */
export function isCustomCharacter(character: Character): boolean {
  // Rick and Morty API has max characters defined in constants
  // Custom characters will have higher IDs or custom URLs
  return character.id > RICK_MORTY_API_MAX_ID || !character.url.includes('rickandmortyapi.com')
}

// Note: isValidImageUrl is now exported from ./validation to eliminate duplication