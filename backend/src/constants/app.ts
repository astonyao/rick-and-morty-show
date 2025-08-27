/**
 * Application constants to eliminate magic numbers and hardcoded values
 */

// Pagination constants
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const MIN_PAGE_SIZE = 1

// Image validation constants
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const
export const VALID_PROTOCOLS = ['http:', 'https:'] as const