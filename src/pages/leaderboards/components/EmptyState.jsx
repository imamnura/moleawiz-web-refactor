import { Image } from 'antd'
import PropTypes from 'prop-types'
import EmptyLeaderboards from '@assets/images/svgs/ic_empty_leaderboards.svg'
import { useTranslation } from 'react-i18next'

export function EmptyState() {
  const { t } = useTranslation()

  return (
    <section
      className="flex h-full w-full flex-col items-center justify-center"
      role="status"
      aria-label="Empty leaderboards state"
    >
      <div className="mb-6">
        <Image
          src={EmptyLeaderboards}
          preview={false}
          width={160}
          height={135}
          alt="Empty State Leaderboards"
        />
      </div>
      <p className="text-sm font-medium leading-normal text-gray-600">
        {t(
          'feature.feature_leaderboards.empty_state.leaderboard_not_available'
        )}
      </p>
    </section>
  )
}

EmptyState.propTypes = {}
