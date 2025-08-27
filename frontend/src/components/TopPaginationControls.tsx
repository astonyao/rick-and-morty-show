import React, { useState } from 'react'
import { useCharacterContext } from '../context/AppContext'

export function TopPaginationControls() {
  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = useCharacterContext()

  // Initialize pageInput with a function to ensure it gets the current value
  const [pageInput, setPageInput] = useState(() => currentPage.toString())

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

  return (
    <div className="flex items-center space-x-4">
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
  )
}
