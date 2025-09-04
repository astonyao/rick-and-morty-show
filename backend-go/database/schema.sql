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

-- Insert some sample custom characters for development (GO BACKEND DATA)
INSERT OR IGNORE INTO characters (
    id, name, status, species, type, gender, 
    origin_name, origin_url, location_name, location_url, 
    image, episode_urls, url
) VALUES 
(568, 'Slut Dragon', 'Alive', 'Mythological Creature', 'Dragon', 'Male',
 'Draygon', 'https://rickandmortyapi.com/api/location/94', 
 'Draygon', 'https://rickandmortyapi.com/api/location/94',
 'https://rickandmortyapi.com/api/character/avatar/568.jpeg',
 '["https://rickandmortyapi.com/api/episode/35"]',
 'https://rickandmortyapi.com/api/character/568'),

(566, 'Debrah''s Partner', 'Alive', 'Mythological Creature', 'Dragon', 'Male',
 'Draygon', 'https://rickandmortyapi.com/api/location/94',
 'Draygon', 'https://rickandmortyapi.com/api/location/94', 
 'https://rickandmortyapi.com/api/character/avatar/566.jpeg',
 '["https://rickandmortyapi.com/api/episode/35"]',
 'https://rickandmortyapi.com/api/character/566'),

(572, 'Robot Snake', 'unknown', 'Robot', 'Snake', 'Genderless',
 'Snake Planet', 'https://rickandmortyapi.com/api/location/78',
 'Snake Planet', 'https://rickandmortyapi.com/api/location/78',
 'https://rickandmortyapi.com/api/character/avatar/572.jpeg', 
 '["https://rickandmortyapi.com/api/episode/36"]',
 'https://rickandmortyapi.com/api/character/572'),

(575, 'Snake Resistance Robot', 'Dead', 'Robot', 'Human-Snake hybrid', 'Genderless',
 'Snake Planet', 'https://rickandmortyapi.com/api/location/78',
 'Earth (Replacement Dimension)', 'https://rickandmortyapi.com/api/location/20',
 'https://rickandmortyapi.com/api/character/avatar/575.jpeg', 
 '["https://rickandmortyapi.com/api/episode/36"]',
 'https://rickandmortyapi.com/api/character/575');