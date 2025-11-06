import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-main">
      <Result
        status="404"
        title="404"
        subTitle={t('errors.page_not_found')}
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            {t('errors.back_home')}
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
