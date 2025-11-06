import { useParams, useNavigate } from 'react-router-dom'
import { Button, Alert } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { SCORMPlayer } from './components'
import { useModuleDetail } from './hooks'
import { Loader } from '@/components/common'
import { useSelector } from 'react-redux'

/**
 * SCORM Player Page
 * Full screen SCORM content player with progress tracking
 */
export const SCORMPlayerPage = () => {
  const { journeyId, courseId, moduleId } = useParams()
  const navigate = useNavigate()

  // Get user info from Redux
  const userId = useSelector((state) => state.auth?.user?.id)
  const userName = useSelector((state) => state.auth?.user?.name)

  // Fetch module detail
  const { module, isLoading, isError, error } = useModuleDetail(
    journeyId,
    courseId,
    moduleId
  )

  const handleComplete = () => {
    console.log('[SCORM Player Page] Module completed')
    // Navigate back to module detail
    navigate(`/journey/${journeyId}/course/${courseId}/module/${moduleId}`)
  }

  const handleExit = () => {
    console.log('[SCORM Player Page] User exited')
    // Navigate back to module detail
    navigate(`/journey/${journeyId}/course/${courseId}/module/${moduleId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="max-w-md w-full">
          <Alert
            message="Error Loading Module"
            description={error?.message || 'Failed to load module details'}
            type="error"
            showIcon
            action={
              <Button onClick={() => navigate(`/journey/${journeyId}`)}>
                <ArrowLeftOutlined /> Back to Journey
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  if (!module?.scorm_url && !module?.content_url) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="max-w-md w-full">
          <Alert
            message="Content Not Available"
            description="This module does not have SCORM content."
            type="warning"
            showIcon
            action={
              <Button
                onClick={() =>
                  navigate(
                    `/journey/${journeyId}/course/${courseId}/module/${moduleId}`
                  )
                }
              >
                <ArrowLeftOutlined /> Back to Module
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  const contentUrl = module.scorm_url || module.content_url

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SCORMPlayer
        contentUrl={contentUrl}
        module={module}
        onComplete={handleComplete}
        onExit={handleExit}
        studentId={userId}
        studentName={userName}
      />
    </div>
  )
}

export default SCORMPlayerPage
