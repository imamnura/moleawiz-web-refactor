import React, { useRef } from 'react'
import { Carousel } from 'antd'
import PropTypes from 'prop-types'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'

import Banner1 from '@/assets/images/png/home/img_banner1_home.png'

/**
 * Banner component for Home page
 * Displays single or multiple banner carousel
 *
 * @param {Object} props
 * @param {Object|null} props.isOneCol - Layout state for conditional rendering
 * @param {number} props.journeyLength - Number of journeys for banner logic
 * @param {boolean} props.isMobileVersion - Mobile view flag
 */
const Banner = ({ isOneCol, journeyLength, isMobileVersion }) => {
  const carouselRef = useRef()

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleNext = () => {
    carouselRef.current?.next()
  }

  const defaultBanner = [
    {
      key: 1,
      source: Banner1,
    },
  ]

  const multipleBanner = [
    {
      key: 1,
      source: Banner1,
    },
  ]

  // Use defaultBanner for new users (journeyLength === 1)
  const bannerData = journeyLength === 1 ? defaultBanner : multipleBanner
  const hasMultipleBanners = bannerData.length > 1

  return (
    <section className="p-0" aria-label="Welcome Banner">
      {isOneCol !== null && (
        <>
          {hasMultipleBanners ? (
            // Multiple banners with carousel
            <div
              className="relative"
              role="region"
              aria-label="Banner carousel"
            >
              {/* Previous Button - Hidden on mobile */}
              <button
                onClick={handlePrev}
                name="btn-swiper-prev-banner-home"
                className={`
                  ${isMobileVersion ? 'hidden' : 'flex'}
                  absolute top-[41%] left-[2%] z-5
                  w-[30px] h-[30px]
                  bg-primary hover:bg-primary-hover
                  text-white rounded-lg
                  shadow-md
                  items-center justify-center
                  cursor-pointer
                  transition-colors duration-200
                `}
                aria-label="Previous banner"
              >
                <LeftOutlined aria-hidden="true" />
              </button>

              {/* Carousel */}
              <Carousel
                autoplay
                autoplaySpeed={10000}
                dotPosition="bottom"
                ref={carouselRef}
                infinite
                className="h-40"
                aria-live="polite"
                aria-atomic="true"
              >
                {bannerData.map((item) => (
                  <div key={item.key}>
                    <div
                      className={`
                        relative
                        text-center text-white
                        grid grid-cols-1
                        ${isMobileVersion ? 'rounded-none' : 'rounded-[28px]'}
                      `}
                    >
                      <h2 className="invisible m-0 h-full text-black text-center leading-40 row-start-1 col-start-1">
                        Banner {item.key}
                      </h2>
                      <img
                        alt={`Welcome banner ${item.key}`}
                        src={item.source}
                        className="w-full h-full object-cover row-start-1 col-start-1"
                        role="img"
                      />
                    </div>
                  </div>
                ))}
              </Carousel>

              {/* Next Button - Hidden on mobile */}
              <button
                onClick={handleNext}
                name="btn-swiper-next-banner-home"
                className={`
                  ${isMobileVersion ? 'hidden' : 'flex'}
                  absolute top-[41%] right-[2%] z-5
                  w-[30px] h-[30px]
                  bg-primary hover:bg-primary-hover
                  text-white rounded-lg
                  shadow-md
                  items-center justify-center
                  cursor-pointer
                  transition-colors duration-200
                `}
                aria-label="Next banner"
              >
                <RightOutlined aria-hidden="true" />
              </button>
            </div>
          ) : (
            // Single banner
            <div
              className={`
                relative
                text-center text-white
                grid grid-cols-1
                ${isMobileVersion ? 'rounded-none' : 'rounded-lg'}
              `}
              role="img"
              aria-label="Welcome banner"
            >
              <h2 className="invisible m-0 h-full text-black text-center leading-40 row-start-1 col-start-1">
                Welcome Banner
              </h2>
              <img
                alt="Welcome to the learning platform"
                src={Banner1}
                className={`
                  w-full h-full object-cover 
                  row-start-1 col-start-1
                  ${isMobileVersion ? 'rounded-none' : 'rounded-lg'}
                `}
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}

Banner.propTypes = {
  isOneCol: PropTypes.object,
  journeyLength: PropTypes.number.isRequired,
  isMobileVersion: PropTypes.bool.isRequired,
}

Banner.defaultProps = {
  isOneCol: null,
}

export default Banner
