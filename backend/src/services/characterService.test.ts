import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CharacterService } from './characterService'

// Mock the CharacterModel
vi.mock('../models/characterModel', () => {
  return {
    CharacterModel: vi.fn().mockImplementation(() => ({
      findAll: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    }))
  }
})

describe('CharacterService', () => {
  let characterService: CharacterService
  let mockCharacterModel: any

  beforeEach(() => {
    characterService = new CharacterService()
    // Get the mocked instance
    mockCharacterModel = (characterService as any).characterModel
  })

  const mockCharacter = {
    id: 1,
    name: 'Test Rick',
    status: 'Alive' as const,
    species: 'Human',
    type: 'Test',
    gender: 'Male' as const,
    origin: { name: 'Test Dimension', url: 'http://example.com/origin' },
    location: { name: 'Test Lab', url: 'http://example.com/location' },
    image: 'http://example.com/image.jpg',
    episode: ['http://example.com/episode/1'],
    url: 'http://example.com/character/1',
    created: '2024-01-01T00:00:00.000Z'
  }

  describe('getAllCharacters', () => {
    it('should return paginated characters', async () => {
      mockCharacterModel.count.mockResolvedValue({ success: true, data: 25 })
      mockCharacterModel.findAll.mockResolvedValue({ success: true, data: [mockCharacter] })

      const result = await characterService.getAllCharacters({ page: 1, limit: 20 })

      expect(result.characters).toEqual([mockCharacter])
      expect(result.pagination.totalItems).toBe(25)
      expect(result.pagination.totalPages).toBe(2)
      expect(result.pagination.currentPage).toBe(1)
      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrev).toBe(false)
    })

    it('should handle database errors', async () => {
      mockCharacterModel.count.mockResolvedValue({ 
        success: false, 
        error: { message: 'Database error' } 
      })

      await expect(characterService.getAllCharacters()).rejects.toThrow('Database error')
    })
  })


  describe('createCharacter', () => {
    const createData = {
      name: 'New Rick',
      status: 'Alive' as const,
      species: 'Human',
      gender: 'Male' as const,
      origin: { name: 'Test Dimension' },
      location: { name: 'Test Lab' },
      image: 'http://example.com/image.jpg'
    }

    it('should create character successfully', async () => {
      mockCharacterModel.create.mockResolvedValue({ success: true, data: mockCharacter })

      const result = await characterService.createCharacter(createData)

      expect(result).toEqual(mockCharacter)
      expect(mockCharacterModel.create).toHaveBeenCalledWith(createData)
    })

    it('should validate image URL', async () => {
      const invalidData = { ...createData, image: 'invalid-url' }

      await expect(characterService.createCharacter(invalidData))
        .rejects.toThrow('Image URL must point to a valid image file')
    })

    it('should handle database errors', async () => {
      mockCharacterModel.create.mockResolvedValue({ 
        success: false, 
        error: { message: 'Database error' } 
      })

      await expect(characterService.createCharacter(createData)).rejects.toThrow('Database error')
    })
  })

})