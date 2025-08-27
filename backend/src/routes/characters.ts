import { Router } from 'express'
import { CharacterController } from '../controllers/characterController.js'
import { validate } from '../middleware/validation.js'
import { 
  createCharacterSchema, 
  characterQuerySchema 
} from '../schemas/character.js'

export function createCharacterRoutes() {
  const router = Router()
  const characterController = new CharacterController()

  // GET /api/characters - Get all characters with basic pagination
  router.get(
    '/',
    validate({ query: characterQuerySchema }),
    characterController.getAllCharacters
  )

  // POST /api/characters - Create new character
  router.post(
    '/',
    validate({ body: createCharacterSchema }),
    characterController.createCharacter
  )

  return router
}