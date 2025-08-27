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
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Check if character is custom (has numeric ID > 826 or custom URL)
 */
export function isCustomCharacter(character: Character): boolean {
  // Rick and Morty API has max characters defined in constants
  // Custom characters will have higher IDs or custom URLs
  return character.id > RICK_MORTY_API_MAX_ID || !character.url.includes('rickandmortyapi.com')
}

/**
 * Generate character URL slug for routing
 */
export function generateCharacterSlug(character: Character): string {
  return `${character.id}-${character.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
}

/**
 * Parse character slug to get ID
 */
export function parseCharacterSlug(slug: string): number {
  const match = slug.match(/^(\d+)-/)
  return match ? parseInt(match[1], 10) : 0
}

// Note: isValidImageUrl is now exported from ./validation to eliminate duplication

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate pagination info
 */
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  startItem: number
  endItem: number
  totalItems: number
}

export function getPaginationInfo(
  currentPage: number,
  totalPages: number,
  itemsPerPage: number,
  totalItems: number
): PaginationInfo {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return {
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startItem,
    endItem,
    totalItems,
  }
}

/**
 * Filter characters by search term
 */
export function filterCharacters(
  characters: Character[],
  searchTerm: string
): Character[] {
  if (!searchTerm.trim()) return characters

  const term = searchTerm.toLowerCase()
  return characters.filter(character =>
    character.name.toLowerCase().includes(term) ||
    character.species.toLowerCase().includes(term) ||
    character.status.toLowerCase().includes(term) ||
    character.origin.name.toLowerCase().includes(term) ||
    character.location.name.toLowerCase().includes(term)
  )
}

/**
 * Sort characters by different criteria
 */
export function sortCharacters(
  characters: Character[],
  sortBy: 'name' | 'id' | 'created' | 'status' | 'species',
  order: 'asc' | 'desc' = 'asc'
): Character[] {
  return [...characters].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'id':
        comparison = a.id - b.id
        break
      case 'created':
        comparison = new Date(a.created).getTime() - new Date(b.created).getTime()
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'species':
        comparison = a.species.localeCompare(b.species)
        break
      default:
        return 0
    }

    return order === 'desc' ? -comparison : comparison
  })
}