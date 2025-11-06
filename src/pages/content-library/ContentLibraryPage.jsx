/**
 * ContentLibraryPage - Main page for Content Library
 * Contains 2 tabs: Content Library (Academies) and Collection
 */
import { useState } from 'react'
import { Tabs, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@hooks/useIsMobile'
import { HomeTitle } from '@components/common/HomeTitle'
import { Loader } from '@components/common/Loader'
import { AcademyCard } from './components/AcademyCard'
import { CollectionCard } from './components/CollectionCard'
import { CollectionFilter } from './components/CollectionFilter'
import { EmptyState } from './components/EmptyState'
import { useAcademies } from './hooks/useAcademies'
import { useCollections } from './hooks/useCollections'
import { useDeleteCollection } from './hooks/useDeleteCollection'
import {
  getEmptyStateConfig,
  getContentLibraryEmptyText,
} from './utils/emptyStateUtils'

export const ContentLibraryPage = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('1')
  const [filter, setFilter] = useState('allcl')

  // Fetch academies
  const { academies, isLoading: isLoadingAcademies } = useAcademies()

  // Fetch collections
  const {
    collections,
    isLoading: isLoadingCollections,
    totalCount,
  } = useCollections(filter)

  // Delete collection
  const { deleteItem } = useDeleteCollection()

  const handleTabChange = (key) => {
    setActiveTab(key)
    if (key === '1') {
      setFilter('allcl')
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  // Render Content Library tab
  const renderAcademies = () => {
    if (isLoadingAcademies) {
      return <Loader />
    }

    if (academies.length === 0) {
      const emptyText = getContentLibraryEmptyText(t)
      return <EmptyState text={emptyText} showMessage={false} />
    }

    return (
      <section
        className={
          isMobile
            ? 'flex flex-col gap-3'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        }
        aria-label={t('feature.feature_cl.tab.content_library')}
      >
        {academies.map((academy) => (
          <AcademyCard key={academy.id} academy={academy} />
        ))}
      </section>
    )
  }

  // Render Collection tab
  const renderCollections = () => {
    if (isLoadingCollections) {
      return <Loader />
    }

    const showFilter = totalCount > 0
    const emptyConfig = getEmptyStateConfig(filter, t)

    return (
      <section
        className="relative"
        aria-label={t('feature.feature_cl.tab.collection')}
      >
        {showFilter && (
          <CollectionFilter
            value={filter}
            onChange={handleFilterChange}
            isMobile={isMobile}
          />
        )}

        {collections.length === 0 ? (
          <EmptyState
            text={emptyConfig.text}
            message={emptyConfig.message}
            showMessage={true}
          />
        ) : (
          <div
            className={
              isMobile
                ? 'flex flex-col gap-3'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-12'
            }
          >
            {collections.map((item) => (
              <CollectionCard
                key={`${item.type}-${item.id}`}
                item={item}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
      </section>
    )
  }

  const tabItems = [
    {
      key: '1',
      label: t('feature.feature_cl.tab.content_library'),
      children: renderAcademies(),
    },
    {
      key: '2',
      label: t('feature.feature_cl.tab.collection'),
      children: renderCollections(),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <HomeTitle>{t('feature.feature_cl.title')}</HomeTitle>

        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: '#1890ff',
                itemActiveColor: '#1890ff',
                itemHoverColor: '#40a9ff',
                itemSelectedColor: '#1890ff',
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            className="mt-6"
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
