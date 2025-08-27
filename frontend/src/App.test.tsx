import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the main header', () => {
    render(<App />)

    expect(screen.getByText('Rick & Morty Characters')).toBeInTheDocument()
    expect(screen.getByText('Portal Explorer')).toBeInTheDocument()
    expect(screen.getByText('Create Custom Character')).toBeInTheDocument()
  })

  it('renders page controls', () => {
    render(<App />)

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    // The label and the number are rendered in separate elements
    expect(screen.getByText('Page')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })
})