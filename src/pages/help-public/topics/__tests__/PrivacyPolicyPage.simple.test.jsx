/**
 * PrivacyPolicyPage Simple Tests
 */
import { describe, it, expect } from 'vitest'
import PrivacyPolicyPage from '../PrivacyPolicyPage'

describe('PrivacyPolicyPage - Basic', () => {
  it('should export a component', () => {
    expect(PrivacyPolicyPage).toBeDefined()
    expect(typeof PrivacyPolicyPage).toBe('function')
  })
})
