import { describe, it, expect } from 'vitest'
import { isValidImageUrl } from './validation'

describe('validation utilities', () => {
  describe('isValidImageUrl', () => {
    it('should validate valid image URLs', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true)
      expect(isValidImageUrl('http://example.com/image.png')).toBe(true)
      expect(isValidImageUrl('https://example.com/path/image.gif')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.webp')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.jpeg')).toBe(true)
    })

    it('should reject URLs with invalid protocols', () => {
      expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false)
      expect(isValidImageUrl('file://example.com/image.jpg')).toBe(false)
    })

    it('should reject URLs without image extensions', () => {
      expect(isValidImageUrl('https://example.com/notanimage.txt')).toBe(false)
      expect(isValidImageUrl('https://example.com/noextension')).toBe(false)
      expect(isValidImageUrl('https://example.com/file.pdf')).toBe(false)
    })

    it('should handle invalid URLs gracefully', () => {
      expect(isValidImageUrl('not-a-url')).toBe(false)
      expect(isValidImageUrl('')).toBe(false)
      expect(isValidImageUrl('mailto:test@example.com')).toBe(false)
    })

    it('should be case insensitive for extensions', () => {
      expect(isValidImageUrl('https://example.com/image.JPG')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.PNG')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.GIF')).toBe(true)
    })
  })
})