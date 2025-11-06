/**
 * Help Topics Data Tests
 * Unit tests for help topics utility functions
 */
import { describe, it, expect, vi } from 'vitest'
import {
  HELP_TOPICS,
  getHelpTopicItems,
  getMobileTopicOptions,
  mapLabelToRoute,
  mapRouteToLabel,
} from '../helpTopics.jsx'

// Mock translation function
const createMockT = () => {
  const t = vi.fn((key) => {
    const translations = {
      'feature.feature_help.side_dpd.frequently_asked_questions': 'FAQ',
      'feature.feature_help.side_dpd.profile': 'Profile',
      'feature.feature_help.side_dpd.my_learning_journey':
        'My Learning Journey',
      'feature.feature_help.side_dpd.learning_activity': 'Learning Activity',
      'feature.feature_help.side_dpd.learning_point': 'Learning Point',
      'feature.feature_help.side_dpd.spv_reviewer': 'Supervisor',
      'feature.feature_help.side_dpd.reviewer_b': 'Reviewer',
      'feature.feature_help.side_dpd.account_data_security':
        'Account Data Security',
      'feature.feature_help.side_dpd.others': 'Others',
      'feature.feature_help.side_dpd.terms_of_service': 'Terms of Service',
      'feature.feature_help.side_dpd.privacy_policy': 'Privacy Policy',
    }
    return translations[key] || key
  })
  return t
}

describe('helpTopics - Constants', () => {
  it('should have all topic keys defined', () => {
    expect(HELP_TOPICS.FAQ).toBe('faq')
    expect(HELP_TOPICS.LOGIN).toBe('login')
    expect(HELP_TOPICS.PROFILE).toBe('profile')
    expect(HELP_TOPICS.MY_LEARNING_JOURNEY).toBe('mylearningjourney')
    expect(HELP_TOPICS.LEARNING_ACTIVITY).toBe('learningactivity')
    expect(HELP_TOPICS.LEARNING_POINT).toBe('learningpoint')
    expect(HELP_TOPICS.SUPERVISOR_REVIEWER).toBe('supervisorreviewer')
    expect(HELP_TOPICS.DATA_SECURITY).toBe('datasecurity')
    expect(HELP_TOPICS.OTHERS).toBe('others')
    expect(HELP_TOPICS.TERM_OF_SERVICE).toBe('termofservice')
    expect(HELP_TOPICS.PRIVACY_POLICY).toBe('privacypolicy')
  })

  it('should have 11 topics defined', () => {
    expect(Object.keys(HELP_TOPICS).length).toBe(11)
  })
})

describe('getHelpTopicItems', () => {
  it('should return array of topic items', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'en')

    expect(Array.isArray(items)).toBe(true)
    expect(items.length).toBe(11)
  })

  it('should include all required properties for each item', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'en')

    items.forEach((item) => {
      expect(item).toHaveProperty('key')
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('route')
      expect(item).toHaveProperty('id')
    })
  })

  it('should generate correct routes for each topic', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'en')

    expect(items[0].route).toBe('/help/faq')
    expect(items[1].route).toBe('/help/login')
    expect(items[2].route).toBe('/help/profile')
  })

  it('should handle Login label for English language', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'en')
    const loginItem = items.find((item) => item.key === HELP_TOPICS.LOGIN)

    expect(loginItem.label).toBe('Login')
  })

  it('should handle Login label for Indonesian language with italic', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'id')
    const loginItem = items.find((item) => item.key === HELP_TOPICS.LOGIN)

    expect(loginItem.label).toBeDefined()
    // In Indonesian, Login is wrapped in <i> tag
  })

  it('should include button IDs for tracking', () => {
    const t = createMockT()
    const items = getHelpTopicItems(t, 'en')

    expect(items[0].id).toBe('btn-list-faq-help-center')
    expect(items[1].id).toBe('btn-list-login-help-center')
  })
})

describe('getMobileTopicOptions', () => {
  it('should return array of topic labels', () => {
    const t = createMockT()
    const options = getMobileTopicOptions(t)

    expect(Array.isArray(options)).toBe(true)
    expect(options.length).toBe(11)
  })

  it('should include all topic labels', () => {
    const t = createMockT()
    const options = getMobileTopicOptions(t)

    expect(options).toContain('FAQ')
    expect(options).toContain('Login')
    expect(options).toContain('Profile')
  })

  it('should concatenate supervisor and reviewer labels', () => {
    const t = createMockT()
    const options = getMobileTopicOptions(t)

    expect(options).toContain('Supervisor & Reviewer')
  })
})

