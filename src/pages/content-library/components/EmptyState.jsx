/**
 * EmptyState Component
 * Displays empty state message with icon
 */
import PropTypes from 'prop-types'
import { Empty } from 'antd'

export const EmptyState = ({ text, message, showMessage = true }) => {
  return (
    <section
      className="flex flex-col items-center justify-center py-12 px-4"
      role="status"
      aria-live="polite"
    >
      <Empty
        description={
          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-700 mb-2">{text}</p>
            {showMessage && message && (
              <p className="text-sm text-gray-500 text-center max-w-md">
                {message}
              </p>
            )}
          </div>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 120,
        }}
      />
    </section>
  )
}

EmptyState.propTypes = {
  text: PropTypes.string.isRequired,
  message: PropTypes.string,
  showMessage: PropTypes.bool,
}
