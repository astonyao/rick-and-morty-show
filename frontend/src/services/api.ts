import type { ApiResponse, ApiError } from '../types/character'
import type { DataSource } from '../context/AppContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const GO_API_BASE_URL = import.meta.env.VITE_GO_API_URL || 'http://localhost:8081'

class ApiService {
  private getBaseUrl(dataSource?: DataSource): string {
    if (dataSource === 'go') {
      return GO_API_BASE_URL
    }
    return API_BASE_URL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    dataSource?: DataSource
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = this.getBaseUrl(dataSource)
      const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data.error?.message || 'An error occurred',
            code: data.error?.code || response.status.toString(),
            details: data.error?.details,
          },
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error occurred',
          code: 'NETWORK_ERROR',
        },
      }
    }
  }

  async get<T>(endpoint: string, dataSource?: DataSource): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, dataSource)
  }

  async post<T>(endpoint: string, data: unknown, dataSource?: DataSource): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, dataSource)
  }

  async put<T>(endpoint: string, data: unknown, dataSource?: DataSource): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, dataSource)
  }

  async delete<T>(endpoint: string, dataSource?: DataSource): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, dataSource)
  }
}

export const apiService = new ApiService()