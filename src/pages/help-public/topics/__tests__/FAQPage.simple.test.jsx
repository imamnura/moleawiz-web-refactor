/**
 * FAQPage Simple Tests
 */
import { describe, it, expect } from 'vitest'
import FAQPage from '../FAQPage'

describe('FAQPage - Basic', () => {
  it('should export a component', () => {
    expect(FAQPage).toBeDefined()
    expect(typeof FAQPage).toBe('function')
  })
})
