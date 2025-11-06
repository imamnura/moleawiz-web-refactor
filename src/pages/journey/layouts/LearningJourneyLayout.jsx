import { Layout, Spin } from 'antd'
import { Outlet, useParams } from 'react-router-dom'
import JourneySidebar from '../components/JourneySidebar'
import { useJourneySidebarData } from '../hooks/useSidebarData'

const { Content } = Layout

/**
 * LearningJourneyLayout Component
 *
 * Main layout for Learning Journey feature with sidebar navigation
 * Replaces LearningPages/index.jsx with cleaner implementation
 *
 * Features:
 * - Sidebar with course/module tree
 * - Outlet for nested routes (Journey → Course → Module detail pages)
 * - Responsive layout (Splitter on desktop, Stack on mobile)
 */
export default function LearningJourneyLayout() {
  const { journeyId, courseId } = useParams()

  const {
    courses,
    modulesByCourse,
    supportModulesByCourse,
    isLoading,
    error,
    setActiveCourseId,
  } = useJourneySidebarData(journeyId)

  // Handle course expansion to load modules
  const handleCourseChange = (courseIdParam) => {
    setActiveCourseId(courseIdParam)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load journey data</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <JourneySidebar
        courses={courses}
        modulesByCourse={modulesByCourse}
        supportModulesByCourse={supportModulesByCourse}
        isLoading={isLoading}
        onCourseChange={handleCourseChange}
      />

      {/* Main Content Area */}
      <Content className="bg-white">
        <div className="h-full overflow-y-auto">
          {isLoading && !courseId ? (
            <div className="flex items-center justify-center h-full">
              <Spin size="large" tip="Loading journey..." />
            </div>
          ) : (
            <Outlet
              context={{
                courses,
                modulesByCourse,
                supportModulesByCourse,
              }}
            />
          )}
        </div>
      </Content>
    </Layout>
  )
}
