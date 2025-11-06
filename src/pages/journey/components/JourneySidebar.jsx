import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Collapse, Layout } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import CourseItem from './CourseItem'
import useResponsive from '../../../hooks/useResponsive'

const { Sider } = Layout

/**
 * JourneySidebar Component
 *
 * Sidebar navigation for Learning Journey with course/module tree
 * Replaces LearningPages sidebar with modern, clean implementation
 *
 * @param {Object} props
 * @param {Array} props.courses - List of courses in journey
 * @param {Object} props.modulesByCourse - Map of course ID to modules array
 * @param {Object} props.supportModulesByCourse - Map of course ID to support modules
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onCourseChange - Callback when course is expanded/collapsed
 */
export default function JourneySidebar({
  courses = [],
  modulesByCourse = {},
  supportModulesByCourse = {},
  isLoading = false,
  onCourseChange,
}) {
  const { t } = useTranslation()
  const { journeyId, courseId } = useParams()
  const { isMobile, isScaling } = useResponsive()

  // Active collapsed course keys (Collapse component uses string keys)
  const [activeKeys, setActiveKeys] = useState([])

  // Initialize active keys based on current course from URL
  useEffect(() => {
    if (courseId && courses.length > 0) {
      const courseIndex = courses.findIndex((c) => c.id === courseId)
      if (courseIndex !== -1) {
        const key = String(courseIndex + 1) // Collapse uses 1-based string keys
        setActiveKeys([key])
      }
    }
  }, [courseId, courses])

  // Handle collapse change
  const handleCollapseChange = (keys) => {
    setActiveKeys(keys)

    // Notify parent component
    if (onCourseChange && keys.length > 0) {
      const lastKey = keys[keys.length - 1]
      const courseIndex = parseInt(lastKey) - 1
      const course = courses[courseIndex]
      if (course) {
        onCourseChange(course.id)
      }
    }
  }

  // Prepare Collapse items
  const collapseItems = courses.map((course, index) => {
    const key = String(index + 1)
    const modules = modulesByCourse[course.id] || []
    const supportModules = supportModulesByCourse[course.id] || []
    const isActive = activeKeys.includes(key)

    return {
      key,
      label: (
        <CourseItem
          course={course}
          modules={modules}
          supportModules={supportModules}
          journeyId={journeyId}
          isActive={isActive}
          isMobile={isMobile}
          isLoading={isLoading && isActive}
          courseIndex={index}
        />
      ),
      showArrow: true,
      children: null, // Children rendered inside CourseItem for better control
    }
  })

  // Sidebar width based on screen size
  const siderWidth = isMobile ? '100%' : isScaling ? '20vw' : 280

  return (
    <Sider
      width={siderWidth}
      className="journey-sidebar bg-white border-r border-gray-200"
      breakpoint="lg"
      collapsedWidth={0}
    >
      <div className="h-full overflow-y-auto">
        {/* Journey Title */}
        <div className="px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-semibold text-gray-800 m-0">
            {t('feature.feature_mylj.side_dpd.course_list')}
          </h3>
        </div>

        {/* Course Collapse List */}
        <div className="p-2">
          {isLoading && courses.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {t('common.loading')}...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {t('feature.feature_mylj.side_dpd.no_courses')}
            </div>
          ) : (
            <Collapse
              accordion={false}
              activeKey={activeKeys}
              onChange={handleCollapseChange}
              className="journey-course-collapse"
              bordered={false}
              expandIconPosition="end"
              items={collapseItems}
            />
          )}
        </div>
      </div>

      {/* Hidden elements for tooltip calculations (maintain compatibility) */}
      <div id="hidden-el" className="hidden" />
      <div id="hidden-el-course" className="hidden" />
    </Sider>
  )
}

JourneySidebar.propTypes = {
  courses: PropTypes.array,
  modulesByCourse: PropTypes.object,
  supportModulesByCourse: PropTypes.object,
  isLoading: PropTypes.bool,
  onCourseChange: PropTypes.func,
}
