import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Flex } from 'antd'
import useRewards from './hooks/useRewards'
import useRewardDetail from './hooks/useRewardDetail'
import useRedeemFlow from './hooks/useRedeemFlow'
import RewardList from './components/RewardList'
import RewardDetailModal from './components/RewardDetailModal'
import OTPVerificationModal from './components/OTPVerificationModal'
import RewardSuccessModal from './components/RewardSuccessModal'
import RewardUnavailableModal from './components/RewardUnavailableModal'
import SnackBar from '../../components/SnackBar'
import ICHistory from '../../assets/images/icn-history.svg'
import ICPoints from '../../assets/images/ic-points.svg'
import { formatPoints } from './utils/formatters'

export default function RewardsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Redux state
  const currBalance = useSelector((state) => state.user.profile.points)
  const isMobile = useSelector((state) => state.isMobile)
  const isScalling = useSelector((state) => state.isScalling)

  // Hooks
  const { rewards, isLoading } = useRewards()
  const { rewardDetail, fetchDetail, resetDetail } = useRewardDetail()
  const {
    otpData,
    otpError,
    isRequestingOTP,
    isVerifyingOTP,
    isRedeeming,
    requestOTP,
    verifyOTP,
    requestNewOTP,
    resetOTPFlow,
  } = useRedeemFlow()

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [unavailableModalOpen, setUnavailableModalOpen] = useState(false)

  // Success states
  const [redeemedReward, setRedeemedReward] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  // Handle reward card click
  const handleRewardClick = async (reward) => {
    await fetchDetail(reward.id)
    setDetailModalOpen(true)
  }

  // Handle redeem button click (from detail modal)
  const handleRedeemClick = async () => {
    if (!rewardDetail) return

    const result = await requestOTP(rewardDetail.id)

    if (result.success) {
      setDetailModalOpen(false)
      setOtpModalOpen(true)
    } else if (result.outOfStock) {
      setDetailModalOpen(false)
      setUnavailableModalOpen(true)
    }
  }

  // Handle OTP verification
  const handleVerifyOTP = async (otpCode) => {
    const result = await verifyOTP(otpCode)

    if (result.success) {
      setOtpModalOpen(false)
      setRedeemedReward(result.reward)
      setSuccessModalOpen(true)
      resetOTPFlow()
      resetDetail()
    } else if (result.outOfStock) {
      setOtpModalOpen(false)
      setUnavailableModalOpen(true)
      resetOTPFlow()
      resetDetail()
    }
    // Errors are handled by the hook and displayed in OTP modal
  }

  // Handle request new OTP
  const handleRequestNewOTP = async () => {
    await requestNewOTP()
  }

  // Handle OTP back button
  const handleOTPBack = () => {
    setOtpModalOpen(false)
    resetOTPFlow()
    setDetailModalOpen(true)
  }

  // Handle detail modal close
  const handleDetailClose = () => {
    setDetailModalOpen(false)
    resetDetail()
  }

  // Handle success modal close
  const handleSuccessClose = () => {
    setSuccessModalOpen(false)
    setRedeemedReward(null)
  }

  // Handle unavailable modal close
  const handleUnavailableClose = () => {
    setUnavailableModalOpen(false)
    resetDetail()
  }

  // Handle copy success
  const handleCopySuccess = () => {
    setSnackbar({
      open: true,
      message: t('rewards.copy_success'),
      severity: 'success',
    })
  }

  // Handle navigate to history
  const handleGoToHistory = () => {
    navigate('/rewards/history')
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <section className="rewards-page" aria-labelledby="rewards-title">
      {/* Header */}
      <header className="rewards-header mb-6">
        <Flex justify="space-between" align="center" className="mb-4">
          <h1
            id="rewards-title"
            className="text-2xl font-bold text-text-title-mobile m-0"
          >
            {t('rewards.title')}
          </h1>
          <button
            type="button"
            onClick={handleGoToHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0066CC] text-[#0066CC] rounded-lg hover:bg-[#E6F2FF] transition-colors text-sm font-medium"
            aria-label={t('rewards.history')}
          >
            <img src={ICHistory} alt="" className="w-5 h-5" aria-hidden="true" />
            <span>{t('rewards.history')}</span>
          </button>
        </Flex>

        {/* Current Balance */}
        <article className="bg-linear-to-r from-[#0066CC] to-[#0052A3] rounded-2xl p-6 text-white">
          <Flex align="center" gap={12}>
            <img src={ICPoints} alt="" className="w-12 h-12" aria-hidden="true" />
            <div>
              <p className="text-sm opacity-90 m-0 mb-1">
                {t('rewards.current_balance')}
              </p>
              <p className="text-3xl font-bold m-0" aria-label={`${formatPoints(currBalance || 0)} points`}>
                {formatPoints(currBalance || 0)}
              </p>
            </div>
          </Flex>
        </article>
      </header>

      {/* Rewards List */}
      <section aria-label="Available rewards">
        <RewardList
          rewards={rewards}
          onRedeemClick={handleRewardClick}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      </section>

      {/* Detail Modal */}
      <RewardDetailModal
        open={detailModalOpen}
        reward={rewardDetail}
        onClose={handleDetailClose}
        onRedeem={handleRedeemClick}
        isLoading={isRequestingOTP}
        isMobile={isMobile}
        isScalling={isScalling}
      />

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        open={otpModalOpen}
        email={otpData?.email}
        expiredDate={otpData?.verificationCodeExpired}
        sendDate={otpData?.verificationCodeSent}
        onVerify={handleVerifyOTP}
        onRequestNew={handleRequestNewOTP}
        onBack={handleOTPBack}
        error={otpError}
        isLoading={isVerifyingOTP || isRedeeming}
        isMobile={isMobile}
      />

      {/* Success Modal */}
      <RewardSuccessModal
        open={successModalOpen}
        reward={redeemedReward}
        onClose={handleSuccessClose}
        onCopySuccess={handleCopySuccess}
        isMobile={isMobile}
        isScalling={isScalling}
      />

      {/* Unavailable Modal */}
      <RewardUnavailableModal
        open={unavailableModalOpen}
        onClose={handleUnavailableClose}
        isMobile={isMobile}
        isScalling={isScalling}
      />

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
