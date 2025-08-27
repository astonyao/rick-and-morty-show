import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        setStoredValue(prevValue => {
          const valueToStore = value instanceof Function ? value(prevValue) : value

          // Save to local storage
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          } catch (storageError) {
            console.warn(`Error setting localStorage key "${key}":`, storageError)
          }

          return valueToStore
        })
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

// Hook for managing favorites or other character-related localStorage data
export function useCharacterPreferences() {
  const [favorites, setFavorites] = useLocalStorage<number[]>('rm_favorites', [])
  const [viewPreferences, setViewPreferences] = useLocalStorage('rm_view_prefs', {
    cardsPerPage: 20,
    showCustomCharacters: true,
    sortBy: 'name' as 'name' | 'id' | 'created',
  })

  const toggleFavorite = useCallback(
    (characterId: number) => {
      setFavorites(prev =>
        prev.includes(characterId)
          ? prev.filter(id => id !== characterId)
          : [...prev, characterId]
      )
    },
    [setFavorites]
  )

  const isFavorite = useCallback(
    (characterId: number) => favorites.includes(characterId),
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [setFavorites])

  return {
    favorites,
    viewPreferences,
    setViewPreferences,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }
}