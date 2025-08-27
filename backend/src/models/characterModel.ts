import { getDatabase } from '../database/connection.js'
import type { 
  Character, 
  CharacterRow, 
  CreateCharacterRequest,
  DatabaseResult 
} from '../types/api.js'

export class CharacterModel {
  private db = getDatabase()

  // Transform database row to API format
  private transformRow(row: CharacterRow): Character {
    let episodeUrls: string[] = []
    
    try {
      episodeUrls = JSON.parse(row.episode_urls || '[]')
    } catch (error) {
      console.warn('Failed to parse episode URLs:', error)
      episodeUrls = []
    }

    return {
      id: row.id,
      name: row.name,
      status: row.status,
      species: row.species,
      type: row.type,
      gender: row.gender,
      origin: {
        name: row.origin_name,
        url: row.origin_url
      },
      location: {
        name: row.location_name,
        url: row.location_url
      },
      image: row.image,
      episode: episodeUrls,
      url: row.url,
      created: row.created
    }
  }

  // Get all characters with basic pagination
  async findAll(filters: {
    limit?: number
    offset?: number
  } = {}): Promise<DatabaseResult<Character[]>> {
    try {
      const { limit = 20, offset = 0 } = filters

      const query = 'SELECT * FROM characters ORDER BY created DESC, id DESC LIMIT ? OFFSET ?'
      const stmt = this.db.prepare(query)
      const rows = stmt.all(limit, offset) as CharacterRow[]
      
      const characters = rows.map(row => this.transformRow(row))

      return {
        success: true,
        data: characters
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch characters',
          code: 'DATABASE_ERROR',
          details: error
        }
      }
    }
  }

  // Get character count for pagination
  async count(): Promise<DatabaseResult<number>> {
    try {
      const query = 'SELECT COUNT(*) as count FROM characters'
      const stmt = this.db.prepare(query)
      const result = stmt.get() as { count: number }

      return {
        success: true,
        data: result.count
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to count characters',
          code: 'DATABASE_ERROR',
          details: error
        }
      }
    }
  }

  // Create new character
  async create(data: CreateCharacterRequest): Promise<DatabaseResult<Character>> {
    try {
      const episodeUrls = JSON.stringify(data.episode || [])
      
      // Generate URL for the new character (will be updated with actual ID)
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
      
      const stmt = this.db.prepare(`
        INSERT INTO characters (
          name, status, species, type, gender,
          origin_name, origin_url, location_name, location_url,
          image, episode_urls, url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        data.name,
        data.status,
        data.species,
        data.type || '',
        data.gender,
        data.origin.name,
        data.origin.url || '',
        data.location.name,
        data.location.url || '',
        data.image,
        episodeUrls,
        `${baseUrl}/api/characters/0` // Placeholder, will be updated
      )

      const newId = result.lastInsertRowid as number

      // Update the URL with the actual ID
      const updateStmt = this.db.prepare('UPDATE characters SET url = ? WHERE id = ?')
      updateStmt.run(`${baseUrl}/api/characters/${newId}`, newId)

      // Fetch and return the created character
      const selectStmt = this.db.prepare('SELECT * FROM characters WHERE id = ?')
      const row = selectStmt.get(newId) as CharacterRow

      return {
        success: true,
        data: this.transformRow(row)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create character',
          code: 'DATABASE_ERROR',
          details: error
        }
      }
    }
  }
}