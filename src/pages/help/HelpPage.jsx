import { useEffect, useRef } from 'react'
import { Layout, ConfigProvider } from 'antd'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useResponsive } from '@/hooks/useResponsive'
import { useHelpNavigation } from './hooks/useHelpNavigation'
import { useUserProfile } from './hooks/useUserProfile'
import HelpSidebar from './components/HelpSidebar'
import MobileHelpHeader from './components/MobileHelpHeader'
import TopicSelectModal from './components/TopicSelectModal'

const { Sider, Content } = Layout

/**
 * Help Page Layout
 * Main layout for help/support center with sidebar navigation
 */
const HelpPage = () => {
  const { isMobile } = useResponsive()
  const location = useLocation()
  const contentRef = useRef(null)

  const {
    activeTopic,
    selectedLabel,
    modalVisible,
    setModalVisible,
    navigateToTopic,
  } = useHelpNavigation()

  const {
    loading: loadingProfile,
    profile: userProfile,
    userData,
  } = useUserProfile()

  // Scroll to top on topic change (mobile)
  useEffect(() => {
    if (isMobile && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [selectedLabel, isMobile])

  // Redirect to FAQ if on root help page
  if (location.pathname === '/help') {
    return <Navigate to="/help/faq" replace />
  }

  const handleMenuClick = () => {
    // Highlight menu item on click
    const topic = activeTopic
    const elements = document.querySelectorAll('.item-list-help')
    elements.forEach((el) => el.classList.remove('title-active'))

    const activeElement = document.querySelector(
      `.item-list-help[data-topic="${topic}"]`
    )
    if (activeElement) {
      activeElement.classList.add('title-active')
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Roboto',
        },
      }}
    >
      <Layout
        className="h-full text-left leading-normal"
        role="main"
        aria-label="Help Center"
      >
        <Layout hasSider>
          {/* Desktop Sidebar Navigation */}
          {!isMobile && (
            <Sider
              width={390}
              className="bg-[#F5F5F5] shadow-[3px_0_16px_rgba(0,0,0,0.1)]"
              role="navigation"
              aria-label="Help Topics Navigation"
            >
              <HelpSidebar
                onMenuClick={handleMenuClick}
                userData={userData}
                userProfile={userProfile}
                loadingProfile={loadingProfile}
              />
            </Sider>
          )}

          {/* Content Area */}
          <Content
            component="main"
            className="min-h-full bg-background-content overflow-y-auto leading-normal"
            ref={contentRef}
            role="main"
            aria-label="Help Content"
          >
            {/* Mobile Header */}
            {isMobile && (
              <MobileHelpHeader
                selectedTopic={selectedLabel}
                onTopicClick={() => setModalVisible(true)}
              />
            )}

            {/* Topic Content */}
            <Outlet />

            {/* Mobile Topic Selection Modal */}
            {isMobile && (
              <TopicSelectModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={navigateToTopic}
                selectedTopic={selectedLabel}
                isMobile={isMobile}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default HelpPage
