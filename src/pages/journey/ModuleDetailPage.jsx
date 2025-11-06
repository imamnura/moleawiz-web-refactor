import { Spin, Empty, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ModuleHeader from './components/ModuleHeader'
import ModuleDescription from './components/ModuleDescription'
import ModuleInfo from './components/ModuleInfo'
import ModuleActions from './components/ModuleActions'
import { useModuleDetail, useModuleProgress } from './hooks/useModuleDetail'
import useResponsive from '../../hooks/useResponsive'

/**
 * ModuleDetailPage Component
 *
 * Main module detail page showing module info and actions
 * Replaces SubPages/Module/index.jsx
 */
export default function ModuleDetailPage() {
  const { t } = useTranslation()
  const { journeyId, courseId, moduleId } = useParams()
  const { isMobile } = useResponsive()

  const { module, isLoading, error } = useModuleDetail(
    journeyId,
    courseId,
    moduleId
  )

  const { resyncScorm, isResyncing } = useModuleProgress(
    journeyId,
    courseId,
    moduleId
  )

  // Handle re-sync action
  const handleResync = (moduleIdParam) => {
    const scormKey = `scorm-${moduleIdParam}`
    resyncScorm({ scormKey })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip={t('common.loading')} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{t('common.error')}</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // No data state
  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty description="Module not found" />
      </div>
    )
  }

  // Get module index/number from summary
  const moduleIndex =
    module.summary && !module.summary.includes('<p') && module.summary !== ''
      ? parseInt(module.summary)
      : module.sort || 0

  return (
    <div
      className={`
      module-detail-page bg-white
      ${isMobile ? 'pb-24' : 'min-h-screen'}
    `}
    >
      {/* Module Header with Title & Points */}
      <ModuleHeader
        module={module}
        moduleIndex={moduleIndex}
        journeyId={journeyId}
        courseId={courseId}
        learningPoints={module.point || 0}
        isMobile={isMobile}
      />

      <Divider className="my-0" />

      {/* Module Description */}
      {module.description && (
        <>
          <ModuleDescription
            description={module.description}
            isMobile={isMobile}
          />
          <Divider className="my-0" />
        </>
      )}

      {/* Module Info (Type, Grading, Attempts, Info Points, Badges) */}
      <ModuleInfo module={module} isMobile={isMobile} />

      <Divider className="my-0" />

      {/* Module Actions (Enter/Re-sync Button) */}
      <ModuleActions
        module={module}
        journeyId={journeyId}
        courseId={courseId}
        isMobile={isMobile}
        onResync={handleResync}
      />

      {/* Loading overlay for re-sync */}
      {isResyncing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Spin size="large" tip="Syncing data..." />
        </div>
      )}
    </div>
  )
}
