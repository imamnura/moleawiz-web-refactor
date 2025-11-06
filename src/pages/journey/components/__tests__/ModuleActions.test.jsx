/**
 * ModuleActions Tests
 * Unit tests for Module Actions component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModuleActions from '../ModuleActions'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('ModuleActions', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  const mockModule = {
    id: 1,
    cmid: 123,
    isopen: 1,
    attempt_limit: 0,
    total_attempt: 0,
  }

  const mockOnResync = vi.fn()

  it('should render enter button for open module', () => {
    const { container } = renderWithProviders(
      <ModuleActions
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
        onResync={mockOnResync}
      />
    )
    
    expect(container.textContent).toContain('Enter')
  })

  it('should render locked button for locked module', () => {
    const lockedModule = {
      ...mockModule,
      isopen: 0,
    }
    
    const { container } = renderWithProviders(
      <ModuleActions
        module={lockedModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
        onResync={mockOnResync}
      />
    )
    
    expect(container.textContent).toContain('Locked')
  })

  it('should render resync button when SCORM data pending', () => {
    localStorage.setItem('scorm-1', 'pending-data')
    
    const { container } = renderWithProviders(
      <ModuleActions
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
        onResync={mockOnResync}
      />
    )
    
    expect(container.textContent).toContain('Re-sync')
  })

  it('should call onResync when resync button is clicked', async () => {
    const user = userEvent.setup()
    localStorage.setItem('scorm-1', 'pending-data')
    
    renderWithProviders(
      <ModuleActions
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
        onResync={mockOnResync}
      />
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockOnResync).toHaveBeenCalledWith(1)
  })

  it('should render in mobile view', () => {
    const { container } = renderWithProviders(
      <ModuleActions
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={true}
        onResync={mockOnResync}
      />
    )
    
    expect(container.textContent).toContain('Enter')
  })

  it('should navigate to SCORM player on enter click', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <ModuleActions
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
        onResync={mockOnResync}
      />
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockNavigate).toHaveBeenCalledWith('/journey/1/course/1/module/1/play')
  })
})
