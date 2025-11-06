// import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Dropdown, Badge } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { logout, selectCurrentUser } from '@store/slices/authSlice'
import { useGetNotificationsQuery } from '@services/api/homeApi'

import WebLogo from '@assets/images/svgs/ic_logo_general.svg'

export const Header = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const { data: notifications = [] } = useGetNotificationsQuery()
  // const [languageModalVisible, setLanguageModalVisible] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
  }

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    // setLanguageModalVisible(false)
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'change-password',
      icon: <UserOutlined />,
      label: t('header.change_password'),
      onClick: () => navigate('/auth/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      onClick: handleLogout,
      danger: true,
    },
  ]

  const languageMenuItems = [
    {
      key: 'en',
      label: 'English',
      onClick: () => handleChangeLanguage('en'),
    },
    {
      key: 'id',
      label: 'Bahasa Indonesia',
      onClick: () => handleChangeLanguage('id'),
    },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-divider shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center">
          <img src={WebLogo} alt="Logo" className="h-8" />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Points Display */}
          {user?.points !== undefined && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-soft rounded-lg">
              <span className="text-sm font-medium text-text-desc">
                {t('header.points')}:
              </span>
              <span className="text-base font-bold text-primary">
                {user.points}
              </span>
            </div>
          )}

          {/* Language Selector */}
          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-background-grey transition-colors">
              <GlobalOutlined className="text-xl text-text-title" />
            </button>
          </Dropdown>

          {/* Notifications */}
          <Dropdown
            menu={{ items: [] }}
            placement="bottomRight"
            trigger={['click']}
          >
            <button className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-background-grey transition-colors">
              <Badge count={unreadCount} size="small">
                <BellOutlined className="text-xl text-text-title" />
              </Badge>
            </button>
          </Dropdown>

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-grey transition-colors">
              <Avatar
                size={32}
                src={user?.picture}
                icon={<UserOutlined />}
                className="bg-primary"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-text-title">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-text-desc">
                  {user?.position || ''}
                </div>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {}

export default Header
