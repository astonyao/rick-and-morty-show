import { Request, Response } from 'express'
import { ApiResponse } from '../types/api.js'

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiResponse = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  }

  res.status(404).json(response)
}