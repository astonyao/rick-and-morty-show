import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadRickMortyCharactersForPage,
  loadAllCustomCharacters,
  createNewCustomCharacter,
  handleAsyncError,
  shouldLoadRickMortyData,
  shouldLoadCustomData,
  getDataSourceActions
} from './dataSourceHelpers'

// Mock the API modules
vi.mock('../services/rickMortyApi', () => ({
  rickMortyApi: {
    getCharacters: vi.fn()
  }
}))

vi.mock('../services/customCharacterApi', () => ({
  CustomCharacterApi: vi.fn().mockImplementation(() => ({
    getCustomCharacters: vi.fn(),
    createCustomCharacter: vi.fn()
  }))
}))

describe('dataSourceHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('shouldLoadRickMortyData', () => {
    it('should return true for "all" data source', () => {
      expect(shouldLoadRickMortyData('all')).toBe(true)
    })

    it('should return true for "api" data source', () => {
      expect(shouldLoadRickMortyData('api')).toBe(true)
    })

    it('should return false for "local" data source', () => {
      expect(shouldLoadRickMortyData('local')).toBe(false)
    })
  })

  describe('shouldLoadCustomData', () => {
    it('should return true for "all" data source', () => {
      expect(shouldLoadCustomData('all')).toBe(true)
    })

    it('should return false for "api" data source', () => {
      expect(shouldLoadCustomData('api')).toBe(false)
    })

    it('should return true for "local" data source', () => {
      expect(shouldLoadCustomData('local')).toBe(true)
    })
  })

  describe('handleAsyncError', () => {
    it('should return error message for Error instances', () => {
      const error = new Error('Test error message')
      expect(handleAsyncError(error, 'Fallback')).toBe('Test error message')
    })

    it('should return fallback message for non-Error values', () => {
      expect(handleAsyncError('string error', 'Fallback')).toBe('Fallback')
      expect(handleAsyncError(null, 'Fallback')).toBe('Fallback')
      expect(handleAsyncError(undefined, 'Fallback')).toBe('Fallback')
    })
  })

  describe('loadRickMortyCharactersForPage', () => {
    it('should load characters successfully', async () => {
      const mockResponse = {
        results: [{ id: 1, name: 'Rick' }],
        info: { pages: 42 }
      }

      const { rickMortyApi } = await import('../services/rickMortyApi')
      vi.mocked(rickMortyApi.getCharacters).mockResolvedValue(mockResponse)

      const result = await loadRickMortyCharactersForPage(1)
      
      expect(result.characters).toEqual(mockResponse.results)
      expect(result.totalPages).toBe(42)
      expect(rickMortyApi.getCharacters).toHaveBeenCalledWith(1)
    })

    it('should throw error when API returns null', async () => {
      const { rickMortyApi } = await import('../services/rickMortyApi')
      vi.mocked(rickMortyApi.getCharacters).mockResolvedValue(null)

      await expect(loadRickMortyCharactersForPage(1)).rejects.toThrow('Failed to load characters from API')
    })
  })

  describe('getDataSourceActions', () => {
    it('should return correct actions for "all" data source', () => {
      const actions = getDataSourceActions('all')
      expect(actions.loadRickMorty).toBe(true)
      expect(actions.loadCustom).toBe(true)
      expect(actions.clearRickMorty).toBe(false)
      expect(actions.clearCustom).toBe(false)
    })

    it('should return correct actions for "api" data source', () => {
      const actions = getDataSourceActions('api')
      expect(actions.loadRickMorty).toBe(true)
      expect(actions.loadCustom).toBe(false)
      expect(actions.clearRickMorty).toBe(false)
      expect(actions.clearCustom).toBe(true)
    })

    it('should return correct actions for "local" data source', () => {
      const actions = getDataSourceActions('local')
      expect(actions.loadRickMorty).toBe(false)
      expect(actions.loadCustom).toBe(true)
      expect(actions.clearRickMorty).toBe(true)
      expect(actions.clearCustom).toBe(false)
    })
  })
})