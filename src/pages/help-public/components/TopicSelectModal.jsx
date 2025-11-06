import { Modal, List, Typography } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { helpPublicTopics } from '../data/helpPublicTopics'

const { Text } = Typography

export function TopicSelectModal({
  visible,
  onClose,
  isMobile,
  isScaling,
  currentTopic,
}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const getTopicLabel = (topic) => {
    if (topic.key === 'login') {
      return i18n.language === 'en' ? 'Login' : <i>Login</i>
    }
    return topic.label
  }

  const options = helpPublicTopics.map((topic) => ({
    key: topic.key,
    path: topic.path,
    label: getTopicLabel(topic),
  }))

  const handleSelect = (option) => {
    navigate(option.path, { replace: true })
    onClose()
  }

  return (
    <Modal
      open={visible}
      footer={null}
      closeIcon={<CloseOutlined className="h-[13px] w-[13px] text-gray-700" />}
      onCancel={onClose}
      centered
      bodyStyle={{ maxHeight: '90vh', borderRadius: '16px' }}
      className="modal-select-program"
      maskClosable={false}
      transitionName="ant-fade"
      width={isMobile ? '90%' : isScaling ? `${585 * 0.9}px` : '90%'}
      keyboard
      closable={true}
      style={{ borderRadius: '16px' }}
    >
      <h3 className="mb-0 px-6 pb-0 pt-6 text-left text-lg font-medium text-gray-800">
        {t('feature.feature_help.side_dpd.select_topic')}
      </h3>
      <List
        dataSource={options}
        className="option-company mt-4 max-h-[60vh] overflow-y-auto px-6 pb-6"
        renderItem={(item) => (
          <List.Item
            onClick={() => handleSelect(item)}
            className="flex cursor-pointer flex-nowrap bg-transparent hover:bg-gray-50"
          >
            <Text
              type={item.label === currentTopic ? 'success' : undefined}
              className="max-w-[90%]"
            >
              {item.label}
            </Text>
            {item.label === currentTopic && (
              <CheckOutlined className="h-[11px] w-[15px] text-blue-600" />
            )}
          </List.Item>
        )}
      />
    </Modal>
  )
}

TopicSelectModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isScaling: PropTypes.bool.isRequired,
  currentTopic: PropTypes.string.isRequired,
}
