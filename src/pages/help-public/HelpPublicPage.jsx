import { useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { ConfigProvider, Layout } from 'antd'
import { Grid } from 'antd'
import { HelpPublicSidebar } from './components/HelpPublicSidebar'
import { HelpPublicMobileHeader } from './components/HelpPublicMobileHeader'
import { useHelpPublicNavigation } from './hooks/useHelpPublicNavigation'

const { Sider, Content } = Layout
const { useBreakpoint } = Grid

export default function HelpPublicPage() {
  const screens = useBreakpoint()
  const location = useLocation()
  const { currentTopic } = useHelpPublicNavigation()

  const isMobile = screens.xs
  const isScaling =
    (window.innerWidth <= 991 && window.innerWidth >= 768) ||
    window.innerWidth === 581

  // Scroll to top when topic changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Redirect to FAQ if on base path
  if (
    location.pathname === '/help-public' ||
    location.pathname === '/help-public/'
  ) {
    return <Navigate to="/help-public/faq" replace />
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
        aria-label="Public Help Center"
      >
        <Layout hasSider>
          {/* Desktop Sidebar Navigation */}
          {!(isMobile || isScaling) && (
            <Sider
              width={390}
              className="bg-white shadow-[3px_0_16px_rgba(0,0,0,0.1)]"
              role="navigation"
              aria-label="Help Topics Navigation"
            >
              <HelpPublicSidebar />
            </Sider>
          )}

          {/* Content Area */}
          <Content
            className="max-h-full overflow-y-scroll bg-gray-50 leading-normal"
            role="main"
            aria-label="Help Content"
          >
            {/* Mobile Header */}
            {(isMobile || isScaling) && (
              <HelpPublicMobileHeader
                isMobile={isMobile}
                isScaling={isScaling}
                currentTopic={currentTopic}
              />
            )}

            {/* Topic Content */}
            <Outlet context={{ isMobile, isScaling }} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
