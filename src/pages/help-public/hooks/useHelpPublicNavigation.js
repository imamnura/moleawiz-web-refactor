import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { helpPublicTopics } from '../data/helpPublicTopics'

export function useHelpPublicNavigation() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentTopic = useCallback(() => {
    const pathSegments = location.pathname.split('/')
    const lastSegment = pathSegments.filter(Boolean).pop()

    const topic = helpPublicTopics.find((t) => t.key === lastSegment)
    if (!topic) {
      return t('feature.feature_help.side_dpd.frequently_asked_questions')
    }

    if (topic.key === 'login') {
      return i18n.language === 'en' ? 'Login' : 'Login'
    }

    return topic.label
  }, [location.pathname, t, i18n.language])

  const navigateToTopic = useCallback(
    (topicKey) => {
      const topic = helpPublicTopics.find((t) => t.key === topicKey)
      if (topic) {
        navigate(topic.path, { replace: true })
      }
    },
    [navigate]
  )

  return {
    currentTopic: getCurrentTopic(),
    navigateToTopic,
  }
}
