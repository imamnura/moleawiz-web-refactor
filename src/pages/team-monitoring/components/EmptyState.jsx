import { Image } from 'antd'
import PropTypes from 'prop-types'
import img_emptystate_content_library from '../../../assets/images/svgs/img_emptystate_content_library.svg'

/**
 * Empty State Component
 * Displays when no data available
 */
export default function EmptyState({ message, isMobile }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Image
        preview={false}
        width={isMobile ? 140 : 240}
        src={img_emptystate_content_library}
        alt="No content"
        className="mb-6"
      />
      <p
        className="text-center font-medium text-[#67686D]"
        style={{ fontSize: isMobile ? 14 : 20 }}
      >
        {message}
      </p>
    </div>
  )
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
