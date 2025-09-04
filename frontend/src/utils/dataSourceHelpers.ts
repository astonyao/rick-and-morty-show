/**
 * Data source management helpers to break down large functions
 */

import type { Character, CreateCharacterRequest } from '../types/character'
import { rickMortyApi } from '../services/rickMortyApi'
import { CustomCharacterApi } from '../services/customCharacterApi.js'
import { GoCharacterApi } from '../services/goCharacterApi.js'

const customCharacterApi = new CustomCharacterApi()
const goCharacterApi = new GoCharacterApi()

/**
 * Load Rick and Morty characters for a specific page
 */
export async function loadRickMortyCharactersForPage(page: number): Promise<{
  characters: Character[]
  totalPages: number
}> {
  const response = await rickMortyApi.getCharacters(page)
  if (!response) {
    throw new Error('Failed to load characters from API')
  }
  
  return {
    characters: response.results,
    totalPages: response.info.pages
  }
}

/**
 * Load all custom characters
 */
export async function loadAllCustomCharacters(): Promise<Character[]> {
  return await customCharacterApi.getCustomCharacters()
}

/**
 * Load all go characters
 */
export async function loadAllGoCharacters(): Promise<Character[]> {
  return await goCharacterApi.getCharacters()
}

/**
 * Create a new custom character
 */
export async function createNewCustomCharacter(character: CreateCharacterRequest): Promise<Character> {
  const newCharacter = await customCharacterApi.createCustomCharacter(character)
  if (!newCharacter) {
    throw new Error('Failed to create character')
  }
  return newCharacter
}

/**
 * Handle error safely and return appropriate error message
 */
export function handleAsyncError(error: unknown, fallbackMessage: string): string {
  return error instanceof Error ? error.message : fallbackMessage
}

/**
 * Check if data source should load Rick & Morty characters
 */
export function shouldLoadRickMortyData(dataSource: 'all' | 'api' | 'local' | 'go'): boolean {
  return dataSource === 'all' || dataSource === 'api'
}

/**
 * Check if data source should load custom characters
 */
export function shouldLoadCustomData(dataSource: 'all' | 'api' | 'local' | 'go'): boolean {
  return dataSource === 'all' || dataSource === 'local'
}

/**
 * Data loading strategy for each data source type
 */
export interface DataSourceActions {
  loadRickMorty: boolean
  loadCustom: boolean
  loadGo: boolean
  clearRickMorty: boolean
  clearCustom: boolean
  clearGo: boolean
}

/**
 * Get data loading actions for a specific data source
 */
export function getDataSourceActions(source: 'all' | 'api' | 'local' | 'go'): DataSourceActions {
  switch (source) {
    case 'all':
      return {
        loadRickMorty: true,
        loadCustom: true,
        loadGo: false,
        clearRickMorty: false,
        clearCustom: false,
        clearGo: true,
      }
    case 'api':
      return {
        loadRickMorty: true,
        loadCustom: false,
        loadGo: false,
        clearRickMorty: false,
        clearCustom: true,
        clearGo: true,
      }
    case 'local':
      return {
        loadRickMorty: false,
        loadCustom: true,
        loadGo: false,
        clearRickMorty: true,
        clearCustom: false,
        clearGo: true,
      }
    case 'go':
      return {
        loadRickMorty: false,
        loadCustom: false,
        loadGo: true,
        clearRickMorty: true,
        clearCustom: true,
        clearGo: false,
      }
  }
}