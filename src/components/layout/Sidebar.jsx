import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  HomeOutlined,
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'

export const Sidebar = ({ collapsed, onToggle }) => {
  const { t } = useTranslation()
  const location = useLocation()

  const menuItems = [
    {
      key: 'home',
      path: '/home',
      icon: <HomeOutlined />,
      label: t('sidebar.home'),
    },
    {
      key: 'learning-journey',
      path: '/my-learning-journey',
      icon: <BookOutlined />,
      label: t('sidebar.my_learning_journey'),
    },
    {
      key: 'content-library',
      path: '/content-library',
      icon: <BookOutlined />,
      label: t('sidebar.content_library'),
    },
    {
      key: 'leaderboard',
      path: '/leaderboard',
      icon: <TrophyOutlined />,
      label: t('sidebar.leaderboard'),
    },
    {
      key: 'events',
      path: '/events',
      icon: <CalendarOutlined />,
      label: t('sidebar.events'),
    },
    {
      key: 'team-monitoring',
      path: '/team-monitoring',
      icon: <TeamOutlined />,
      label: t('sidebar.team_monitoring'),
    },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <aside
      className={`
        ${collapsed ? 'w-20' : 'w-64'}
        bg-white border-r border-border-divider
        transition-all duration-300
        flex flex-col
        h-screen sticky top-0
      `}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end h-16 px-4 border-b border-border-divider">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-background-grey transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="text-xl text-text-title" />
          ) : (
            <MenuFoldOutlined className="text-xl text-text-title" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.path)

            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3
                    ${collapsed ? 'justify-center px-2' : 'px-4'}
                    py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-text-menu hover:bg-background-grey'
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border-divider">
          <div className="text-xs text-text-desc text-center">
            © 2025 Moleawiz
          </div>
        </div>
      )}
    </aside>
  )
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default Sidebar
