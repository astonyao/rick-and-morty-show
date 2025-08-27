import { Request, Response, NextFunction } from 'express'
import { CharacterService } from '../services/characterService.js'
import type { CreateCharacterRequest } from '../types/api.js'

export class CharacterController {
  private characterService = new CharacterService()

  // GET /api/characters - Get all characters with basic pagination
  getAllCharacters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 20
      } = req.query as {
        page?: number
        limit?: number
      }

      const result = await this.characterService.getAllCharacters({
        page: Number(page),
        limit: Number(limit)
      })

      res.status(200).json({
        results: result.characters,
        info: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  // POST /api/characters - Create new character
  createCharacter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const characterData: CreateCharacterRequest = req.body
      const character = await this.characterService.createCharacter(characterData)

      res.status(201).json(character)
    } catch (error) {
      next(error)
    }
  }
}