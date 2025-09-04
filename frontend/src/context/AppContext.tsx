import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type {
  Character,
  CreateCharacterRequest
} from '../types/character'
import {
  loadRickMortyCharactersForPage,
  loadAllCustomCharacters,
  loadAllGoCharacters,
  createNewCustomCharacter,
  handleAsyncError,
  shouldLoadRickMortyData,
  shouldLoadCustomData,
  getDataSourceActions
} from '../utils/dataSourceHelpers'

// Action types
type CharacterAction =
  | { type: 'SET_RICK_MORTY_CHARACTERS'; payload: { characters: Character[]; totalPages: number } }
  | { type: 'SET_CUSTOM_CHARACTERS'; payload: Character[] }
  | { type: 'SET_GO_CHARACTERS'; payload: Character[] }
  | { type: 'ADD_CUSTOM_CHARACTER'; payload: Character }
  | { type: 'SET_SELECTED_CHARACTER'; payload: Character | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_DATA_SOURCE'; payload: 'all' | 'api' | 'local' | 'go' }

// Data source types
export type DataSource = 'all' | 'api' | 'local' | 'go'

// State interface
interface CharacterState {
  rickMortyCharacters: Character[]
  customCharacters: Character[]
  goCharacters: Character[]
  selectedCharacter: Character | null
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  dataSource: DataSource
}

// Initial state
const initialState: CharacterState = {
  rickMortyCharacters: [],
  customCharacters: [],
  goCharacters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  dataSource: 'all'
}

// Reducer
function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
  switch (action.type) {
    case 'SET_RICK_MORTY_CHARACTERS':
      return {
        ...state,
        rickMortyCharacters: action.payload.characters,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null
      }

    case 'SET_CUSTOM_CHARACTERS':
      return { ...state, customCharacters: action.payload, loading: false, error: null }

    case 'SET_GO_CHARACTERS':
      return { ...state, goCharacters: action.payload, loading: false, error: null }

    case 'ADD_CUSTOM_CHARACTER':
      return {
        ...state,
        customCharacters: [...state.customCharacters, action.payload],
        loading: false,
        error: null
      }


    case 'SET_SELECTED_CHARACTER':
      return { ...state, selectedCharacter: action.payload }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }

    case 'SET_DATA_SOURCE':
      return { ...state, dataSource: action.payload }

    default:
      return state
  }
}

// Context type
interface CharacterContextType extends CharacterState {
  setSelectedCharacter: (character: Character | null) => void
  addCustomCharacter: (character: Character) => void
  loadRickMortyCharacters: (page: number) => Promise<void>
  loadCustomCharacters: () => Promise<void>
  loadGoCharacters: () => Promise<void>
  createCustomCharacter: (character: CreateCharacterRequest) => Promise<void>
  clearError: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToPage: (page: number) => void
  setDataSource: (source: DataSource) => void
}

// Create context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

// Provider component
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState)

  // Actions
  const setSelectedCharacter = useCallback((character: Character | null) => {
    dispatch({ type: 'SET_SELECTED_CHARACTER', payload: character })
  }, [])

  const addCustomCharacter = useCallback((character: Character) => {
    dispatch({ type: 'ADD_CUSTOM_CHARACTER', payload: character })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  // Async actions
  const loadRickMortyCharacters = useCallback(async (page: number) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })

    try {
      const { characters, totalPages } = await loadRickMortyCharactersForPage(page)
      dispatch({
        type: 'SET_RICK_MORTY_CHARACTERS',
        payload: { characters, totalPages }
      })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: handleAsyncError(error, 'Failed to load characters')
      })
    }
  }, []);

  const loadCustomCharacters = useCallback(async () => {
    try {
      const characters = await loadAllCustomCharacters()
      dispatch({ type: 'SET_CUSTOM_CHARACTERS', payload: characters })
    } catch (error) {
      // Only log and update error state if it's not an abort error
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to load custom characters:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load custom characters' })
      }
    }
  }, []);

  const loadGoCharacters = useCallback(async () => {
    try {
      const characters = await loadAllGoCharacters()
      dispatch({ type: 'SET_GO_CHARACTERS', payload: characters })
    } catch (error) {
      // Only log and update error state if it's not an abort error
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to load Go characters:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load Go characters' })
      }
    }
  }, []);

  const createCustomCharacter = useCallback(async (character: CreateCharacterRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const newCharacter = await createNewCustomCharacter(character)
      dispatch({ type: 'ADD_CUSTOM_CHARACTER', payload: newCharacter })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: handleAsyncError(error, 'Failed to create character')
      })
      throw error // Re-throw to allow form to handle the error
    }
  }, [])


  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (state.currentPage < state.totalPages) {
      loadRickMortyCharacters(state.currentPage + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (state.currentPage > 1) {
      loadRickMortyCharacters(state.currentPage - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      loadRickMortyCharacters(page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.totalPages])

  // Data source selection
  const setDataSource = useCallback((source: DataSource) => {
    dispatch({ type: 'SET_DATA_SOURCE', payload: source })

    // Execute data loading/clearing actions based on source
    const actions = getDataSourceActions(source)
    
    if (actions.loadRickMorty) {
      loadRickMortyCharacters(state.currentPage)
    }
    
    if (actions.loadCustom) {
      loadCustomCharacters()
    }

    if (actions.loadGo) {
      loadGoCharacters()
    }
    
    if (actions.clearRickMorty) {
      dispatch({ type: 'SET_RICK_MORTY_CHARACTERS', payload: { characters: [], totalPages: 1 } })
    }
    
    if (actions.clearCustom) {
      dispatch({ type: 'SET_CUSTOM_CHARACTERS', payload: [] })
    }

    if (actions.clearGo) {
      dispatch({ type: 'SET_GO_CHARACTERS', payload: [] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage])

  const contextValue: CharacterContextType = {
    ...state,
    setSelectedCharacter,
    addCustomCharacter,
    loadRickMortyCharacters,
    loadCustomCharacters,
    loadGoCharacters,
    createCustomCharacter,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setDataSource,
  }

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  )
}

// Custom hook to use the character context
export function useCharacterContext(): CharacterContextType {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error('useCharacterContext must be used within a CharacterProvider')
  }
  return context
}