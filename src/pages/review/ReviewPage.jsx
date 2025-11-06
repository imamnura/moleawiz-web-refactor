import { useState, useEffect } from 'react'
import { Row, Col, ConfigProvider } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HomeTitle from '@components/common/HomeTitle'
import { Loader } from '@components/common/Loader'
import ModuleList from './components/ModuleList'
import UserList from './components/UserList'
import ReviewForm from './components/ReviewForm'
import ReviewPreview from './components/ReviewPreview'
import {
  ModalCloseFormReview,
  ModalIncompleteReview,
  ModalConfirmSubmitReview,
  ModalDeleteModule,
} from './components/ReviewModals'
import { useModulesData } from './hooks/useModulesData'
import { useUserSubmissions } from './hooks/useUserSubmissions'
import { useSubmissionReview } from './hooks/useSubmissionReview'
import {
  useDeleteModuleSubmissionMutation,
  useSubmitReviewMutation,
} from '@/services/api/reviewApi'
import { formatSubmissionDate } from './utils/formatters'

/**
 * ReviewPage - Main review page
 * Desktop: 2-column layout (modules left, users right)
 * Mobile: Routing-based navigation (modules → users)
 */
const ReviewPage = ({ isMobile = false }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const locale = i18n.language === 'en' ? 'en' : 'id'

  // Modal states
  const [openReviewForm, setOpenReviewForm] = useState(false)
  const [openReviewPreview, setOpenReviewPreview] = useState(false)
  const [openQuitModal, setOpenQuitModal] = useState(false)
  const [openIncompleteModal, setOpenIncompleteModal] = useState(false)
  const [openSubmitModal, setOpenSubmitModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  // Selected data
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduleToDelete, setModuleToDelete] = useState(null)
  const [submitData, setSubmitData] = useState(null)

  // Fetch modules data
  const {
    modules,
    modulesCount,
    isLoading: isLoadingModules,
    refetchModules,
  } = useModulesData()

  // Fetch user submissions (depends on route params)
  const {
    users,
    filterStatus,
    setFilterStatus,
    statusCounts,
    emptyMessage,
    isLoading: isLoadingUsers,
    refetchUsers,
    moduleId,
  } = useUserSubmissions()

  // Fetch review data
  const { currentReview, overallFeedback, reviewCounts } = useSubmissionReview()

  // Mutations
  const [deleteModule] = useDeleteModuleSubmissionMutation()
  const [submitReview] = useSubmitReviewMutation()

  // Show details module review (mobile routing state)
  const showDetailsModuleReview = location.pathname.includes('/review/module/')

  // Handle user click
  const handleUserClick = (user) => {
    setSelectedUser({
      ...user,
      submited_formatted: formatSubmissionDate(user.submited, locale),
    })

    // Get module title from location state or modules
    const moduleTitle =
      location.state?.moduleName ||
      modules.find((m) => m.module_id === moduleId)?.module_name ||
      ''

    setSelectedModule({ title: moduleTitle })

    // Open appropriate modal based on status
    if (user.status === null) {
      // Need review - open form
      setOpenReviewForm(true)
    } else {
      // Already reviewed - open preview
      setOpenReviewPreview(true)
    }
  }

  // Handle delete module
  const handleDeleteModule = (module) => {
    setModuleToDelete(module)
    setOpenDeleteModal(true)
  }

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return

    try {
      await deleteModule({ cmid: moduleToDelete.module_id }).unwrap()
      setOpenDeleteModal(false)
      setModuleToDelete(null)
      refetchModules()
      // Show success snackbar
      console.log('Module deleted successfully')
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  // Handle quit review form
  const handleQuitReview = () => {
    setOpenQuitModal(false)
    setOpenReviewForm(false)
    setSelectedUser(null)
  }

  // Handle submit review
  const handleOpenSubmitModal = (data) => {
    setSubmitData(data)
    setOpenSubmitModal(true)
  }

  const confirmSubmitReview = async () => {
    if (!submitData?.formValues) return

    try {
      // Submit review using the hook
      await submitReview(submitData.formValues).unwrap()

      setOpenSubmitModal(false)
      setOpenReviewForm(false)
      setSelectedUser(null)
      setSubmitData(null)

      // Refetch data
      refetchModules()
      refetchUsers()

      // Show success snackbar
      console.log('Review submitted successfully')
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  // Desktop: Auto-navigate to first module's user list
  useEffect(() => {
    if (!isMobile && modules.length > 0 && !moduleId) {
      const firstModule = modules[0]
      navigate(
        `/review/module/${firstModule.module_id}/${firstModule.journey_id}`
      )
    }
  }, [modules, moduleId, isMobile, navigate])

  const HomeTitleText = t(
    'feature.feature_reviews.anchor.review_learner_submissions'
  )

  return (
    <div className={isMobile ? 'p-0' : 'p-5 px-10'}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Roboto',
          },
          components: {
            Radio: {
              buttonCheckedBg: '#0066CC',
              radioSize: 20,
              dotSize: 12,
              buttonColor: '#0066CC',
              wrapperMarginInlineEnd: 24,
            },
            Input: {
              hoverBorderColor: '#0066CC',
              activeBorderColor: '#0066CC',
            },
          },
        }}
      >
        {!isMobile ? (
          <>
            {/* Desktop Layout */}
            <Row align="top" className="mb-5">
              <HomeTitle
                textTitle={HomeTitleText}
                attrTextTitle="text-title-review"
                dynamic={false}
              />
              <div
                className={`text-sm font-medium mt-6 ${
                  isLoadingModules || modulesCount > 0 ? 'hidden' : 'block'
                }`}
              >
                {t(
                  'feature.feature_reviews.empty_state.no_submissions_need_review'
                )}
              </div>
            </Row>

            <Row gutter={[10, 20]}>
              {isLoadingModules ? <Loader /> : null}

              {/* Module List - Left Column */}
              <Col
                span={11}
                className={
                  isLoadingModules || modulesCount === 0 ? 'hidden' : 'block'
                }
              >
                <ModuleList
                  modules={modules}
                  isLoading={isLoadingModules}
                  onDeleteModule={handleDeleteModule}
                  isMobile={isMobile}
                />
              </Col>

              {/* User List - Right Column */}
              <Col
                span={13}
                className={
                  isLoadingModules || modulesCount === 0 ? 'hidden' : 'block'
                }
              >
                <UserList
                  users={users}
                  statusCounts={statusCounts}
                  filterStatus={filterStatus}
                  onFilterChange={setFilterStatus}
                  onUserClick={handleUserClick}
                  emptyMessage={emptyMessage}
                  isLoading={isLoadingUsers}
                  isMobile={isMobile}
                />
              </Col>
            </Row>
          </>
        ) : (
          // Mobile Layout
          <>
            {showDetailsModuleReview ? (
              <UserList
                users={users}
                statusCounts={statusCounts}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                onUserClick={handleUserClick}
                emptyMessage={emptyMessage}
                isLoading={isLoadingUsers}
                isMobile={isMobile}
              />
            ) : (
              <ModuleList
                modules={modules}
                isLoading={isLoadingModules}
                onDeleteModule={handleDeleteModule}
                isMobile={isMobile}
              />
            )}
          </>
        )}
      </ConfigProvider>

      {/* Review Form Modal */}
      <ReviewForm
        open={openReviewForm}
        user={selectedUser}
        moduleTitle={selectedModule?.title}
        onSubmit={handleOpenSubmitModal}
        onOpenQuitModal={() => setOpenQuitModal(true)}
        onOpenIncompleteModal={() => setOpenIncompleteModal(true)}
        onOpenSubmitModal={handleOpenSubmitModal}
        isMobile={isMobile}
      />

      {/* Review Preview Modal */}
      <ReviewPreview
        open={openReviewPreview}
        user={selectedUser}
        moduleTitle={selectedModule?.title}
        reviewData={currentReview}
        overallFeedback={overallFeedback}
        reviewCounts={reviewCounts}
        onClose={() => {
          setOpenReviewPreview(false)
          setSelectedUser(null)
        }}
        isMobile={isMobile}
      />

      {/* Confirmation Modals */}
      <ModalCloseFormReview
        open={openQuitModal}
        onClose={() => setOpenQuitModal(false)}
        onConfirm={handleQuitReview}
      />

      <ModalIncompleteReview
        open={openIncompleteModal}
        onClose={() => setOpenIncompleteModal(false)}
      />

      <ModalConfirmSubmitReview
        open={openSubmitModal}
        onClose={() => setOpenSubmitModal(false)}
        onConfirm={confirmSubmitReview}
        acceptCount={submitData?.acceptCount || 0}
        rejectCount={submitData?.rejectCount || 0}
        isApproved={submitData?.overallDecision === 1}
      />

      <ModalDeleteModule
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false)
          setModuleToDelete(null)
        }}
        onConfirm={confirmDeleteModule}
        moduleName={moduleToDelete?.module_name}
      />
    </div>
  )
}

export default ReviewPage
