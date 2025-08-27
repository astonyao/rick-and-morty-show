import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db: Database.Database | null = null

export interface DatabaseConfig {
  path: string
  type: string
}

export function initializeDatabase(config: DatabaseConfig): Database.Database {
  try {
    let dbPath: string

    // Handle in-memory database
    if (config.path === ':memory:') {
      dbPath = ':memory:'
    } else {
      // Ensure the data directory exists for file-based databases
      dbPath = join(process.cwd(), config.path)
      const dbDir = dirname(dbPath)

      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true })
      }
    }

    // Create database connection with better-sqlite3
    db = new Database(dbPath)

    // Enable foreign keys and other pragmas
    db.pragma('foreign_keys = ON')
    db.pragma('journal_mode = WAL')

    // Read and execute schema
    const schemaPath = join(__dirname, 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')

    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    for (const statement of statements) {
      try {
        db.exec(statement)
      } catch (error) {
        console.warn('Schema statement failed (may be expected):', error)
      }
    }

    console.log(`Database initialized at: ${dbPath}`)
    return db

  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('Database connection closed')
  }
}

// Graceful shutdown
process.on('exit', () => {
  closeDatabase()
})

process.on('SIGINT', () => {
  closeDatabase()
  process.exit(0)
})

process.on('SIGTERM', () => {
  closeDatabase()
  process.exit(0)
})