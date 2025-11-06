import { List, Modal, Typography } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getMobileTopicOptions } from '../data/helpTopics.jsx'

const { Text } = Typography

/**
 * Mobile Topic Selection Modal
 * Displays list of help topics for mobile navigation
 */
const TopicSelectModal = ({
  visible,
  onClose,
  onSelect,
  selectedTopic,
  isMobile,
}) => {
  const { t } = useTranslation()

  const options = getMobileTopicOptions(t)

  const handleSelect = (item) => {
    onSelect(item)
    onClose()
  }

  const modalWidth = isMobile ? '90%' : '585px'

  return (
    <Modal
      open={visible}
      footer={null}
      closeIcon={
        <CloseOutlined className="text-text-title w-[13px] h-[13px]" />
      }
      onCancel={onClose}
      centered
      bodyStyle={{ maxHeight: '90vh', borderRadius: '16px' }}
      className="modal-select-program"
      maskClosable={false}
      transitionName="ant-fade"
      width={modalWidth}
      keyboard
      closable={true}
      style={{ borderRadius: '16px' }}
    >
      {/* Modal Title */}
      <h3 className="text-left text-lg font-medium text-text-title mb-0 p-6 pb-0">
        {t('feature.feature_help.side_dpd.select_topic')}
      </h3>

      {/* Topic List */}
      <List
        dataSource={options}
        className="option-company max-h-[60vh] overflow-y-auto mt-4 px-6 pb-6"
        renderItem={(item) => (
          <List.Item
            onClick={() => handleSelect(item)}
            className="cursor-pointer bg-transparent flex-nowrap"
          >
            <Text
              type={item === selectedTopic ? 'success' : undefined}
              className="max-w-[90%]"
            >
              {item}
            </Text>
            {item === selectedTopic && (
              <CheckOutlined className="text-primary w-[15px] h-[11px]" />
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
  onSelect: PropTypes.func.isRequired,
  selectedTopic: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
}

export default TopicSelectModal
