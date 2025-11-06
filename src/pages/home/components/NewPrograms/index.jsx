import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import { Loader } from '@/components/common/Loader'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { Col, Row, Card, Space, Button, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import useActions from './hooks/useActions'
import { formatCardDate } from '@utils/dateUtils'

import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'

/**
 * NewPrograms component
 * Displays horizontal scrollable list of new available programs
 *
 * @param {Object} props
 * @param {boolean} props.newProgramsLoading - Loading state
 * @param {Array} props.listJourneyDataNewPrograms - List of new programs
 * @param {Function} props.isEmptySetter - Callback to set empty state
 */
const NewPrograms = ({
  newProgramsLoading,
  listJourneyDataNewPrograms,
  isEmptySetter,
}) => {
  const { t, i18n } = useTranslation()
  const localeDate = i18n.language === 'en' ? 'en' : 'id'

  const [swiperOn, setSwiperOn] = useState(true)
  const [checkState, setCheckState] = useState()
  const { loading, newJourneys } = useActions(
    newProgramsLoading,
    listJourneyDataNewPrograms,
    isEmptySetter
  )
  const refCard = useRef(null)
  const refSwiperItem = useRef(null)

  const btnPrev = document.querySelector('#id-btn-prev-new-program')
  const btnNext = document.querySelector('#id-btn-next-newprogram')

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
      if (newJourneys.length * (b.offsetWidth + 20) < a.offsetWidth) {
        setSwiperOn(false)
      } else {
        if (status === 'init-collapsed')
          btnNext?.setAttribute('activestate', 'true')
        setSwiperOn(true)
      }
    },
    [newJourneys.length, btnNext]
  )

  const SwiperChildComp = ({ item, index }) => (
    <Row ref={refSwiperItem} className="flex justify-center flex-col w-full">
      <Space
        direction="vertical"
        className="space-newprogram"
        size="small"
        style={{ height: '221px' }}
      >
        <div className="flex flex-col">
          <div className="w-full h-[114px] rounded-lg">
            <Image
              preview={false}
              width={166}
              height={114}
              className="object-cover rounded-lg"
              src={item.thumbnail}
              fallback={defaultImage}
              alt="New Program"
            />
          </div>

          <div className="title-program h-full text-sm font-medium text-text-title text-left mt-2.5">
            <div className="break-dots-second-line overflow-hidden text-ellipsis">
              {item.name}
            </div>
          </div>

          <div className="created-at text-xs text-text-desc text-left mt-1">
            {t('feature.home.main_content.available')}{' '}
            {formatCardDate(item.enrollment_date, localeDate)}
          </div>
        </div>

        <div className="w-100">
          <Link
            to={`/my-learning-journey/journey/${item.id}`}
            data-index={index}
            name="btn-start-new-program-home"
          >
            <Button
              className="btn-primary"
              block
              style={{ height: '29px', fontSize: '12px' }}
            >
              {t('feature.home.main_content.start')}
            </Button>
          </Link>
        </div>
      </Space>
    </Row>
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
    <Card
      className="card w-full"
      bordered={false}
      bodyStyle={{ padding: 0 }}
      ref={refCard}
    >
      {/* Header */}
      <Row align="middle" className="leading-normal px-5 pt-5 pb-0">
        <Col span={18} className="flex text-left content-center items-center">
          <div className="text-[22px] font-medium">
            {t('feature.home.main_content.new_program')}
          </div>
        </Col>
        <Col span={6} style={{ visibility: swiperOn ? 'visible' : 'hidden' }}>
          <Row className="flex flex-row justify-end">
            <Space size="middle">
              <Col span={2}>
                <div
                  id="id-btn-prev-new-program"
                  className="swiper-button btn-prev-new-program btn-swiper-disabled w-[30px] h-[30px] flex justify-center items-center z-5 cursor-pointer text-primary bg-secondary rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                  name="btn-swiper-prev-new-program-home"
                >
                  <LeftOutlined />
                </div>
              </Col>
              <Col span={2}>
                <div
                  id="id-btn-next-newprogram"
                  className="swiper-button btn-next-newprogram w-[30px] h-[30px] flex justify-center items-center z-5 cursor-pointer text-primary bg-secondary rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                  name="btn-swiper-next-new-program-home"
                >
                  <RightOutlined />
                </div>
              </Col>
            </Space>
          </Row>
        </Col>
      </Row>

      {/* Content */}
      <Row
        justify="start"
        style={{ margin: swiperOn ? '20px 0 20px 0' : '20px' }}
      >
        <Col>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Swiper
                slidesPerView="auto"
                spaceBetween={20}
                freeMode={swiperOn}
                navigation={{
                  nextEl: '.btn-next-newprogram',
                  prevEl: '.btn-prev-new-program',
                }}
                onSlideChange={() => onSwiperMove()}
                resistanceRatio={0}
                modules={swiperOn ? [FreeMode, Navigation] : false}
                onReachBeginning={() => handleReachBeginning()}
                onReachEnd={() => handleReachEnd()}
                slidesOffsetAfter={swiperOn ? 20 : false}
                slidesOffsetBefore={swiperOn ? 20 : false}
              >
                {newJourneys.map((item, index) => (
                  <SwiperSlide style={swiperStyle} key={index} data-id={index}>
                    <SwiperChildComp item={item} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </Col>
      </Row>
    </Card>
  )
}

NewPrograms.propTypes = {
  newProgramsLoading: PropTypes.bool.isRequired,
  listJourneyDataNewPrograms: PropTypes.array.isRequired,
  isEmptySetter: PropTypes.func.isRequired,
}

export default NewPrograms
