/**
 * LoginHelpPage Simple Tests
 */
import { describe, it, expect } from 'vitest'
import LoginHelpPage from '../LoginHelpPage'

describe('LoginHelpPage - Basic', () => {
  it('should export a component', () => {
    expect(LoginHelpPage).toBeDefined()
    expect(typeof LoginHelpPage).toBe('function')
  })
})
