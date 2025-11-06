/**
 * ModuleHeader Tests
 * Unit tests for Module Header component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModuleHeader from '../ModuleHeader'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ModuleHeader', () => {
  const mockModule = {
    id: 1,
    fullname: 'Test Module',
    thumbnail: 'https://example.com/module.jpg',
  }

  it('should render module name', () => {
    renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={1}
        journeyId="1"
        courseId="1"
        learningPoints={50}
        isMobile={false}
      />
    )
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
  })

  it('should display module index', () => {
    renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={3}
        journeyId="1"
        courseId="1"
        learningPoints={50}
        isMobile={false}
      />
    )
    
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('should display learning points', () => {
    renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={1}
        journeyId="1"
        courseId="1"
        learningPoints={100}
        isMobile={false}
      />
    )
    
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('should render module thumbnail', () => {
    const { container } = renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={1}
        journeyId="1"
        courseId="1"
        learningPoints={50}
        isMobile={false}
      />
    )
    
    const image = container.querySelector('img')
    expect(image).toBeTruthy()
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={1}
        journeyId="1"
        courseId="1"
        learningPoints={50}
        isMobile={true}
      />
    )
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
  })

  it('should navigate back to course detail when back button clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <ModuleHeader
        module={mockModule}
        moduleIndex={1}
        journeyId="1"
        courseId="1"
        learningPoints={50}
        isMobile={false}
      />
    )
    
    const backButton = screen.getByRole('button')
    await user.click(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/journey/1/course/1')
  })
})
