# Rick & Morty Character Explorer - AI Assistant Instructions

## Project Overview

This is a full-stack Rick & Morty character explorer built with TypeScript. The application allows users to browse characters from the Rick & Morty API and create/manage custom characters.

## Key Architecture Patterns

### Backend (Express + SQLite + TypeScript)

- **Layered Architecture**: Controllers → Services → Models → Database
- **Entry Point**: `backend/src/index.ts` initializes database and Express app
- **Database**: SQLite with Better-sqlite3, schema in `database/schema.sql`
- **Validation**: Joi schemas for request validation
- **Error Handling**: Centralized middleware for error handling

### Frontend (React + TypeScript)

- **State Management**: React Context with useReducer in `context/AppContext.tsx`
- **Data Sources**: Rick & Morty API (read-only) + Custom characters (CRUD)
- **Component Pattern**: Functional components with TypeScript interfaces
- **API Integration**: Service abstraction with separate modules for different APIs

## Development Workflow

### Quick Start

```bash
# Docker (recommended)
docker-compose up -d

# Manual development
cd backend && npm run dev  # Port 3001
cd frontend && npm run dev # Port 5173
```

### Database Management

Use the scripts in `backend/scripts/`:

- `print-all-characters.sh` - View all characters
- `search-character.sh` - Search for characters
- `database-stats.sh` - Get database statistics
- `reset-database.sh` - Safe database reset

### Testing

```bash
cd backend && npm test   # Backend tests
cd frontend && npm test  # Frontend tests
```

## Key Concepts

### Data Source Switching

Users can toggle between:

- **API Only**: Rick & Morty API characters (read-only)
- **Local Only**: Custom characters (full CRUD)
- **Combined**: Both data sources merged

### Character Data Structure

Characters have: id, name, status, species, type, gender, origin, location, image, episodes, url, created timestamp.

### API Endpoints

- `GET /api/characters` - Paginated character list
- `POST /api/characters` - Create custom character
- `GET /api/characters/:id` - Get specific character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

## Code Style Guidelines

### TypeScript

- Use TypeScript throughout the stack
- Define interfaces for all data structures
- Use proper typing for API responses and requests

### React Components

- Functional components with hooks
- Props interface at the top
- Named exports
- Error boundaries for error handling

### Backend Code

- Separation of concerns (controllers, services, models)
- Use Joi for validation
- Centralized error handling
- Proper HTTP status codes

### Testing

- Test each layer independently
- Mock external dependencies
- Test both success and error scenarios
- Use descriptive test names

## When Helping With This Project

1. **Understand the dual data source system** - API vs custom characters
2. **Follow the layered architecture** - Don't mix concerns between layers
3. **Use TypeScript properly** - Leverage type safety throughout
4. **Consider the user experience** - Data source switching is a key feature
5. **Test thoroughly** - Both frontend and backend need comprehensive testing
6. **Use the development scripts** - They're there for a reason
7. **Follow the established patterns** - Consistency is important

## Common Patterns

### Adding a New API Endpoint

1. Add route in `routes/characters.ts`
2. Create controller method in `controllers/characterController.ts`
3. Add service method in `services/characterService.ts`
4. Add model method in `models/characterModel.ts`
5. Add validation schema in `schemas/character.ts`
6. Write tests for each layer

### Adding a New React Component

1. Create component in `components/` directory
2. Define TypeScript interface for props
3. Use functional component with hooks
4. Add to context if it needs state management
5. Write tests with React Testing Library

### Database Operations

1. Use Better-sqlite3 for all database operations
2. Transform data between API and database formats
3. Handle transactions for multi-step operations
4. Use prepared statements for security
