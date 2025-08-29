# Frontend Development Guide

## React + TypeScript Frontend

### State Management

- React Context with useReducer in `context/AppContext.tsx`
- Actions: SET_RICK_MORTY_CHARACTERS, SET_CUSTOM_CHARACTERS, ADD_CUSTOM_CHARACTER
- State: rickMortyCharacters, customCharacters, loading, error, currentPage, dataSource

### Data Source Switching

Users can toggle between:

- **API Only**: Rick & Morty API characters (read-only)
- **Local Only**: Custom characters (CRUD)
- **Combined**: Both data sources merged

### Component Patterns

- Functional components with TypeScript
- Props interface at the top of each component
- Component as named export
- Use React hooks for state and side effects

### File Structure

- `src/components/` - Reusable React components
- `src/context/AppContext.tsx` - State management
- `src/services/` - API abstraction (api.ts, customCharacterApi.ts, rickMortyApi.ts)
- `src/utils/dataSourceHelpers.ts` - Data source switching logic
- `src/types/character.ts` - TypeScript interfaces

### Development Commands

```bash
npm run dev  # Start development server (port 5173)
npm test     # Run tests
npm run lint # Lint code
npm run build # Build for production
```

### Testing

- Use Vitest + React Testing Library
- Test component rendering and user interactions
- Mock API calls and context providers
