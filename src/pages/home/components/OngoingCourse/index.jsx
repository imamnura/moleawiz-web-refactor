import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import { Loader } from '@/components/common/Loader'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { Space, Progress, Button, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import useActions from './hooks/useActions'

import defaultImage from '@/assets/images/png/general/img_thumb_default.png'
import { progressBarLine } from '@/config/constant/color/index'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'

/**
 * OngoingCourse component
 * Displays horizontal scrollable list of ongoing courses with progress
 *
 * @param {Object} props
 * @param {boolean} props.onGoingCourseLoading - Loading state
 * @param {Array} props.listCourseOngoing - List of ongoing courses
 * @param {Array} props.listJourneyOGC - List of journeys for ongoing courses
 * @param {Function} props.isEmptySetter - Callback to set empty state
 */
const OngoingCourse = ({
  onGoingCourseLoading,
  listCourseOngoing,
  listJourneyOGC,
  isEmptySetter,
}) => {
  const { t } = useTranslation()

  const [swiperOn, setSwiperOn] = useState(true)
  const [checkState, setCheckState] = useState()
  const { loading, onGoingCourse } = useActions(
    onGoingCourseLoading,
    listCourseOngoing,
    listJourneyOGC,
    isEmptySetter
  )
  const refCard = useRef(null)
  const refSwiperItem = useRef(null)

  const btnPrev = document.querySelector('#id-btn-prev-ongoingcourse')
  const btnNext = document.querySelector('#id-btn-next-ongoingcourse')

  const percentageProgress = (moduleCompleted, totalModule) => {
    return (moduleCompleted / totalModule) * 100
  }

  const swiperStyle = {
    margin: 0,
    height: '100%',
    maxWidth: '166px',
    color: '#fff',
    lineHeight: 'normal',
    textAlign: 'center',
  }

  // Check if swiper should be enabled
  const checkWidthCard = useCallback(
    (a, b, status) => {
      if (onGoingCourse.length * (b.offsetWidth + 20) < a.offsetWidth) {
        setSwiperOn(false)
      } else {
        if (status === 'init-collapsed')
          btnNext?.setAttribute('activestate', 'true')
        setSwiperOn(true)
      }
    },
    [onGoingCourse.length, btnNext]
  )

  const SwiperChildComp = ({ item, index }) => (
    <article
      ref={refSwiperItem}
      className="flex justify-center flex-col w-full"
      role="article"
      aria-label={`Ongoing course: ${item.name}`}
    >
      <Space direction="vertical">
        <div className="w-full h-[114px] rounded-lg">
          <Image
            preview={false}
            width={166}
            height={114}
            className="object-cover rounded-lg"
            src={item.thumbnail}
            fallback={defaultImage}
            alt={`${item.name} thumbnail`}
          />
        </div>

        <h3 className="title-course h-[38px] text-sm font-medium text-text-title text-left m-0">
          <div className="center-vertically-and-horizontally break-dots-second-line overflow-hidden text-ellipsis">
            {item.name}
          </div>
        </h3>

        <p className="title-program text-xs text-text-desc text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[166px] m-0">
          {item.journey_name}
        </p>

        <div
          className="progress-bar-module"
          role="progressbar"
          aria-label="Course progress"
        >
          <Progress
            percent={percentageProgress(
              item.total_completed,
              item.total_module
            )}
            format={() => `${item.total_completed}/${item.total_module}`}
            type="line"
            strokeColor={progressBarLine}
            aria-valuenow={percentageProgress(
              item.total_completed,
              item.total_module
            )}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div>
          <Link
            to={`/my-learning-journey/journey/${item.journey_id}/course/${item.id}`}
            data-index={index}
            name="btn-continue-ongoing-course-home"
            aria-label={`Continue ${item.name}`}
          >
            <Button
              className="btn-primary"
              block
              style={{ height: '29px', fontSize: '12px' }}
            >
              {t('feature.home.main_content.continue')}
            </Button>
          </Link>
        </div>
      </Space>
    </article>
  )

  const onSwiperMove = () => {
    if (btnPrev?.getAttribute('activestate') === 'false')
      btnPrev.setAttribute('activestate', 'true')
    if (btnNext?.getAttribute('activestate') === 'false')
      btnNext.setAttribute('activestate', 'true')
    btnPrev?.classList.remove('btn-swiper-disabled')
  }

  const handleReachBeginning = () => {
    const intrBtnPrev = setInterval(() => {
      if (btnPrev?.classList.contains('swiper-button-disabled')) {
        btnPrev.setAttribute('activestate', 'false')
        btnNext?.setAttribute('activestate', 'true')
        btnNext?.classList.remove('btn-swiper-disabled')
        clearInterval(intrBtnPrev)
      }
    }, 100)
  }

  const handleReachEnd = () => {
    const intrBtnNext = setInterval(() => {
      if (btnNext?.classList.contains('swiper-button-disabled')) {
        btnNext.setAttribute('activestate', 'false')
        btnPrev?.setAttribute('activestate', 'true')
        btnPrev?.classList.remove('btn-swiper-disabled')
        clearInterval(intrBtnNext)
      }
    })
  }

  const getMutation = () => {
    const targetNode = document.querySelector('#arrow-collapsed')
    if (!targetNode) return

    const config = { attributes: true, attributeOldValue: true }

    const callback = function () {
      if (
        targetNode.classList.contains('show-menu') === true &&
        targetNode.classList.contains('ant-tooltip-open') === false
      ) {
        setCheckState(true)
      }

      if (
        targetNode.classList.contains('hide-menu') === true &&
        targetNode.classList.contains('ant-tooltip-open') === false
      ) {
        setCheckState(false)
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
  }

  useEffect(() => {
    if (refCard.current !== null && refSwiperItem.current !== null)
      checkWidthCard(refCard.current, refSwiperItem.current, 'init-first')
  }, [checkWidthCard])

  useEffect(() => {
    setTimeout(() => {
      if (
        checkState !== null &&
        checkState !== undefined &&
        refCard.current !== null &&
        refSwiperItem.current !== null
      )
        checkWidthCard(refCard.current, refSwiperItem.current, 'init-collapsed')
    }, 250)
  }, [checkState, checkWidthCard])

  useEffect(() => {
    if (!loading) {
      getMutation()
    }
  }, [loading])

  return (
    <section
      className="card w-full bg-white rounded-lg shadow-sm"
      aria-labelledby="ongoing-course-title"
      ref={refCard}
    >
      {/* Header */}
      <header className="leading-normal px-5 pt-5 pb-0 flex items-center justify-between">
        <h2
          id="ongoing-course-title"
          className="text-[22px] font-medium m-0 flex-1"
        >
          {t('feature.home.main_content.ongoing_course')}
        </h2>
        <nav
          className="flex gap-3"
          style={{ visibility: swiperOn ? 'visible' : 'hidden' }}
          aria-label="Course carousel navigation"
        >
          <button
            id="id-btn-prev-ongoingcourse"
            className="swiper-button btn-prev-ongoingcourse btn-swiper-disabled w-[30px] h-[30px] flex justify-center items-center z-5 cursor-pointer text-primary bg-secondary rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
            name="btn-swiper-prev-ongoing-course-home"
            aria-label="Previous courses"
          >
            <LeftOutlined aria-hidden="true" />
          </button>
          <button
            id="id-btn-next-ongoingcourse"
            className="swiper-button btn-next-ongoingcourse w-[30px] h-[30px] flex justify-center items-center z-5 cursor-pointer text-primary bg-secondary rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
            name="btn-swiper-next-ongoing-course-home"
            aria-label="Next courses"
          >
            <RightOutlined aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Content */}
      <div
        className="flex justify-start"
        style={{ margin: swiperOn ? '20px 0 20px 0' : '20px' }}
        role="region"
        aria-live="polite"
      >
        {loading ? (
          <Loader />
        ) : (
          <Swiper
            slidesPerView="auto"
            spaceBetween={20}
            freeMode={swiperOn}
            navigation={{
              nextEl: '.btn-next-ongoingcourse',
              prevEl: '.btn-prev-ongoingcourse',
            }}
            onSlideChange={() => onSwiperMove()}
            resistanceRatio={0}
            modules={swiperOn ? [FreeMode, Navigation] : false}
            onReachBeginning={() => handleReachBeginning()}
            onReachEnd={() => handleReachEnd()}
            slidesOffsetAfter={swiperOn ? 20 : false}
            slidesOffsetBefore={swiperOn ? 20 : false}
            aria-label="Ongoing courses carousel"
          >
            {onGoingCourse.map((item, index) => (
              <SwiperSlide style={swiperStyle} key={index} data-id={index}>
                <SwiperChildComp item={item} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}

OngoingCourse.propTypes = {
  onGoingCourseLoading: PropTypes.bool.isRequired,
  listCourseOngoing: PropTypes.array.isRequired,
  listJourneyOGC: PropTypes.array.isRequired,
  isEmptySetter: PropTypes.func.isRequired,
}

export default OngoingCourse
