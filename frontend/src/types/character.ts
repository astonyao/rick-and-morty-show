// Character types based on Rick and Morty API structure
export interface Character {
  id: number
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type: string
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
  url: string
  created: string
}

// Request types for creating custom characters
export interface CreateCharacterRequest {
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type?: string
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
  origin: {
    name: string
    url?: string
  }
  location: {
    name: string
    url?: string
  }
  image: string
  episode?: string[]
}

// API response types
export interface CharacterListResponse {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: Character[]
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

// State management types
export interface CharacterState {
  rickMortyCharacters: Character[]
  customCharacters: Character[]
  selectedCharacter: Character | null
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
}

export interface CharacterContextType extends CharacterState {
  setSelectedCharacter: (character: Character | null) => void
  addCustomCharacter: (character: Character) => void
  loadRickMortyCharacters: (page: number) => Promise<void>
  loadCustomCharacters: () => Promise<void>
  createCustomCharacter: (character: CreateCharacterRequest) => Promise<void>
  clearError: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToPage: (page: number) => void
}