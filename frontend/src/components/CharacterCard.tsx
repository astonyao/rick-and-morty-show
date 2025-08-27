import React, { memo } from 'react'
import type { Character } from '../types/character'
import { useCharacterContext } from '../context/AppContext'
import { getStatusColor, getGenderDisplay, isCustomCharacter } from '../utils/helpers'

interface CharacterCardProps {
  character: Character
}

const CharacterCard = memo(function CharacterCard({ character }: CharacterCardProps) {
  const { setSelectedCharacter } = useCharacterContext()

  const handleClick = () => {
    setSelectedCharacter(character)
  }

  return (
    <div
      className="character-card cursor-pointer"
      onClick={handleClick}
    >
      {/* Character Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Character Info */}
      <div className="p-4 space-y-2">
        {/* Name and Custom Badge */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {character.name}
          </h3>
          {isCustomCharacter(character) && (
            <span className="bg-portal-blue text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
              Custom
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(character.status)}`}>
            {character.status}
          </span>
          <span className="text-gray-600 text-sm">
            {getGenderDisplay(character.gender)}
          </span>
        </div>

        {/* Species */}
        <p className="text-gray-600 text-sm">
          {character.species}
          {character.type && ` (${character.type})`}
        </p>

        {/* Location */}
        <div className="text-xs text-gray-500">
          <p className="truncate">
            📍 {character.location.name}
          </p>
        </div>
      </div>
    </div>
  )
})

export { CharacterCard }