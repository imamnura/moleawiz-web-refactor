import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mapLabelToRoute, mapRouteToLabel } from '../data/helpTopics.jsx'

/**
 * Custom hook for help topic navigation and state management
 * Handles active topic tracking, mobile modal state, and navigation
 */
export const useHelpNavigation = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTopic, setActiveTopic] = useState('')
  const [selectedLabel, setSelectedLabel] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  /**
   * Get current topic from URL
   */
  const getCurrentTopic = () => {
    const pathSegments = location.pathname.split('/')
    return pathSegments.filter(Boolean).pop() || 'faq'
  }

  /**
   * Update active topic based on current URL
   */
  useEffect(() => {
    const topic = getCurrentTopic()
    setActiveTopic(topic)
    setSelectedLabel(mapRouteToLabel(topic, t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, t, i18n.language])

  /**
   * Navigate to selected topic
   * @param {string} label - Topic label
   */
  const navigateToTopic = (label) => {
    const topicRoute = mapLabelToRoute(label, t)
    navigate(`/help/${topicRoute}`, { replace: true })
    setSelectedLabel(label)
    setModalVisible(false)
  }

  /**
   * Highlight active menu item
   * @param {string} topicKey - Topic key to highlight
   */
  const highlightMenuItem = (topicKey) => {
    // Remove all active classes
    document
      .querySelectorAll('.item-list-help')
      .forEach((el) => el.classList.remove('title-active'))

    // Add active class to current item
    const activeElement = document.querySelector(
      `.item-list-help[data-topic="${topicKey}"]`
    )
    if (activeElement) {
      activeElement.classList.add('title-active')
    }
  }

  /**
   * Apply menu highlighting on topic change
   */
  useEffect(() => {
    highlightMenuItem(activeTopic)
  }, [activeTopic])

  return {
    activeTopic,
    selectedLabel,
    modalVisible,
    setModalVisible,
    navigateToTopic,
    getCurrentTopic,
  }
}
