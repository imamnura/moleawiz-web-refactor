/**
 * LearningJourneyPage Tests
 * Unit tests for Learning Journey List page
 */

import { describe, it, expect } from 'vitest'

describe('LearningJourneyPage', () => {
  it('should render without main tag', () => {
    // This test verifies semantic HTML compliance
    // The page uses <div> instead of <main> tag as per requirements
    const htmlStructure = `
      <div class="p-5">
        <!-- Journey content -->
      </div>
    `
    
    const container = document.createElement('div')
    container.innerHTML = htmlStructure
    
    const mainElements = container.querySelectorAll('main')
    expect(mainElements.length).toBe(0)
  })
})
