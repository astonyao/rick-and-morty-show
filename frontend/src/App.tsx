import { useState } from 'react'
import { CharacterProvider } from './context/AppContext'
import { CharacterList } from './components/CharacterList'
import { CharacterDetail } from './components/CharacterDetail'
import { CreateCharacterForm } from './components/CreateCharacterForm'
import { DataSourceSelector } from './components/DataSourceSelector'
import { TopPaginationControls } from './components/TopPaginationControls.js'

function App() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <CharacterProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Rick & Morty Characters
                </h1>
                <span className="bg-rick-green text-white px-3 py-1 rounded-full text-sm">
                  Portal Explorer
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <DataSourceSelector />
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Create Custom Character
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                All Characters
              </h2>
            </div>

            <TopPaginationControls />
          </div>

          {/* Character List */}
          <CharacterList />
        </main>

        {/* Modals */}
        <CharacterDetail />
        <CreateCharacterForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
        />
      </div>
    </CharacterProvider>
  )
}

export default App
