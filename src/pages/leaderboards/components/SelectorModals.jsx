import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, List, Input, Typography } from 'antd'
import { CloseOutlined, SearchOutlined, CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

export function ProgramSelectorModal({
  visible,
  onClose,
  onSelect,
  options,
  selected,
}) {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [programList, setProgramList] = useState([])

  useEffect(() => {
    if (options && options.length > 0) {
      const list = options.map((item) => item.label)
      setProgramList(list)
    }
  }, [options])

  useEffect(() => {
    if (visible) {
      setSearchText('')
    }
  }, [visible])

  const filteredList =
    programList.length > 0
      ? programList.filter((program) =>
          program.toLowerCase().includes(searchText.toLowerCase())
        )
      : []

  const handleSelect = (item) => {
    const selectedOption = options.find((opt) => opt.label === item)
    if (selectedOption) {
      onSelect(selectedOption.value)
    }
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
      width="90%"
      keyboard
      closable={true}
      style={{ borderRadius: '16px' }}
    >
      <h3 className="mb-0 px-6 pb-0 pt-6 text-left text-lg font-medium text-gray-800">
        {t('feature.feature_leaderboards.header.select_program')}
      </h3>

      <div className="px-6">
        <Input
          placeholder={t('feature.feature_leaderboards.header.search_program')}
          onChange={(e) => setSearchText(e.target.value)}
          className="input-search-program my-[18px] h-10 rounded-[20px] border border-gray-200 bg-white"
          prefix={<SearchOutlined className="text-sm text-gray-500" />}
          value={searchText}
        />
      </div>

      <List
        dataSource={filteredList}
        className="option-program max-h-[60vh] overflow-y-auto px-6 pb-6"
        renderItem={(item) => {
          const isSelected =
            selected && options.find((opt) => opt.value === selected)?.label === item
          return (
            <List.Item
              onClick={() => handleSelect(item)}
              className="flex cursor-pointer flex-nowrap bg-transparent hover:bg-gray-50"
            >
              <Text
                type={isSelected ? 'success' : undefined}
                className="max-w-full"
              >
                {item}
              </Text>
              {isSelected && (
                <CheckOutlined className="h-[11px] w-[15px] text-blue-600" />
              )}
            </List.Item>
          )
        }}
      />
    </Modal>
  )
}

ProgramSelectorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  selected: PropTypes.number,
}
export function OrganizationSelectorModal({
  visible,
  onClose,
  onSelect,
  options,
  selected,
}) {
  const { t } = useTranslation()
  const [orgList, setOrgList] = useState([])

  useEffect(() => {
    if (options && options.length > 0) {
      const list = options.map((item) => item.label)
      setOrgList(list)
    }
  }, [options])

  const handleSelect = (item) => {
    const selectedOption = options.find((opt) => opt.label === item)
    if (selectedOption) {
      onSelect(selectedOption.value)
    }
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
      width="90%"
      keyboard
      closable={true}
      style={{ borderRadius: '16px' }}
    >
      <h3 className="mb-0 px-6 pb-0 pt-6 text-left text-lg font-medium text-gray-800">
        {t('feature.feature_leaderboards.header.select_organization_level')}
      </h3>

      <List
        dataSource={orgList}
        className="option-company mt-4 max-h-[60vh] overflow-y-auto px-6 pb-6"
        renderItem={(item) => {
          const isSelected =
            selected && options.find((opt) => opt.value === selected)?.label === item
          return (
            <List.Item
              onClick={() => handleSelect(item)}
              className="flex cursor-pointer flex-nowrap bg-transparent hover:bg-gray-50"
            >
              <Text
                type={isSelected ? 'success' : undefined}
                className="max-w-full"
              >
                {item}
              </Text>
              {isSelected && (
                <CheckOutlined className="h-[11px] w-[15px] text-blue-600" />
              )}
            </List.Item>
          )
        }}
      />
    </Modal>
  )
}

OrganizationSelectorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  selected: PropTypes.string,
}
