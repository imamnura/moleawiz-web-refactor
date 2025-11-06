/**
 * CourseDescription Tests
 * Unit tests for Course Description component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import CourseDescription from '../CourseDescription'

describe('CourseDescription', () => {
  it('should render description text', () => {
    const description = 'This is a course description'
    renderWithProviders(
      <CourseDescription description={description} isMobile={false} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render empty description', () => {
    const { container } = renderWithProviders(
      <CourseDescription description="" isMobile={false} />
    )
    
    expect(container).toBeTruthy()
  })

  it('should render in mobile view', () => {
    const description = 'Mobile course description'
    renderWithProviders(
      <CourseDescription description={description} isMobile={true} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render HTML content safely', () => {
    const description = '<p>Safe HTML content</p>'
    renderWithProviders(
      <CourseDescription description={description} isMobile={false} />
    )
    
    expect(screen.getByText(/Safe HTML content/i)).toBeInTheDocument()
  })
})
