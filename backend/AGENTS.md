# Backend Development Guide

## Express + SQLite + TypeScript Backend

### Architecture Layers

- **Controllers** (`controllers/`) - HTTP request handlers
- **Services** (`services/`) - Business logic
- **Models** (`models/`) - Database operations
- **Validation** (`schemas/`) - Joi validation schemas
- **Routes** - API route definitions
- **Middleware** (`middleware/`) - Error handling, validation

### Request Flow

```
Request → Express App → Routes → Validation → Controller → Service → Model → Database
```

### API Endpoints (Implemented)

- `GET /api/characters` - Paginated character list
- `POST /api/characters` - Create custom character

### Database Operations

- Use Better-sqlite3 for database operations
- Transform database rows to API format in models
- Database file: `data/characters.db`

### File Structure

- `src/index.ts` - Entry point, initializes database and Express
- `config.json` - Environment-specific configuration
- `src/database/` - Schema and connection management
- `src/controllers/` - HTTP request handlers
- `src/services/` - Business logic
- `src/models/` - Database operations
- `src/routes/` - API route definitions
- `src/middleware/` - Express middleware
- `src/schemas/` - Joi validation schemas
- `src/types/` - TypeScript interfaces

### Development Commands

```bash
npm run dev  # Start development server (port 3001)
npm test     # Run tests
npm run lint # Lint code
npm run build # Build for production
```

### Database Management Scripts

Use scripts in `scripts/` directory:

- `print-all-characters.sh` - View all characters
- `search-character.sh` - Search for characters
- `database-stats.sh` - Get database statistics
- `reset-database.sh` - Safe database reset

### Testing

- Use Vitest + Supertest for API testing
- Test each layer: controllers, services, models
- Mock external dependencies
