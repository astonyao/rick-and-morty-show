import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { CharacterModel } from './characterModel'
import { initializeDatabase, closeDatabase, getDatabase } from '../database/connection'
import type { CreateCharacterRequest } from '../types/api'

describe('CharacterModel', () => {
  let characterModel: CharacterModel

  beforeAll(() => {
    // Initialize test database
    initializeDatabase({ path: ':memory:', type: 'sqlite' })
  })

  afterAll(() => {
    // Clean up database connection
    closeDatabase()
  })

  beforeEach(() => {
    // Clear all data before each test
    const db = getDatabase()
    db.exec('DELETE FROM characters')
    characterModel = new CharacterModel()
  })

  const mockCharacterData: CreateCharacterRequest = {
    name: 'Test Rick',
    status: 'Alive',
    species: 'Human',
    type: 'Test Subject',
    gender: 'Male',
    origin: {
      name: 'Test Dimension',
      url: 'http://example.com/dimension/1'
    },
    location: {
      name: 'Test Lab',
      url: 'http://example.com/location/1'
    },
    image: 'http://example.com/test-rick.jpg',
    episode: ['http://example.com/episode/1']
  }

  describe('create', () => {
    it('should create a new character', async () => {
      const result = await characterModel.create(mockCharacterData)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.name).toBe(mockCharacterData.name)
      expect(result.data?.status).toBe(mockCharacterData.status)
      expect(result.data?.species).toBe(mockCharacterData.species)
    })

    it('should generate correct URL for new character', async () => {
      const result = await characterModel.create(mockCharacterData)

      expect(result.success).toBe(true)
      expect(result.data?.url).toMatch(/\/api\/characters\/\d+/)
    })
  })


  describe('findAll', () => {
    it('should return empty array when no characters exist', async () => {
      const result = await characterModel.findAll()

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it('should return characters when they exist', async () => {
      // Create some test characters
      await characterModel.create(mockCharacterData)
      await characterModel.create({ ...mockCharacterData, name: 'Test Morty' })

      const result = await characterModel.findAll()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })

    it('should respect limit parameter', async () => {
      // Create multiple characters
      for (let i = 0; i < 5; i++) {
        await characterModel.create({ ...mockCharacterData, name: `Test Character ${i}` })
      }

      const result = await characterModel.findAll({ limit: 3 })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(3)
    })

  })


  describe('count', () => {
    it('should return 0 when no characters exist', async () => {
      const result = await characterModel.count()

      expect(result.success).toBe(true)
      expect(result.data).toBe(0)
    })

    it('should return correct count', async () => {
      // Create some characters
      await characterModel.create(mockCharacterData)
      await characterModel.create({ ...mockCharacterData, name: 'Another Character' })

      const result = await characterModel.count()

      expect(result.success).toBe(true)
      expect(result.data).toBe(2)
    })

  })
})