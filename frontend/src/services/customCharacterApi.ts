import { apiService } from './api.js'
import type { Character, CreateCharacterRequest } from '../types/character.js'

export class CustomCharacterApi {
  async getCustomCharacters(): Promise<Character[]> {
    const response = await apiService.get<{ results: Character[], info: any }>('/api/characters')
    if (response.success && response.data) {
      return response.data.results || []
    }
    return []
  }

  async createCustomCharacter(character: CreateCharacterRequest): Promise<Character | null> {
    const response = await apiService.post<Character>('/api/characters', character)
    if (response.success && response.data) {
      return response.data
    }
    return null
  }
}