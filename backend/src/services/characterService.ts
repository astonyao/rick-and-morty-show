import { CharacterModel } from '../models/characterModel.js'
import type { 
  Character, 
  CreateCharacterRequest
} from '../types/api.js'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE
} from '../constants/app.js'
import { isValidImageUrl } from '../utils/validation.js'

export interface PaginatedCharacters {
  characters: Character[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class CharacterService {
  private characterModel = new CharacterModel()

  async getAllCharacters(options: {
    page?: number
    limit?: number
  } = {}): Promise<PaginatedCharacters> {
    const page = Math.max(MIN_PAGE_SIZE, options.page || MIN_PAGE_SIZE)
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, options.limit || DEFAULT_PAGE_SIZE))
    const offset = (page - 1) * limit

    // Get total count for pagination
    const countResult = await this.characterModel.count()

    if (!countResult.success) {
      throw new Error(countResult.error?.message || 'Failed to count characters')
    }

    const totalItems = countResult.data || 0
    const totalPages = Math.ceil(totalItems / limit)

    // Get characters
    const charactersResult = await this.characterModel.findAll({
      limit,
      offset
    })

    if (!charactersResult.success) {
      throw new Error(charactersResult.error?.message || 'Failed to fetch characters')
    }

    return {
      characters: charactersResult.data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  async createCharacter(data: CreateCharacterRequest): Promise<Character> {
    // Basic business logic validation
    this.validateCharacterData(data)

    const result = await this.characterModel.create(data)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create character')
    }

    if (!result.data) {
      throw new Error('Character creation returned no data')
    }

    return result.data
  }

  // Basic validation for character data
  private validateCharacterData(data: CreateCharacterRequest): void {
    if (data.image && !isValidImageUrl(data.image)) {
      throw new Error('Image URL must point to a valid image file')
    }
  }

  // Note: isValidImageUrl is now imported from ../utils/validation to eliminate duplication
}