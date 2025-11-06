/**
 * Help Topics Configuration
 * Centralizes all help topics, routes, and labels
 */

export const HELP_TOPICS = {
  FAQ: 'faq',
  LOGIN: 'login',
  PROFILE: 'profile',
  MY_LEARNING_JOURNEY: 'mylearningjourney',
  LEARNING_ACTIVITY: 'learningactivity',
  LEARNING_POINT: 'learningpoint',
  SUPERVISOR_REVIEWER: 'supervisorreviewer',
  DATA_SECURITY: 'datasecurity',
  OTHERS: 'others',
  TERM_OF_SERVICE: 'termofservice',
  PRIVACY_POLICY: 'privacypolicy',
}

/**
 * Get topic navigation items
 * @param {Function} t - Translation function
 * @param {string} i18nLanguage - Current language
 * @returns {Array} Topic items with label and route
 */
export const getHelpTopicItems = (t, i18nLanguage) => [
  {
    key: HELP_TOPICS.FAQ,
    label: t('feature.feature_help.side_dpd.frequently_asked_questions'),
    route: `/help/${HELP_TOPICS.FAQ}`,
    id: 'btn-list-faq-help-center',
  },
  {
    key: HELP_TOPICS.LOGIN,
    label: i18nLanguage === 'en' ? 'Login' : <i>Login</i>,
    route: `/help/${HELP_TOPICS.LOGIN}`,
    id: 'btn-list-login-help-center',
  },
  {
    key: HELP_TOPICS.PROFILE,
    label: t('feature.feature_help.side_dpd.profile'),
    route: `/help/${HELP_TOPICS.PROFILE}`,
    id: 'btn-list-profile-help-center',
  },
  {
    key: HELP_TOPICS.MY_LEARNING_JOURNEY,
    label: t('feature.feature_help.side_dpd.my_learning_journey'),
    route: `/help/${HELP_TOPICS.MY_LEARNING_JOURNEY}`,
    id: 'btn-list-my-learning-journey-help-center',
  },
  {
    key: HELP_TOPICS.LEARNING_ACTIVITY,
    label: t('feature.feature_help.side_dpd.learning_activity'),
    route: `/help/${HELP_TOPICS.LEARNING_ACTIVITY}`,
    id: 'btn-list-learning-activity-help-center',
  },
  {
    key: HELP_TOPICS.LEARNING_POINT,
    label: t('feature.feature_help.side_dpd.learning_point'),
    route: `/help/${HELP_TOPICS.LEARNING_POINT}`,
    id: 'btn-list-learning-point-help-center',
  },
  {
    key: HELP_TOPICS.SUPERVISOR_REVIEWER,
    label: `${t('feature.feature_help.side_dpd.spv_reviewer')} & ${t('feature.feature_help.side_dpd.reviewer_b')}`,
    route: `/help/${HELP_TOPICS.SUPERVISOR_REVIEWER}`,
    id: 'btn-list-monitoring-review-help-center',
  },
  {
    key: HELP_TOPICS.DATA_SECURITY,
    label: t('feature.feature_help.side_dpd.account_data_security'),
    route: `/help/${HELP_TOPICS.DATA_SECURITY}`,
    id: 'btn-list-account-data-security-help-center',
  },
  {
    key: HELP_TOPICS.OTHERS,
    label: t('feature.feature_help.side_dpd.others'),
    route: `/help/${HELP_TOPICS.OTHERS}`,
    id: 'btn-list-others-help-center',
  },
  {
    key: HELP_TOPICS.TERM_OF_SERVICE,
    label: t('feature.feature_help.side_dpd.terms_of_service'),
    route: `/help/${HELP_TOPICS.TERM_OF_SERVICE}`,
    id: 'btn-list-term-of-service-help-center',
  },
  {
    key: HELP_TOPICS.PRIVACY_POLICY,
    label: t('feature.feature_help.side_dpd.privacy_policy'),
    route: `/help/${HELP_TOPICS.PRIVACY_POLICY}`,
    id: 'btn-list-privacy-policy-help-center',
  },
]

/**
 * Get mobile topic options
 * @param {Function} t - Translation function
 * @returns {Array} Topic options for mobile modal
 */
