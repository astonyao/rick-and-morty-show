import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { createCharacterRoutes } from './characters'
import { initializeDatabase } from '../database/connection'
import { errorHandler } from '../middleware/errorHandler'

// Mock character data for testing
const mockCharacterData = {
  name: 'API Test Rick',
  status: 'Alive' as const,
  species: 'Human',
  type: 'Test Subject',
  gender: 'Male' as const,
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

describe('Characters API', () => {
  let app: express.Application

  beforeAll(() => {
    // Initialize in-memory database for testing
    initializeDatabase({ path: ':memory:', type: 'sqlite' })

    // Create Express app for testing
    app = express()
    app.use(express.json())
    app.use('/api/characters', createCharacterRoutes())
    app.use(errorHandler)
  })

  describe('POST /api/characters', () => {
    it('should create a new character', async () => {
      const response = await request(app)
        .post('/api/characters')
        .send(mockCharacterData)
        .expect(201)

      // Expect direct data response, not wrapped in ApiResponse
      expect(response.body.name).toBe(mockCharacterData.name)
      expect(response.body.id).toBeDefined()
    })

    it('should validate required fields', async () => {
      const invalidData = { name: 'Test' } // Missing required fields

      const response = await request(app)
        .post('/api/characters')
        .send(invalidData)
        .expect(400)

      // Expect error response without success wrapper
      expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('should validate status enum', async () => {
      const invalidData = {
        ...mockCharacterData,
        status: 'InvalidStatus'
      }

      const response = await request(app)
        .post('/api/characters')
        .send(invalidData)
        .expect(400)

      // Expect error response without success wrapper
      expect(response.body.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('GET /api/characters', () => {
    it('should return all characters with pagination', async () => {
      const response = await request(app)
        .get('/api/characters')
        .expect(200)

      // Expect direct data response with results and info
      expect(response.body.results).toBeDefined()
      expect(response.body.info).toBeDefined()
      expect(response.body.info.currentPage).toBe(1)
    })

    it('should accept pagination parameters', async () => {
      const response = await request(app)
        .get('/api/characters?page=1&limit=5')
        .expect(200)

      // Expect direct data response
      expect(response.body.info.itemsPerPage).toBe(5)
    })

  })

  describe('Integration flow', () => {
    it('should create and list characters', async () => {
      // Create
      const createResponse = await request(app)
        .post('/api/characters')
        .send(mockCharacterData)
        .expect(201)

      expect(createResponse.body.name).toBe(mockCharacterData.name)
      expect(createResponse.body.id).toBeDefined()

      // List and verify it exists
      const listResponse = await request(app)
        .get('/api/characters')
        .expect(200)

      expect(listResponse.body.results).toBeDefined()
      expect(listResponse.body.results.length).toBeGreaterThan(0)

      // Find our created character
      const createdChar = listResponse.body.results.find((char: any) => char.id === createResponse.body.id)
      expect(createdChar).toBeDefined()
      expect(createdChar.name).toBe(mockCharacterData.name)
    })
  })
})