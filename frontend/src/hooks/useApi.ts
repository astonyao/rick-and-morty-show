import { useState, useCallback, useRef } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
  clearError: () => void
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const requestIdRef = useRef(0)

  const execute = useCallback(
    async (...args: unknown[]) => {
      const currentRequestId = ++requestIdRef.current

      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const result = await apiFunction(...args)

        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          })
        }
        return result
      } catch (error) {
        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred'
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          })
        }
        return null
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    clearError,
  }
}

// Hook for handling multiple concurrent API calls
export function useMultipleApi() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const executeMultiple = useCallback(
    async <T>(requests: Record<string, () => Promise<T>>): Promise<Record<string, T | null>> => {
      setLoading(true)
      setErrors({})

      const results: Record<string, T | null> = {}
      const newErrors: Record<string, string> = {}

      await Promise.allSettled(
        Object.entries(requests).map(async ([key, request]) => {
          try {
            results[key] = await request()
          } catch (error) {
            results[key] = null
            newErrors[key] = error instanceof Error ? error.message : 'An error occurred'
          }
        })
      )

      setErrors(newErrors)
      setLoading(false)

      return results
    },
    []
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    loading,
    errors,
    executeMultiple,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  }
}