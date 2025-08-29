# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Rick & Morty character explorer with both API and custom character management capabilities. Built with TypeScript throughout for consistency.

## Development Commands

### Quick Start
```bash
# Start entire application with Docker
docker-compose up -d

# Stop application
docker-compose down
```

### Manual Development
```bash
# Backend (port 3001)
cd backend
npm install
npm run dev

# Frontend (port 5173)  
cd frontend
npm install
npm run dev
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

## Architecture

### Backend (Express + SQLite + TypeScript)
- **Entry Point**: `backend/src/index.ts` - initializes database, configures Express with security middleware
- **Configuration**: Environment-specific config loaded from `config.json`
- **Database**: SQLite with Better-sqlite3, schema in `database/schema.sql`, connection management in `database/connection.ts`
- **API Structure**: 
  - Controllers handle HTTP requests (`controllers/`)
  - Services contain business logic (`services/`)
  - Models handle database operations (`models/`)
  - Validation using Joi schemas (`schemas/`)
- **Routes**: Character CRUD operations at `/api/characters`
- **Testing**: Vitest + Supertest for API testing

### Frontend (React + Vite + TypeScript)
- **State Management**: React Context with useReducer in `context/AppContext.tsx`
- **Data Sources**: Supports Rick & Morty API, local custom characters, or both combined
- **API Layer**: Service abstraction in `services/` with separate modules for Rick & Morty API and custom character API
- **Components**: Modular React components in `components/`
- **Utilities**: Data source helpers in `utils/dataSourceHelpers.ts` for switching between API/local/combined views
- **Testing**: Vitest + React Testing Library

### Key Concepts
- **Data Source Switching**: Users can toggle between API-only, local-only, or combined character views
- **Dual Character Systems**: Rick & Morty API characters (read-only) vs custom characters (CRUD operations)
- **Context-Driven State**: All character data, pagination, and UI state managed through React Context
- **Configuration-Based**: Backend behavior controlled via `config.json` for different environments

## Backend Request Flow

### GET /api/characters
```
Incoming Request
       ↓
Express App (index.ts)
├── Security Middleware (helmet, compression)
├── CORS Middleware 
├── Body Parser Middleware
├── Morgan Logging Middleware
       ↓
Character Routes (routes/characters.ts)
       ↓
Validation Middleware (middleware/validation.ts)
├── Validates query parameters using Joi
├── Sanitizes and transforms input
├── Throws ValidationError if invalid
       ↓
Character Controller (controllers/characterController.ts)
├── Extracts page/limit from validated query
├── Calls CharacterService.getAllCharacters()
├── Formats response as {results, info}
├── Passes errors to next() for error handling
       ↓
Character Service (services/characterService.ts)
├── Business logic validation
├── Pagination calculations (page, limit, offset)
├── Calls CharacterModel.count() for total items
├── Calls CharacterModel.findAll() with pagination
├── Builds pagination metadata
       ↓
Character Model (models/characterModel.ts)
├── Executes SQL queries via better-sqlite3
├── Transforms database rows to API format
├── Returns DatabaseResult<Character[]>
       ↓
SQLite Database (data/characters.db)
├── SELECT COUNT(*) FROM characters
├── SELECT * FROM characters ORDER BY created DESC LIMIT ? OFFSET ?
       ↓
Response flows back through layers with error handling at each level
```

### POST /api/characters
```
Incoming Request with JSON body
       ↓
Express App → Routes → Validation Middleware
├── Validates request body using createCharacterSchema
├── Strips unknown fields, validates required fields
       ↓
Character Controller
├── Extracts CreateCharacterRequest from body
├── Calls CharacterService.createCharacter()
       ↓
Character Service
├── Validates business rules (e.g., image URL format)
├── Calls CharacterModel.create()
       ↓
Character Model
├── Transforms API format to database format
├── Serializes episode array to JSON
├── Executes INSERT statement
├── Updates URL with generated ID
├── Returns created character
       ↓
Database Transaction
├── INSERT INTO characters (...)
├── UPDATE characters SET url = ? WHERE id = ?
├── SELECT * FROM characters WHERE id = ?
```

### Error Handling Chain
```
Any Layer Error
       ↓
Error Handler Middleware (middleware/errorHandler.ts)
├── Catches all unhandled errors
├── Logs error details
├── Returns appropriate HTTP status codes
├── Sanitizes error messages for production
       ↓
404 Handler (middleware/notFoundHandler.ts)
├── Handles unmatched routes
├── Returns standardized 404 response
```

## Frontend Data Flow

### Component Tree and State Management
```
App Component (App.tsx)
├── Wraps entire app in CharacterProvider
       ↓
CharacterProvider (context/AppContext.tsx)
├── useReducer for centralized state management
├── Provides actions: loadRickMortyCharacters, loadCustomCharacters, createCustomCharacter
├── Manages: characters, pagination, loading, error states
├── Data source switching logic (API/Local/Both)
       ↓
Component Layer
├── CharacterList (components/CharacterList.tsx)
├── CharacterDetail (components/CharacterDetail.tsx)  
├── CreateCharacterForm (components/CreateCharacterForm.tsx)
├── DataSourceSelector (components/DataSourceSelector.tsx)
```

### Data Loading Flow (Custom Characters)
```
User Action (e.g., component mount, data source change)
       ↓
useCharacterContext() hook
├── Dispatches loading actions
├── Calls loadCustomCharacters()
       ↓
Data Source Helpers (utils/dataSourceHelpers.ts)
├── loadAllCustomCharacters()
├── Determines if custom data should be loaded
├── Manages error handling and retries
       ↓
Custom Character API (services/customCharacterApi.ts)
├── CustomCharacterApi.getCustomCharacters()
├── Calls apiService.get('/api/characters')
       ↓
API Service (services/api.ts)
├── Generic HTTP client wrapper
├── Handles request/response transformation
├── Error handling and network error detection
├── Returns ApiResponse<T> format
       ↓
Fetch API
├── HTTP GET to backend API
├── JSON parsing and response handling
       ↓
Response flows back through layers
├── API Service → Custom Character API → Data Helpers
├── Context dispatches SET_CUSTOM_CHARACTERS action
├── useReducer updates component state
├── Components re-render with new data
```

### Character Creation Flow
```
CreateCharacterForm submission
       ↓
Form validation (client-side)
       ↓
useCharacterContext().createCustomCharacter()
       ↓
Context dispatches SET_LOADING
       ↓
createNewCustomCharacter() (utils/dataSourceHelpers.ts)
       ↓
CustomCharacterApi.createCustomCharacter()
       ↓
apiService.post('/api/characters', data)
       ↓
Backend API (follows POST flow above)
       ↓
Success Response
├── Context dispatches ADD_CUSTOM_CHARACTER
├── Updates local state with new character
├── Form resets and shows success message
       ↓
Error Response
├── Context dispatches SET_ERROR
├── Form displays validation errors
├── Error boundary catches unhandled errors
```

### Rick & Morty API Integration
```
Rick & Morty API Service (services/rickMortyApi.ts)
├── Separate from custom character API
├── Handles external API pagination format
├── Transforms external API data to internal format
├── No persistence - data flows directly to context
       ↓
Context State Management
├── Separate state branches for API vs custom characters
├── Combined view merges both data sources
├── Pagination handled separately for each source
```

## Database Schema
SQLite with single `characters` table for custom characters. Rick & Morty characters come from external API and are not persisted.