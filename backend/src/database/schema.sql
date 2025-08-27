-- Rick and Morty Custom Characters Database Schema
-- Compatible with Rick and Morty API structure

CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT CHECK(status IN ('Alive', 'Dead', 'unknown')) NOT NULL,
    species TEXT NOT NULL,
    type TEXT DEFAULT '',
    gender TEXT CHECK(gender IN ('Female', 'Male', 'Genderless', 'unknown')) NOT NULL,
    origin_name TEXT NOT NULL,
    origin_url TEXT DEFAULT '',
    location_name TEXT NOT NULL,
    location_url TEXT DEFAULT '',
    image TEXT NOT NULL,
    episode_urls TEXT DEFAULT '[]', -- JSON array of episode URLs
    url TEXT DEFAULT '',
    created DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_status ON characters(status);
CREATE INDEX IF NOT EXISTS idx_characters_species ON characters(species);
CREATE INDEX IF NOT EXISTS idx_characters_gender ON characters(gender);
CREATE INDEX IF NOT EXISTS idx_characters_created ON characters(created);

-- Insert some sample custom characters for development
INSERT OR IGNORE INTO characters (
    id, name, status, species, type, gender, 
    origin_name, origin_url, location_name, location_url, 
    image, episode_urls, url
) VALUES 
(827, 'Portal Rick', 'Alive', 'Human', 'Interdimensional Traveler', 'Male',
 'Dimension C-137', 'http://localhost:3001/api/locations/1', 
 'The Citadel', 'http://localhost:3001/api/locations/2',
 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
 '["http://localhost:3001/api/episodes/1"]',
 'http://localhost:3001/api/characters/827'),

(828, 'Quantum Morty', 'Alive', 'Human', 'Quantum Enhanced', 'Male',
 'Earth C-137', 'http://localhost:3001/api/locations/3',
 'Rick''s Lab', 'http://localhost:3001/api/locations/4', 
 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
 '["http://localhost:3001/api/episodes/1", "http://localhost:3001/api/episodes/2"]',
 'http://localhost:3001/api/characters/828'),

(829, 'Shadow Beth', 'unknown', 'Human', 'Clone', 'Female',
 'Dimension J19-Zeta-7', 'http://localhost:3001/api/locations/5',
 'Earth Replacement Dimension', 'http://localhost:3001/api/locations/6',
 'https://rickandmortyapi.com/api/character/avatar/4.jpeg', 
 '["http://localhost:3001/api/episodes/3"]',
 'http://localhost:3001/api/characters/829');