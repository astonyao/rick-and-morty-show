import React from 'react'
import { useCharacterContext } from '../context/AppContext.js'

export function DataSourceSelector() {
  const { dataSource, setDataSource } = useCharacterContext()

  const dataSourceOptions = [
    { value: 'all', label: 'All Sources', description: 'Rick & Morty API + Local Database' },
    { value: 'api', label: 'API Only', description: 'Rick & Morty API only' },
    { value: 'local', label: 'Local DB Only', description: 'Custom characters only' },
    { value: 'go', label: 'Go API', description: 'Go backend' }
  ]

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="data-source" className="text-sm font-medium text-gray-700">
        Data Source:
      </label>
      <select
        id="data-source"
        value={dataSource}
        onChange={(e) => setDataSource(e.target.value as 'all' | 'api' | 'local' | 'go')}
        className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rick-green focus:border-rick-green sm:text-sm bg-white"
      >
        {dataSourceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-500 max-w-xs">
        {dataSourceOptions.find(opt => opt.value === dataSource)?.description}
      </div>
    </div>
  )
}
