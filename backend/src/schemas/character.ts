import Joi from 'joi'

// Validation schemas using Joi
export const createCharacterSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name must be less than 100 characters long',
      'any.required': 'Name is required'
    }),

  status: Joi.string()
    .valid('Alive', 'Dead', 'unknown')
    .required()
    .messages({
      'any.only': 'Status must be one of: Alive, Dead, unknown',
      'any.required': 'Status is required'
    }),

  species: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Species is required',
      'string.min': 'Species must be at least 1 character long',
      'string.max': 'Species must be less than 50 characters long',
      'any.required': 'Species is required'
    }),

  type: Joi.string()
    .trim()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Type must be less than 50 characters long'
    }),

  gender: Joi.string()
    .valid('Female', 'Male', 'Genderless', 'unknown')
    .required()
    .messages({
      'any.only': 'Gender must be one of: Female, Male, Genderless, unknown',
      'any.required': 'Gender is required'
    }),

  origin: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Origin name is required',
        'string.min': 'Origin name must be at least 1 character long',
        'string.max': 'Origin name must be less than 100 characters long',
        'any.required': 'Origin name is required'
      }),
    
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Origin URL must be a valid HTTP/HTTPS URL'
      })
  })
  .required()
  .messages({
    'any.required': 'Origin is required'
  }),

  location: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Location name is required',
        'string.min': 'Location name must be at least 1 character long',
        'string.max': 'Location name must be less than 100 characters long',
        'any.required': 'Location name is required'
      }),
    
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Location URL must be a valid HTTP/HTTPS URL'
      })
  })
  .required()
  .messages({
    'any.required': 'Location is required'
  }),

  image: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'Image must be a valid HTTP/HTTPS URL',
      'any.required': 'Image is required'
    }),

  episode: Joi.array()
    .items(
      Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .messages({
          'string.uri': 'Episode URLs must be valid HTTP/HTTPS URLs'
        })
    )
    .optional()
    .messages({
      'array.base': 'Episode must be an array of URLs'
    })
})

// Query parameter schemas for basic pagination
export const characterQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must be at most 100'
    })
})