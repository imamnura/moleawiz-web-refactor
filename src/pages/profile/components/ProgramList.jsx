import { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatProfileDate } from '../utils/formatters'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'

/**
 * Program List Component
 * Displays list of completed programs
 */
export function ProgramList({ programs, isLoading }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'id'
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewProgram = (program) => {
    setSelectedProgram(program)
    setShowModal(true)
  }

  if (isLoading) {
    return <div className="p-10 text-center text-gray-600">Loading...</div>
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">
        {t('feature.feature_profile.sec_tab.no_program_yet')}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-4">
        {programs.map((program, index) => (
          <Card
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg border-none shadow-md transition-transform hover:scale-105"
            onClick={() => handleViewProgram(program)}
            id={`card-program-${index}`}
            bodyStyle={{ padding: 0 }}
          >
            <Image
              width="100%"
              height={123}
              className="object-cover"
              src={program.thumbnail}
              preview={false}
              fallback={defaultImage}
              alt={program.name}
            />

            <div className="p-3">
              <div className="mb-2 h-[35px] text-sm font-medium leading-tight text-gray-800 line-clamp-2">
                {program.name}
              </div>
              <div className="text-xs text-gray-600">
                {formatProfileDate(program.completed_date, locale)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Program Detail Modal */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={716}
        centered
        className="program-modal"
        closeIcon={
          <div className="rounded-full bg-gray-100 p-2">
            <CloseOutlined className="text-sm text-gray-600" />
          </div>
        }
      >
        {selectedProgram && (
          <div className="p-8">
            <div className="flex gap-5">
              {/* Thumbnail */}
              <div className="shrink-0">
                <Image
                  width={165}
                  height={113}
                  className="rounded-lg object-cover"
                  src={selectedProgram.thumbnail}
                  preview={false}
                  fallback={defaultImage}
                  alt={selectedProgram.name}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="mb-2 text-xs text-gray-600">
                  {t(
                    'feature.feature_profile.sec_popup_completed_program.program'
                  )}
                </div>
                <div className="mb-3 text-[22px] font-medium text-gray-800">
                  {selectedProgram.name}
                </div>

                <div className="flex items-end gap-5">
                  {/* Points */}
                  <div className="text-sm">
                    <span className="font-medium text-gray-800">
                      {selectedProgram.point}{' '}
                    </span>
                    <span className="text-gray-600">
                      {parseInt(selectedProgram.point) > 1
                        ? t(
                            'feature.feature_profile.sec_popup_completed_program.points_earned'
                          )
                        : t(
                            'feature.feature_profile.sec_popup_completed_program.point_earned'
                          )}
                    </span>
                  </div>

                  {/* Courses */}
                  <div className="text-sm">
                    <span className="font-medium text-gray-800">
                      {selectedProgram.total_course}{' '}
                    </span>
                    <span className="text-gray-600">
                      {parseInt(selectedProgram.total_course) > 1
                        ? t(
                            'feature.feature_profile.sec_popup_completed_program.courses'
                          )
                        : t(
                            'feature.feature_profile.sec_popup_completed_program.course'
                          )}
                    </span>
                  </div>
                </div>

                {/* Completed Date */}
                <div className="mt-3 text-sm text-gray-600">
                  {t(
                    'feature.feature_profile.sec_popup_completed_program.completed_on'
                  )}{' '}
                  <span className="font-medium text-gray-800">
                    {formatProfileDate(selectedProgram.completed_date, locale)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedProgram.description && (
              <div className="mt-5 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-800">
                  {t(
                    'feature.feature_profile.sec_popup_completed_program.description'
                  )}
                </div>
                <div className="text-sm leading-relaxed text-gray-600">
                  {selectedProgram.description}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

ProgramList.propTypes = {
  programs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      thumbnail: PropTypes.string,
      completed_date: PropTypes.string,
      point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total_course: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
}

ProgramList.defaultProps = {
  programs: [],
  isLoading: false,
}
