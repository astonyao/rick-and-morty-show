import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useApi } from './useApi'

describe('useApi', () => {
  it('should initialize with correct default state', () => {
    const mockApiFunction = vi.fn()
    const { result } = renderHook(() => useApi(mockApiFunction))

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading state during api call', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue('test data')
    const { result } = renderHook(() => useApi(mockApiFunction))

    act(() => {
      result.current.execute()
    })

    expect(result.current.loading).toBe(true)
  })

  it('should handle successful api response', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockApiFunction = vi.fn().mockResolvedValue(mockData)
    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle api errors', async () => {
    const errorMessage = 'API Error'
    const mockApiFunction = vi.fn().mockRejectedValue(new Error(errorMessage))
    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('should reset state', () => {
    const mockApiFunction = vi.fn()
    const { result } = renderHook(() => useApi(mockApiFunction))

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})