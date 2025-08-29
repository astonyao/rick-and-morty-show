import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  getStatusColor, 
  getGenderDisplay,
  isCustomCharacter
} from './helpers'
import { isValidImageUrl } from './validation'
import type { Character } from '../types/character'

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format valid date strings', () => {
      const date = '2017-11-04T18:48:46.250Z'
      const formatted = formatDate(date)
      expect(formatted).toContain('2017')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('Unknown date')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getStatusColor('Alive')).toBe('bg-green-100 text-green-800')
      expect(getStatusColor('Dead')).toBe('bg-red-100 text-red-800')
      expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('getGenderDisplay', () => {
    it('should return correct symbols for each gender', () => {
      expect(getGenderDisplay('Male')).toBe('♂')
      expect(getGenderDisplay('Female')).toBe('♀')
      expect(getGenderDisplay('Genderless')).toBe('⚲')
      expect(getGenderDisplay('unknown')).toBe('?')
    })
  })

  describe('isCustomCharacter', () => {
    it('should identify Rick and Morty API characters', () => {
      const rmCharacter: Character = {
        id: 1,
        url: 'https://rickandmortyapi.com/api/character/1',
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: '' },
        location: { name: 'Earth', url: '' },
        image: 'https://example.com/rick.jpg',
        episode: [],
        created: '2017-11-04T18:48:46.250Z'
      }
      expect(isCustomCharacter(rmCharacter)).toBe(false)
    })

    it('should identify custom characters by high ID', () => {
      const customCharacter: Character = {
        id: 1000,
        url: 'http://localhost:3001/api/characters/1000',
        name: 'Custom Rick',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: '' },
        location: { name: 'Earth', url: '' },
        image: 'https://example.com/custom-rick.jpg',
        episode: [],
        created: '2024-01-01T00:00:00.000Z'
      }
      expect(isCustomCharacter(customCharacter)).toBe(true)
    })
  })

  describe('isValidImageUrl', () => {
    it('should validate correct image URLs', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true)
      expect(isValidImageUrl('http://example.com/image.png')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.gif')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidImageUrl('not-a-url')).toBe(false)
      expect(isValidImageUrl('https://example.com/file.txt')).toBe(false)
      expect(isValidImageUrl('')).toBe(false)
    })
  })

  
})