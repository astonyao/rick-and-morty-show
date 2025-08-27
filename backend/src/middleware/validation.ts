import { Request, Response, NextFunction } from 'express'
import { Schema } from 'joi'
import { ValidationError } from '../types/api.js'

interface ValidationOptions {
  body?: Schema
  params?: Schema
  query?: Schema
}

export function validate(schemas: ValidationOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = []

    // Validate request body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      })
      
      if (error) {
        errors.push(...error.details.map(detail => detail.message))
      } else {
        req.body = value
      }
    }

    // Validate request parameters
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      })
      
      if (error) {
        errors.push(...error.details.map(detail => detail.message))
      } else {
        req.params = value
      }
    }

    // Validate query parameters
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      })
      
      if (error) {
        errors.push(...error.details.map(detail => detail.message))
      } else {
        req.query = value
      }
    }

    // If there are validation errors, throw ValidationError
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', {
        errors,
        received: {
          body: req.body,
          params: req.params,
          query: req.query
        }
      })
    }

    next()
  }
}