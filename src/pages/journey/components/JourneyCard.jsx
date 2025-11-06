import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Button, Space } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from '@/components/ui/Badge'
import {
  calculateProgress,
  getButtonConfig,
  formatDaysLeft,
  formatCourseCount,
} from '@/utils/journeyHelpers'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'
import iCourses from '@/assets/images/svgs/ic_courses_programdesc.svg'

/**
 * JourneyCard Component
 * Displays journey information in card format with responsive layout
 *
 * @param {Object} journey - Journey data object
 * @param {boolean} isMobile - Mobile version flag
 * @param {number} index - Card index for tracking
 */
export const JourneyCard = ({ journey, isMobile = false, index }) => {
  const { t } = useTranslation()

  const progress = calculateProgress(
    journey.module_completed,
    journey.total_module
  )
  const buttonConfig = getButtonConfig(journey.is_new, journey.is_completed, t)
  const courseCount = journey.course ? journey.course.length : 0
  const progressColor = progress === 100 ? '#18B430' : null

  const CardContent = (
    <Card
      bordered={false}
      className={`journey-card ${isMobile ? 'mobile' : 'desktop'}`}
      bodyStyle={{ padding: 0 }}
    >
      <div
        className={`flex ${isMobile ? 'flex-row gap-0' : 'flex-col'} w-full`}
      >
        {/* Image Section with Badges */}
        <div
          className={`relative ${isMobile ? 'w-[109px] h-32' : 'w-full h-[156px]'}`}
        >
          {/* Deadline Badge */}
          {journey.days_left && journey.is_completed !== 1 && (
            <Badge
              variant={journey.days_left === 'overdue' ? 'overdue' : 'deadline'}
              position="top-left"
              className={isMobile ? 'text-[10px] px-2 py-1' : ''}
            >
              {formatDaysLeft(journey.days_left, t)}
            </Badge>
          )}

          {/* Journey Thumbnail */}
          <Image
            preview={false}
            width={isMobile ? 109 : 228}
            height={isMobile ? 128 : 156}
            className={`object-cover ${isMobile ? 'rounded-lg' : 'rounded-t-lg'}`}
            src={journey.thumbnail}
            fallback={defaultImage}
            alt={journey.name}
          />

          {/* New Badge */}
          {journey.badge_new && (
            <Badge
              variant="new"
              position="top-right"
              className={isMobile ? 'text-[10px] px-2 py-1' : ''}
            >
              {t('feature.feature_mylj.anchor.new')}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div
          className={`flex flex-col ${isMobile ? 'flex-1 p-3' : 'p-3.5'} gap-2`}
        >
          {/* Title */}
          <h3
            className={`text-sm font-medium text-text-title break-dots-second-line ${isMobile ? 'h-auto' : 'h-[38px]'}`}
          >
            {journey.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-text-desc break-dots-second-line h-8 leading-tight">
            {journey.description}
          </p>

          {/* Meta Info */}
          <div
            className={`flex justify-between items-center text-xs ${isMobile ? 'mb-0' : 'mb-2'}`}
          >
            {/* Course Count */}
            <div className="flex items-center gap-1">
              <Image
                preview={false}
                width={16}
                src={iCourses}
                alt="courses icon"
              />
              <span className="font-medium text-text-title">
                {formatCourseCount(courseCount, t)}
              </span>
            </div>

            {/* Progress Percentage */}
            {journey.is_new !== 1 && (
              <span
                className="font-medium text-right"
                style={{
                  color: isMobile
                    ? progress === 0
                      ? '#B7B7B7'
                      : progressColor || '#123FA0'
                    : progressColor || '#123FA0',
                }}
              >
                {progress}% {t('feature.feature_mylj.anchor.completed_label')}
              </span>
            )}
          </div>

          {/* Action Button (Desktop Only) */}
          {!isMobile && (
            <Link
              to={`/my-learning-journey/journey/${journey.id}`}
              data-index={index}
              className="w-full"
            >
              <Button
                block
                className={buttonConfig.className}
                style={{
                  backgroundColor: buttonConfig.bg,
                  color: buttonConfig.color,
                  borderColor: buttonConfig.borderColor,
                  borderRadius: '8px',
                  fontSize: '12px',
                  height: '29px',
                }}
              >
                {buttonConfig.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )

  // Wrap entire card with Link for mobile
  if (isMobile) {
    return (
      <Link
        to={`/my-learning-journey/journey/${journey.id}`}
        data-index={index}
        className="w-full"
      >
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

JourneyCard.propTypes = {
  journey: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    is_new: PropTypes.number,
    is_completed: PropTypes.number,
    days_left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    badge_new: PropTypes.bool,
    module_completed: PropTypes.number,
    total_module: PropTypes.number,
    course: PropTypes.array,
  }).isRequired,
  isMobile: PropTypes.bool,
  index: PropTypes.number,
}

export default JourneyCard
