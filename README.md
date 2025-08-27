# Rick & Morty Character Explorer

A full-stack web application for browsing Rick and Morty characters and creating custom ones. Built for Claudia's character research needs.

![Frontend Preview](frontend-preview.png)

## Features

- **Browse Characters**: Paginated list of all Rick and Morty characters from the official API
- **Character Profiles**: Detailed view when clicking on any character
- **Create Custom Characters**: Add your own characters to the local database
- **Data Source Switching**: Choose between API-only, local database, or both
- **Search & Filter**: Find characters by name, species, status, and more
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

### Option 1: Docker (Recommended)

```bash
# Start the entire application
docker-compose up -d

# Stop the application
docker-compose down
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Option 2: Manual Setup

```bash
# Backend
cd backend
npm install
npm run dev    # Starts on port 3001

# Frontend (in another terminal)
cd frontend
npm install
npm run dev    # Starts on port 5173
```

## Tech Stack Choices

### Frontend: React + Vite + TypeScript

- **React**:
- **TypeScript**
- **Vite**: faster than Create React App
- **Tailwind CSS**: Quick styling without writing custom CSS
- **Vitest**: Fast testing framework that integrates well with Vite

### Backend: Express + SQLite + TypeScript

- **Express.js**: Simple, widely-used, easy to understand
- **SQLite**: Lightweight database that requires no setup, works for our simple use case
- **TypeScript**: Consistent language across frontend and backend
- **Joi**: validation to ensure data integrity
- **Vitest + Supertest**: Comprehensive API testing

### Why These Choices?

- **Simplicity**: Minimal setup required, easy to understand and maintain
- **TypeScript everywhere**: One language, better tooling, fewer runtime errors
- **Lightweight**: SQLite database, no complex infrastructure needed
- **Modern**: Latest React features, fast Vite tooling, current best practices
- **Testable**: Good test coverage with modern testing tools

## API Endpoints

- `GET /api/characters` - List custom characters with pagination
- `POST /api/characters` - Create new custom character

## Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

```

## Data Sources

- **Rick & Morty API**: https://rickandmortyapi.com/api/character (826 characters)
- **Local Database**: SQLite database for custom characters (unlimited)
- **Combined View**: Shows both API and custom characters together

## Project Structure

```
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Global state management
│   │   ├── services/       # API communication
│   │   ├── utils/          # Helper functions
│   │   └── constants/      # App constants
│   └── __tests__/          # Test files
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database operations
│   │   └── middleware/     # Express middleware
│   └── __tests__/          # API tests
└── docker-compose.yml      # Container configuration
```
