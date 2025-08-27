import type { Character, CharacterListResponse } from '../types/character'
import { apiService } from './api'

const RICK_MORTY_API_BASE = 'https://rickandmortyapi.com/api'

export const rickMortyApi = {
  async getCharacters(page: number = 1): Promise<CharacterListResponse | null> {
    const response = await apiService.get<CharacterListResponse>(
      `${RICK_MORTY_API_BASE}/character?page=${page}`
    )

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || 'Failed to fetch characters')
  },

  async getCharacter(id: number): Promise<Character | null> {
    const response = await apiService.get<Character>(
      `${RICK_MORTY_API_BASE}/character/${id}`
    )

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || 'Failed to fetch character')
  },

  async searchCharacters(name: string, page: number = 1): Promise<CharacterListResponse | null> {
    const response = await apiService.get<CharacterListResponse>(
      `${RICK_MORTY_API_BASE}/character?name=${encodeURIComponent(name)}&page=${page}`
    )

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || 'Failed to search characters')
  },
}