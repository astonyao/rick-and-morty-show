
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CharacterCard } from './CharacterCard';
import { Character } from '../types/character';
import { CharacterProvider } from '../context/AppContext';

describe('CharacterCard', () => {
  const character: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [],
    url: '',
    created: ''
  };

  it('renders character information', () => {
    render(
      <CharacterProvider>
        <CharacterCard character={character} />
      </CharacterProvider>
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('♂')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('📍 Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });
});
