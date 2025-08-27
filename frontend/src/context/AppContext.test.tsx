import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { CharacterProvider, useCharacterContext, type DataSource } from './AppContext'

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

// Helper wrapper for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CharacterProvider>{children}</CharacterProvider>
)

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CharacterProvider', () => {
    it('should provide initial state', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      expect(result.current.rickMortyCharacters).toEqual([])
      expect(result.current.customCharacters).toEqual([])
      expect(result.current.selectedCharacter).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.currentPage).toBe(1)
      expect(result.current.totalPages).toBe(1)
      expect(result.current.dataSource).toBe('all')
    })

    it('should handle setSelectedCharacter', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      const character = {
        id: 1,
        name: 'Test Character',
        status: 'Alive' as const,
        species: 'Human',
        type: '',
        gender: 'Male' as const,
        origin: { name: 'Earth', url: '' },
        location: { name: 'Earth', url: '' },
        image: 'test.jpg',
        episode: [],
        created: '2023-01-01',
        url: 'test-url'
      }

      act(() => {
        result.current.setSelectedCharacter(character)
      })

      expect(result.current.selectedCharacter).toEqual(character)
    })

    it('should handle clearError', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      // First set an error (simulate error state)
      act(() => {
        // We'll need to trigger an error through one of the async functions
        // For now, just test that clearError function exists and is callable
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('data source management', () => {
    it('should change data source', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      act(() => {
        result.current.setDataSource('api')
      })

      expect(result.current.dataSource).toBe('api')
    })

    it('should handle all data source types', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      const dataSources: DataSource[] = ['all', 'api', 'local']
      
      dataSources.forEach(source => {
        act(() => {
          result.current.setDataSource(source)
        })
        expect(result.current.dataSource).toBe(source)
      })
    })
  })

  describe('navigation functions', () => {
    it('should provide navigation functions', () => {
      const { result } = renderHook(() => useCharacterContext(), { wrapper })
      
      expect(typeof result.current.goToNextPage).toBe('function')
      expect(typeof result.current.goToPreviousPage).toBe('function')
      expect(typeof result.current.goToPage).toBe('function')
    })
  })

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useCharacterContext())
    }).toThrow('useCharacterContext must be used within a CharacterProvider')
  })
})