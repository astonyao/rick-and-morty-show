import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { readFileSync } from 'fs'
import { join } from 'path'

import { initializeDatabase } from './database/connection.js'
import { createCharacterRoutes } from './routes/characters.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'

// Load configuration
const configPath = join(process.cwd(), 'config.json')
let config: any

try {
  const configFile = readFileSync(configPath, 'utf-8')
  config = JSON.parse(configFile)
} catch (error) {
  console.error('Failed to load config.json:', error)
  process.exit(1)
}

const env = process.env['NODE_ENV'] || 'development'
const appConfig = config[env]?.backend

if (!appConfig) {
  console.error(`No configuration found for environment: ${env}`)
  process.exit(1)
}

const PORT = process.env['PORT'] || appConfig.port || 3001

function startServer() {
  try {
    // Initialize database
    initializeDatabase(appConfig.database)
    console.log('✅ Database initialized successfully')

    // Create Express app
    const app = express()

    // Security middleware
    app.use(helmet())
    app.use(compression())

    // CORS configuration
    app.use(cors({
      origin: appConfig.cors.origin,
      credentials: appConfig.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Request logging
    app.use(morgan(env === 'production' ? 'combined' : 'dev'))

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env,
        version: '1.0.0'
      })
    })

    // API routes (create after database initialization)
    app.use('/api/characters', createCharacterRoutes())

    // 404 handler
    app.use(notFoundHandler)

    // Global error handler (must be last)
    app.use(errorHandler)

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📊 Environment: ${env}`)
      console.log(`🔧 Health check: http://localhost:${PORT}/health`)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Server shutdown initiated...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n⏹️  Server shutdown initiated...')
  process.exit(0)
})

// Start the server
startServer()