export const getMobileTopicOptions = (t) => [
  t('feature.feature_help.side_dpd.frequently_asked_questions'),
  'Login',
  t('feature.feature_help.side_dpd.profile'),
  t('feature.feature_help.side_dpd.my_learning_journey'),
  t('feature.feature_help.side_dpd.learning_activity'),
  t('feature.feature_help.side_dpd.learning_point'),
  `${t('feature.feature_help.side_dpd.spv_reviewer')} & ${t('feature.feature_help.side_dpd.reviewer_b')}`,
  t('feature.feature_help.side_dpd.account_data_security'),
  t('feature.feature_help.side_dpd.others'),
  t('feature.feature_help.side_dpd.terms_of_service'),
  t('feature.feature_help.side_dpd.privacy_policy'),
]

/**
 * Map topic label to route
 * @param {string} label - Topic label
 * @param {Function} t - Translation function
 * @returns {string} Topic route key
 */
export const mapLabelToRoute = (label, t) => {
  const mapping = {
    [t('feature.feature_help.side_dpd.frequently_asked_questions')]:
      HELP_TOPICS.FAQ,
    Login: HELP_TOPICS.LOGIN,
    [t('feature.feature_help.side_dpd.profile')]: HELP_TOPICS.PROFILE,
    [t('feature.feature_help.side_dpd.my_learning_journey')]:
      HELP_TOPICS.MY_LEARNING_JOURNEY,
    [t('feature.feature_help.side_dpd.learning_activity')]:
      HELP_TOPICS.LEARNING_ACTIVITY,
    [t('feature.feature_help.side_dpd.learning_point')]:
      HELP_TOPICS.LEARNING_POINT,
    [`${t('feature.feature_help.side_dpd.spv_reviewer')} & ${t('feature.feature_help.side_dpd.reviewer_b')}`]:
      HELP_TOPICS.SUPERVISOR_REVIEWER,
    [t('feature.feature_help.side_dpd.account_data_security')]:
      HELP_TOPICS.DATA_SECURITY,
    [t('feature.feature_help.side_dpd.others')]: HELP_TOPICS.OTHERS,
    [t('feature.feature_help.side_dpd.terms_of_service')]:
      HELP_TOPICS.TERM_OF_SERVICE,
    [t('feature.feature_help.side_dpd.privacy_policy')]:
      HELP_TOPICS.PRIVACY_POLICY,
  }

  return mapping[label] || HELP_TOPICS.FAQ
}

/**
 * Map route to topic label
 * @param {string} route - Topic route key
 * @param {Function} t - Translation function
 * @returns {string} Topic label
 */
export const mapRouteToLabel = (route, t) => {
  const mapping = {
    [HELP_TOPICS.FAQ]: t(
      'feature.feature_help.side_dpd.frequently_asked_questions'
    ),
    [HELP_TOPICS.LOGIN]: 'Login',
    [HELP_TOPICS.PROFILE]: t('feature.feature_help.side_dpd.profile'),
    [HELP_TOPICS.MY_LEARNING_JOURNEY]: t(
      'feature.feature_help.side_dpd.my_learning_journey'
    ),
    [HELP_TOPICS.LEARNING_ACTIVITY]: t(
      'feature.feature_help.side_dpd.learning_activity'
    ),
    [HELP_TOPICS.LEARNING_POINT]: t(
      'feature.feature_help.side_dpd.learning_point'
    ),
    [HELP_TOPICS.SUPERVISOR_REVIEWER]: `${t('feature.feature_help.side_dpd.spv_reviewer')} & ${t('feature.feature_help.side_dpd.reviewer_b')}`,
    [HELP_TOPICS.DATA_SECURITY]: t(
      'feature.feature_help.side_dpd.account_data_security'
    ),
    [HELP_TOPICS.OTHERS]: t('feature.feature_help.side_dpd.others'),
    [HELP_TOPICS.TERM_OF_SERVICE]: t(
      'feature.feature_help.side_dpd.terms_of_service'
    ),
    [HELP_TOPICS.PRIVACY_POLICY]: t(
      'feature.feature_help.side_dpd.privacy_policy'
    ),
  }

  return mapping[route] || mapping[HELP_TOPICS.FAQ]
}
