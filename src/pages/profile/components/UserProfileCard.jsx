import { useRef } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button } from 'antd'
import { CameraFilled, ExportOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import {
  formatProfileDate,
  getUserInitial,
  formatEmptyValue,
} from '../utils/formatters'

/**
 * User Profile Card Component
 * Displays user avatar, info, and export button
 */
export function UserProfileCard({
  user,
  profileDetail,
  onPictureChange,
  onExport,
  isExporting = false,
  isChangingPicture = false,
}) {
  const { t, i18n } = useTranslation()
  const fileInputRef = useRef(null)
  const locale = i18n.language === 'en' ? 'en' : 'id'

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && onPictureChange) {
      onPictureChange(selectedFile)
    }
  }

  const displayName = user?.userName || user?.firstname || '-'
  const position = formatEmptyValue(
    user?.userPosition || profileDetail?.position
  )
  const username = formatEmptyValue(
    user?.userUsername || profileDetail?.username
  )
  const registeredDate = formatProfileDate(
    user?.created_at || profileDetail?.created_at,
    locale
  )

  return (
    <div className="rounded-lg bg-white p-10 shadow-[3px_0_16px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + User Info */}
        <div className="flex items-center">
          {/* Avatar with Camera Button */}
          <div className="relative cursor-pointer" onClick={handleAvatarClick}>
            <Avatar
              size={78}
              src={user?.picture}
              className="border-none bg-blue-600 text-[32px] font-medium"
              loading={isChangingPicture ? 'lazy' : undefined}
            >
              {getUserInitial(user?.firstname)}
            </Avatar>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              id="id-upload-user-profile"
            />

            <Button
              className="absolute bottom-0 right-0 h-7! min-w-7! w-7! rounded-full border-none bg-gray-600 p-0! opacity-75 hover:opacity-100"
              icon={<CameraFilled className="text-[17px] text-white" />}
              id="btn-upload-user-profile"
              loading={isChangingPicture}
            />
          </div>

          {/* User Info */}
          <div className="ml-5">
            {/* Name */}
            <div className="mb-3 text-[22px] font-medium text-gray-800">
              {displayName}
            </div>

            {/* Role | Username | Registered Date */}
            <div className="flex items-center gap-5">
              {/* Role */}
              <div>
                <div className="text-sm text-gray-600">
                  {t('feature.feature_profile.header.role')}
                </div>
                <div className="mt-0.5 font-medium text-gray-800">
                  {position}
                </div>
              </div>

              <div className="h-10 w-px bg-gray-300" />

              {/* Username */}
              <div>
                <div className="text-sm text-gray-600">
                  {t('feature.feature_profile.header.username')}
                </div>
                <div className="mt-0.5 font-medium text-gray-800">
                  {username}
                </div>
              </div>

              <div className="h-10 w-px bg-gray-300" />

              {/* Registered On */}
              <div>
                <div className="text-sm text-gray-600">
                  {t('feature.feature_profile.header.registered_on')}
                </div>
                <div className="mt-0.5 font-medium text-gray-800">
                  {registeredDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Export Button */}
        <Button
          type="primary"
          className="btn-secondary h-[30px] w-[175px] rounded-md text-xs font-medium"
          icon={<ExportOutlined className="mr-1.5" />}
          onClick={onExport}
          loading={isExporting}
          id="btn-export-profile-user-profile"
        >
          {t('feature.feature_profile.header.export_profile')}
        </Button>
      </div>
    </div>
  )
}

UserProfileCard.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string,
    firstname: PropTypes.string,
    picture: PropTypes.string,
    userPosition: PropTypes.string,
    userUsername: PropTypes.string,
    created_at: PropTypes.string,
  }),
  profileDetail: PropTypes.shape({
    position: PropTypes.string,
    username: PropTypes.string,
    created_at: PropTypes.string,
  }),
  onPictureChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  isExporting: PropTypes.bool,
  isChangingPicture: PropTypes.bool,
}

UserProfileCard.defaultProps = {
  user: null,
  profileDetail: null,
  isExporting: false,
  isChangingPicture: false,
}
