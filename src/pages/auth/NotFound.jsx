import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import NotFoundImage from '@/assets/images/png/general/img_404_error_not_found.png'
import { colorTextNotFound } from '@/config/constant/color'

/**
 * NotFound Component
 * 404 error page with custom styling
 * 
 * @component
 * @example
 * <Route path="*" element={<NotFound />} />
 */
const NotFound = () => {
  const { t } = useTranslation()

  // Set dark background
  useEffect(() => {
    document.body.style.background = '#24304A'

    return () => {
      document.body.style.background = ''
    }
  }, [])

  return (
    <div className="page">
      <div className="container text-center">
        <img
          src={NotFoundImage}
          alt="404 Not Found"
          style={{
            width: '770px',
            height: '400px',
            maxWidth: '100%'
          }}
        />
        
        <p
          className="font-weight-bold"
          style={{
            fontSize: '28px',
            color: colorTextNotFound,
            marginBottom: '11px'
          }}
        >
          {t('error_page.lost')}
        </p>
        
        <p
          style={{
            color: '#FFFFFF',
            fontSize: '16px',
            lineHeight: 'normal',
            marginBottom: '0'
          }}
        >
          {t('error_page.it_looks')}
        </p>
        
        <p
          style={{
            color: '#FFFFFF',
            fontSize: '16px',
            lineHeight: 'normal',
            marginBottom: '20px'
          }}
        >
          {t('error_page.maybe')}
        </p>

        <Link
          to="/home"
          style={{
            color: colorTextNotFound,
            textDecoration: 'underline',
            fontSize: '16px'
          }}
        >
          {t('error_page.back_home') || 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}

NotFound.propTypes = {}

export default NotFound
