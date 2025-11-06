import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Flex } from 'antd'
import useRewardHistory from './hooks/useRewardHistory'
import HistoryTable from './components/HistoryTable'
import HistoryList from './components/HistoryList'
import SnackBar from '../../components/SnackBar'
import ICArrowLeft from '../../assets/images/ic-arrow-left.svg'

export default function RewardHistoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Redux state
  const isMobile = useSelector((state) => state.isMobile)

  // Hooks
  const { history, isLoading } = useRewardHistory()

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  // Handle back to rewards
  const handleBack = () => {
    navigate('/rewards')
  }

  // Handle copy success
  const handleCopySuccess = () => {
    setSnackbar({
      open: true,
      message: t('rewards.copy_success'),
      severity: 'success',
    })
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <section className="reward-history-page" aria-labelledby="history-title">
      {/* Header */}
      <header className="history-header mb-6">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={12}>
            <Button
              type="text"
              icon={<img src={ICArrowLeft} alt="Back" className="w-5 h-5" />}
              onClick={handleBack}
              className="p-2 flex items-center justify-center"
              aria-label="Back to rewards"
            />
            <h1
              id="history-title"
              className="text-2xl font-bold text-text-title-mobile m-0"
            >
              {t('rewards.history_title')}
            </h1>
          </Flex>
        </Flex>
      </header>

      {/* History Content */}
      <article className="history-content bg-white rounded-lg p-6">
        {isMobile ? (
          <HistoryList
            history={history}
            isLoading={isLoading}
            onCopySuccess={handleCopySuccess}
          />
        ) : (
          <HistoryTable
            history={history}
            isLoading={isLoading}
            onCopySuccess={handleCopySuccess}
          />
        )}
      </article>

      {/* Snackbar */}
      <SnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </section>
  )
}
