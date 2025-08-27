import React, { useState } from 'react'
import { useCharacters } from '../hooks/useCharacters'
import { CharacterCard } from './CharacterCard'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'

export function CharacterList() {
  const {
    charactersToShow,
    customCharacters,
    loading,
    error,
    currentPage,
    totalPages,
    clearError,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useCharacters()

  const [pageInput, setPageInput] = useState(currentPage.toString())

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value)
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNumber = parseInt(pageInput, 10)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      goToPage(pageNumber)
    } else {
      // Reset to current page if invalid input
      setPageInput(currentPage.toString())
    }
  }

  const handlePageInputBlur = () => {
    const pageNumber = parseInt(pageInput, 10)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      goToPage(pageNumber)
    } else {
      // Reset to current page if invalid input
      setPageInput(currentPage.toString())
    }
  }

  // Update pageInput when currentPage changes (e.g., from Previous/Next buttons)
  React.useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={clearError}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {charactersToShow.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Page</span>
          <form onSubmit={handlePageInputSubmit} className="inline">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rick-green focus:border-transparent"
            />
          </form>
          <span className="text-gray-600">of {totalPages}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Results info */}
      <div className="text-center text-gray-600">
        Showing {charactersToShow.length} characters
        {customCharacters.length > 0 && charactersToShow.length > customCharacters.length && (
          <span> (including {customCharacters.length} custom characters)</span>
        )}
      </div>
    </div>
  )
}