describe('mapLabelToRoute', () => {
  it('should map FAQ label to faq route', () => {
    const t = createMockT()
    const route = mapLabelToRoute('FAQ', t)

    expect(route).toBe(HELP_TOPICS.FAQ)
  })

  it('should map Login label to login route', () => {
    const t = createMockT()
    const route = mapLabelToRoute('Login', t)

    expect(route).toBe(HELP_TOPICS.LOGIN)
  })

  it('should map Profile label to profile route', () => {
    const t = createMockT()
    const route = mapLabelToRoute('Profile', t)

    expect(route).toBe(HELP_TOPICS.PROFILE)
  })

  it('should map concatenated supervisor/reviewer label to correct route', () => {
    const t = createMockT()
    const route = mapLabelToRoute('Supervisor & Reviewer', t)

    expect(route).toBe(HELP_TOPICS.SUPERVISOR_REVIEWER)
  })

  it('should return FAQ as default for unknown labels', () => {
    const t = createMockT()
    const route = mapLabelToRoute('Unknown Topic', t)

    expect(route).toBe(HELP_TOPICS.FAQ)
  })
})

describe('mapRouteToLabel', () => {
  it('should map faq route to FAQ label', () => {
    const t = createMockT()
    const label = mapRouteToLabel(HELP_TOPICS.FAQ, t)

    expect(label).toBe('FAQ')
  })

  it('should map login route to Login label', () => {
    const t = createMockT()
    const label = mapRouteToLabel(HELP_TOPICS.LOGIN, t)

    expect(label).toBe('Login')
  })

  it('should map profile route to Profile label', () => {
    const t = createMockT()
    const label = mapRouteToLabel(HELP_TOPICS.PROFILE, t)

    expect(label).toBe('Profile')
  })

  it('should concatenate supervisor and reviewer labels', () => {
    const t = createMockT()
    const label = mapRouteToLabel(HELP_TOPICS.SUPERVISOR_REVIEWER, t)

    expect(label).toBe('Supervisor & Reviewer')
  })

  it('should return FAQ label as default for unknown routes', () => {
    const t = createMockT()
    const label = mapRouteToLabel('unknown-route', t)

    expect(label).toBe('FAQ')
  })

  it('should map all topic routes correctly', () => {
    const t = createMockT()

    expect(mapRouteToLabel(HELP_TOPICS.FAQ, t)).toBe('FAQ')
    expect(mapRouteToLabel(HELP_TOPICS.LOGIN, t)).toBe('Login')
    expect(mapRouteToLabel(HELP_TOPICS.PROFILE, t)).toBe('Profile')
    expect(mapRouteToLabel(HELP_TOPICS.MY_LEARNING_JOURNEY, t)).toBe(
      'My Learning Journey'
    )
    expect(mapRouteToLabel(HELP_TOPICS.LEARNING_ACTIVITY, t)).toBe(
      'Learning Activity'
    )
    expect(mapRouteToLabel(HELP_TOPICS.LEARNING_POINT, t)).toBe(
      'Learning Point'
    )
    expect(mapRouteToLabel(HELP_TOPICS.DATA_SECURITY, t)).toBe(
      'Account Data Security'
    )
    expect(mapRouteToLabel(HELP_TOPICS.OTHERS, t)).toBe('Others')
    expect(mapRouteToLabel(HELP_TOPICS.TERM_OF_SERVICE, t)).toBe(
      'Terms of Service'
    )
    expect(mapRouteToLabel(HELP_TOPICS.PRIVACY_POLICY, t)).toBe(
      'Privacy Policy'
    )
  })
})

describe('Round-trip mapping', () => {
  it('should correctly map from label to route and back to label', () => {
    const t = createMockT()
    const originalLabel = 'Profile'

    const route = mapLabelToRoute(originalLabel, t)
    const finalLabel = mapRouteToLabel(route, t)

    expect(finalLabel).toBe(originalLabel)
  })

  it('should correctly map from route to label and back to route', () => {
    const t = createMockT()
    const originalRoute = HELP_TOPICS.LEARNING_ACTIVITY

    const label = mapRouteToLabel(originalRoute, t)
    const finalRoute = mapLabelToRoute(label, t)

    expect(finalRoute).toBe(originalRoute)
  })
})
