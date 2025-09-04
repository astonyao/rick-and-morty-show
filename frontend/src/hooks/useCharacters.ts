import React, { useEffect } from 'react'
import { useCharacterContext } from '../context/AppContext.js'

export function useCharacters() {
  const {
    rickMortyCharacters,
    customCharacters,
    goCharacters,
    loading,
    error,
    currentPage,
    totalPages,
    dataSource,
    loadRickMortyCharacters,
    loadCustomCharacters,
    loadGoCharacters,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setDataSource
  } = useCharacterContext()

  // Load Rick and Morty characters when currentPage changes (only if not local-only)
  useEffect(() => {
    if (dataSource !== 'local' && dataSource !== 'go') {
      loadRickMortyCharacters(currentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dataSource])

  // Load custom characters on mount (only if not api-only)
  useEffect(() => {
    if (dataSource !== 'api' && dataSource !== 'go') {
      loadCustomCharacters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])

  // Load go characters on mount (only if go)
  useEffect(() => {
    if (dataSource === 'go') {
      loadGoCharacters()
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
      case 'go':
        return goCharacters || []
      default:
        return []
    }
  }, [dataSource, rickMortyCharacters, customCharacters, goCharacters])

  return {
    rickMortyCharacters: rickMortyCharacters || [],
    customCharacters: customCharacters || [],
    goCharacters: goCharacters || [],
    allCharacters: charactersToShow,
    charactersToShow,
    loading,
    error,
    currentPage,
    totalPages,
    dataSource,
    refetchRickMorty: () => loadRickMortyCharacters(currentPage),
    refetchCustom: loadCustomCharacters,
    refetchGo: loadGoCharacters,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setDataSource
  }
}