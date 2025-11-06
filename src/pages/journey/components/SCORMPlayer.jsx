import PropTypes from 'prop-types'
import { useRef, useEffect, useState } from 'react'
import { Spin, Alert, Button } from 'antd'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { createSCORMAPI, destroySCORMAPI } from '@/utils/scorm/scormAPI'
import { useSCORMPlayer } from '../hooks/useSCORMPlayer'

/**
 * SCORM Player Component
 * Displays SCORM content in iframe with API communication
 *
 * @param {string} contentUrl - SCORM content URL
 * @param {Object} module - Module data
 * @param {Function} onComplete - Callback when module completed
 * @param {Function} onExit - Callback when user exits
 * @param {Object} savedData - Previously saved SCORM data
 */
export const SCORMPlayer = ({
  contentUrl,
  module,
  onComplete,
  onExit,
  savedData,
  studentId,
  studentName,
}) => {
  const iframeRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const {
    scormData,
    isInitialized,
    isCompleted,
    handleInitialize,
    handleFinish,
    handleSetValue,
    handleCommit,
    syncData,
  } = useSCORMPlayer({
    moduleId: module?.id,
    savedData,
    onComplete,
  })

  // Initialize SCORM API
  useEffect(() => {
    createSCORMAPI({
      savedData: scormData,
      studentId,
      studentName,
      onInitialize: handleInitialize,
      onFinish: handleFinish,
      onSetValue: handleSetValue,
      onCommit: handleCommit,
    })

    console.log('[SCORM Player] API initialized')

    return () => {
      if (!isCompleted) {
        // Save data before unmount if not completed
        syncData()
      }
      destroySCORMAPI()
      console.log('[SCORM Player] Cleanup complete')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log('[SCORM Player] Iframe loaded')
    setIframeLoaded(true)

    // Try to find API in iframe context
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      // Some SCORM content looks for API in parent
      iframe.contentWindow.API = window.API
    }
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = document.getElementById('scorm-player-container')

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen()
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        )
      )
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Warn before leaving if not completed
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isInitialized && !isCompleted) {
        e.preventDefault()
        e.returnValue =
          'You have unsaved progress. Are you sure you want to leave?'
        syncData() // Try to save data
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isInitialized, isCompleted, syncData])

  if (!contentUrl) {
    return (
      <Alert
        message="Content Not Available"
        description="SCORM content URL is not provided."
        type="error"
        showIcon
        icon={<WarningOutlined />}
        className="m-4"
      />
    )
  }

  return (
    <div
      id="scorm-player-container"
      className="relative w-full h-full bg-gray-900"
    >
      {/* Loading Spinner */}
      {!iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <Spin
            size="large"
            tip="Loading SCORM content..."
            className="text-white"
          />
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute top-0 right-0 z-20 p-2 flex gap-2">
        {/* Fullscreen Toggle */}
        <Button
          type="primary"
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        />

        {/* Exit Button */}
        {onExit && (
          <Button
            type="default"
            onClick={() => {
              if (isInitialized && !isCompleted) {
                if (
                  window.confirm(
                    'Are you sure you want to exit? Your progress will be saved.'
                  )
                ) {
                  syncData()
                  onExit()
                }
              } else {
                onExit()
              }
            }}
          >
            Exit
          </Button>
        )}
      </div>

      {/* SCORM Content Iframe */}
      <iframe
        ref={iframeRef}
        src={contentUrl}
        title="SCORM Content"
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        allow="autoplay; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />

      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <Alert message="Module Completed!" type="success" showIcon closable />
        </div>
      )}
    </div>
  )
}

SCORMPlayer.propTypes = {
  contentUrl: PropTypes.string.isRequired,
  module: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onComplete: PropTypes.func,
  onExit: PropTypes.func,
  savedData: PropTypes.object,
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  studentName: PropTypes.string,
}

export default SCORMPlayer
