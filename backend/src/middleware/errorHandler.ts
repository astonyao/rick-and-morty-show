import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  })

  let statusCode = 500
  let code = 'INTERNAL_SERVER_ERROR'
  let message = 'An internal server error occurred'
  let details: unknown

  // Handle different types of errors
  if (error.name === 'ApiError') {
    statusCode = (error as any).statusCode || 500
    code = (error as any).code || 'INTERNAL_SERVER_ERROR'
    message = error.message
    details = (error as any).details
  } else if (error.name === 'ValidationError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = error.message
  } else if (error.name === 'SyntaxError') {
    statusCode = 400
    code = 'INVALID_JSON'
    message = 'Invalid JSON format'
  } else if (error.message?.includes('SQLITE')) {
    statusCode = 500
    code = 'DATABASE_ERROR'
    message = 'Database operation failed'

    // Don't expose detailed database errors in production
    if (process.env.NODE_ENV === 'production') {
      details = undefined
    } else {
      details = { originalMessage: error.message }
    }
  }

  // Return error response directly without ApiResponse wrapper
  const errorResponse: any = {
    message,
    code,
    ...(details && { details })
  }

  // Don't expose stack traces in production
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.details = {
      ...errorResponse.details,
      stack: error.stack
    }
  }

  res.status(statusCode).json(errorResponse)
}