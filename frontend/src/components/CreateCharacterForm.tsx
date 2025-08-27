import React, { useState } from 'react'
import type { CreateCharacterRequest } from '../types/character'
import { useCharacterContext } from '../context/AppContext'
import { isValidImageUrl } from '../utils/validation'

interface CreateCharacterFormProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCharacterForm({ isOpen, onClose }: CreateCharacterFormProps) {
  const { createCustomCharacter, loading } = useCharacterContext()

  const [formData, setFormData] = useState<CreateCharacterRequest>({
    name: '',
    status: 'Alive',
    species: '',
    type: '',
    gender: 'unknown',
    origin: { name: '', url: '' },
    location: { name: '', url: '' },
    image: '',
    episode: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.species.trim()) {
      newErrors.species = 'Species is required'
    }

    if (!formData.origin.name.trim()) {
      newErrors.originName = 'Origin name is required'
    }

    if (!formData.location.name.trim()) {
      newErrors.locationName = 'Location name is required'
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else if (!isValidImageUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createCustomCharacter(formData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        status: 'Alive',
        species: '',
        type: '',
        gender: 'unknown',
        origin: { name: '', url: '' },
        location: { name: '', url: '' },
        image: '',
        episode: [],
      })
      setErrors({})
    } catch (error) {
      // Error is handled by context
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof CreateCharacterRequest] as Record<string, string>,
            [child]: value,
          },
        }
      }
      return { ...prev, [field]: value }
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create Custom Character</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="Enter character name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species *
            </label>
            <input
              type="text"
              value={formData.species}
              onChange={(e) => handleChange('species', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="e.g., Human, Alien, Robot"
            />
            {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="Subspecies or variant (optional)"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              value={formData.origin.name}
              onChange={(e) => handleChange('origin.name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="Origin planet/dimension"
            />
            {errors.originName && <p className="text-red-500 text-xs mt-1">{errors.originName}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Location *
            </label>
            <input
              type="text"
              value={formData.location.name}
              onChange={(e) => handleChange('location.name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="Current location"
            />
            {errors.locationName && <p className="text-red-500 text-xs mt-1">{errors.locationName}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rick-green focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}