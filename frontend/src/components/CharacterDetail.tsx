import React from 'react'
import type { Character } from '../types/character'
import { useCharacterContext } from '../context/AppContext'
import { getStatusColor, getGenderDisplay, formatDate, isCustomCharacter } from '../utils/helpers'

export function CharacterDetail() {
  const { selectedCharacter, setSelectedCharacter } = useCharacterContext()

  if (!selectedCharacter) return null

  const character = selectedCharacter

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {character.name}
            </h2>
            {isCustomCharacter(character) && (
              <span className="bg-portal-blue text-white px-3 py-1 rounded-full text-sm">
                Custom Character
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedCharacter(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image and Basic Info */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="md:w-1/3">
              <img
                src={character.image}
                alt={character.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            
            <div className="md:w-2/3 space-y-4">
              {/* Status and Gender */}
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(character.status)}`}>
                  {character.status}
                </span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="text-lg">{getGenderDisplay(character.gender)}</span>
                  <span>{character.gender}</span>
                </div>
              </div>

              {/* Species and Type */}
              <div>
                <h4 className="font-semibold text-gray-900">Species</h4>
                <p className="text-gray-600">
                  {character.species}
                  {character.type && ` (${character.type})`}
                </p>
              </div>

              {/* Origin */}
              <div>
                <h4 className="font-semibold text-gray-900">Origin</h4>
                <p className="text-gray-600">{character.origin.name}</p>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-semibold text-gray-900">Last Known Location</h4>
                <p className="text-gray-600">{character.location.name}</p>
              </div>

              {/* Episodes */}
              {character.episode && character.episode.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900">Episodes</h4>
                  <p className="text-gray-600">
                    Appeared in {character.episode.length} episode{character.episode.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Created Date */}
              <div>
                <h4 className="font-semibold text-gray-900">Created</h4>
                <p className="text-gray-600">{formatDate(character.created)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={() => setSelectedCharacter(null)}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}