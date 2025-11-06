import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Card } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader } from '@components/common/Loader'
import ModuleCard from './ModuleCard'

/**
 * ModuleList - List of modules that need review
 * Displays all modules with submissions needing review
 * Auto-clicks first module on initial load
 */
const ModuleList = ({
  modules = [],
  isLoading,
  onDeleteModule,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { moduleId, journeyId } = useParams()

  // Auto-click first module on load (desktop only)
  useEffect(() => {
    if (!isLoading && modules.length > 0 && !isMobile) {
      // If no module is selected, select the first one
      if (!moduleId || !journeyId) {
        const firstModule = modules[0]
        navigate(
          `/review/module/${firstModule.module_id}/${firstModule.journey_id}`,
          {
            state: {
              moduleId: firstModule.module_id,
              journeyId: firstModule.journey_id,
              moduleName: firstModule.module_name,
              journeyName: firstModule.journey_name,
              thumbnail: firstModule.thumbnail,
            },
          }
        )
      }
    }
  }, [isLoading, modules, moduleId, journeyId, isMobile, navigate])

  const handleModuleClick = (module) => {
    navigate(`/review/module/${module.module_id}/${module.journey_id}`, {
      state: {
        moduleId: module.module_id,
        journeyId: module.journey_id,
        moduleName: module.module_name,
        journeyName: module.journey_name,
        thumbnail: module.thumbnail,
      },
    })
  }

  if (isMobile) {
    return (
      <div className="p-[18px]">
        {isLoading ? (
          <Loader />
        ) : modules.length > 0 ? (
          <div className="flex flex-col gap-4">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                module={module}
                onClick={() => handleModuleClick(module)}
                onDelete={onDeleteModule}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-sm font-medium text-gray-600">
            {t(
              'feature.feature_reviews.empty_state.no_submissions_need_review'
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <div className="h-auto max-h-[calc(100vh-207px)] overflow-y-auto pr-5">
        {isLoading ? (
          <Loader />
        ) : modules.length > 0 ? (
          modules.map((module, index) => (
            <ModuleCard
              key={index}
              module={module}
              onClick={() => handleModuleClick(module)}
              onDelete={onDeleteModule}
              isActive={
                Number(moduleId) === module.module_id &&
                Number(journeyId) === module.journey_id
              }
              isMobile={isMobile}
            />
          ))
        ) : null}
      </div>
    </Card>
  )
}

ModuleList.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      module_id: PropTypes.number.isRequired,
      journey_id: PropTypes.number.isRequired,
      module_name: PropTypes.string.isRequired,
      journey_name: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      deadline: PropTypes.string,
      need_review: PropTypes.number,
      has_all_users_first_submission: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  onDeleteModule: PropTypes.func,
  isMobile: PropTypes.bool,
}

ModuleList.defaultProps = {
  modules: [],
  isLoading: false,
  onDeleteModule: null,
  isMobile: false,
}

export default ModuleList
