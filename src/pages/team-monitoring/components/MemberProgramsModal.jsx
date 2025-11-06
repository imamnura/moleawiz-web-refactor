import { useEffect, useMemo } from 'react'
import { Modal, Divider, Skeleton } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useLazyGetAllProgramsDetailQuery } from '../../../services/api'
import ProgressCircle from './ProgressCircle'
import { filterIncompletePrograms } from '../utils/memberUtils'
import { sortProgramsByProgress } from '../utils/sortingUtils'

/**
 * Member Programs Modal Component
 * Shows all ongoing programs for a selected member
 */
export default function MemberProgramsModal({ open, member, onClose }) {
  const { t } = useTranslation()
  const [fetchPrograms, { data, isLoading }] =
    useLazyGetAllProgramsDetailQuery()

  useEffect(() => {
    if (open && member) {
      fetchPrograms()
    }
  }, [open, member, fetchPrograms])

  // Filter and sort programs for this member
  const memberPrograms = useMemo(() => {
    if (!data || !member) return []

    // Find programs for this user
    const userPrograms = data.find((item) => item.user_id === member.user_id)
    if (!userPrograms || !userPrograms.journeys) return []

    // Filter incomplete and sort by progress
    const incomplete = filterIncompletePrograms(userPrograms.journeys)
    return sortProgramsByProgress(incomplete)
  }, [data, member])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={462}
      centered
      closeIcon={
        <div className="flex items-center justify-center w-8 h-8 bg-[#F5F5F5] rounded-full">
          <CloseOutlined className="text-[#757575]" />
        </div>
      }
      title={
        isLoading ? (
          <Skeleton.Input active size="small" style={{ width: 150 }} />
        ) : (
          member?.fullname
        )
      }
      className="rounded-3xl"
    >
      {isLoading ? (
        <div>
          <div className="mb-4">
            <Skeleton.Input active size="small" style={{ width: 250 }} />
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <Skeleton.Input active size="small" style={{ width: 300 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pr-8">
          {/* Header */}
          <div className="mb-4">
            <span className="text-sm font-medium text-text-title-mobile">
              {t('feature.feature_tm.ongoing_program')} (
              {member?.total_ongoing || 0})
            </span>
          </div>

          <Divider className="my-4" />

          {/* Programs List */}
          <div className="max-h-[400px] overflow-auto pr-2">
            {memberPrograms.length > 0 ? (
              <div className="space-y-3">
                {memberPrograms.map((program, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <ProgressCircle percent={program.progress} size={40} />
                    <span className="text-sm text-[#424242] flex-1">
                      {program.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#757575] text-center py-4">
                {t('feature.feature_tm.no_ongoing_program')}
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

MemberProgramsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  member: PropTypes.shape({
    user_id: PropTypes.number,
    fullname: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
}
