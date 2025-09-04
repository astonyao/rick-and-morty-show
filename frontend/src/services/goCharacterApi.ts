import { apiService } from './api';
import type { Character, CreateCharacterRequest } from '../types/character';

export class GoCharacterApi {
  async getCharacters(): Promise<Character[]> {
    const response = await apiService.get<Character[]>('/characters', 'go');
    if (response.success) {
      return response.data;
    }
    return [];
  }

  async createCharacter(character: CreateCharacterRequest): Promise<Character | null> {
    const response = await apiService.post<Character>('/characters', character, 'go');
    if (response.success) {
      return response.data;
    }
    return null;
  }
}
