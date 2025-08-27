import React, { useEffect } from 'react'
import { useCharacterContext } from '../context/AppContext.js'

export function useCharacters() {
  const {
    rickMortyCharacters,
    customCharacters,
    loading,
    error,
    currentPage,
    totalPages,
    dataSource,
    loadRickMortyCharacters,
    loadCustomCharacters,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setDataSource
  } = useCharacterContext()

  // Load Rick and Morty characters when currentPage changes (only if not local-only)
  useEffect(() => {
    if (dataSource !== 'local') {
      loadRickMortyCharacters(currentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dataSource])

  // Load custom characters on mount (only if not api-only)
  useEffect(() => {
    if (dataSource !== 'api') {
      loadCustomCharacters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])

  // Memoize characters to show to prevent unnecessary re-computations
  const charactersToShow = React.useMemo(() => {
    switch (dataSource) {
      case 'all':
        return [...(rickMortyCharacters || []), ...(customCharacters || [])]
      case 'api':
        return rickMortyCharacters || []
      case 'local':
        return customCharacters || []
      default:
        return []
    }
  }, [dataSource, rickMortyCharacters, customCharacters])

  return {
    rickMortyCharacters: rickMortyCharacters || [],
    customCharacters: customCharacters || [],
    allCharacters: charactersToShow,
    charactersToShow,
    loading,
    error,
    currentPage,
    totalPages,
    dataSource,
    refetchRickMorty: () => loadRickMortyCharacters(currentPage),
    refetchCustom: loadCustomCharacters,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setDataSource
  }
}