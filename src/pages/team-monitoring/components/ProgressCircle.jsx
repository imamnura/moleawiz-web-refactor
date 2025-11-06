import { Progress } from 'antd'
import PropTypes from 'prop-types'

/**
 * Progress Circle Component
 * Displays circular progress indicator
 */
export default function ProgressCircle({ percent, size = 40 }) {
  const strokeColor = percent >= 100 ? '#52C41A' : '#0066CC'

  return (
    <Progress
      type="circle"
      percent={percent}
      size={size}
      strokeColor={strokeColor}
      format={() => `${percent}%`}
      className="shrink-0"
    />
  )
}

ProgressCircle.propTypes = {
  percent: PropTypes.number.isRequired,
  size: PropTypes.number,
}
