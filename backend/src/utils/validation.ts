/**
 * Shared validation utilities to eliminate code duplication
 */

import { IMAGE_EXTENSIONS, VALID_PROTOCOLS } from '../constants/app.js'

/**
 * Validate image URL format
 * Checks if URL has valid protocol and image extension
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return VALID_PROTOCOLS.includes(parsed.protocol) && 
           IMAGE_EXTENSIONS.some(ext => parsed.pathname.toLowerCase().endsWith(ext))
  } catch {
    return false
  }
}