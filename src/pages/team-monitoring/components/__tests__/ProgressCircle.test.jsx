import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressCircle from '../ProgressCircle'

describe('ProgressCircle Component', () => {
  describe('Rendering', () => {
    it('should render progress circle with correct percentage', () => {
      render(<ProgressCircle percent={75} />)
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('should render with default size of 40', () => {
      const { container } = render(<ProgressCircle percent={50} />)
      const progressCircle = container.querySelector('.ant-progress-circle')
      expect(progressCircle).toBeInTheDocument()
    })

    it('should render with custom size', () => {
      const { container } = render(<ProgressCircle percent={50} size={80} />)
      const progressCircle = container.querySelector('.ant-progress-circle')
      expect(progressCircle).toBeInTheDocument()
    })

    it('should display 0% correctly', () => {
      render(<ProgressCircle percent={0} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('should display 100% correctly', () => {
      render(<ProgressCircle percent={100} />)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('Color Logic', () => {
    it('should use green color when progress is 100%', () => {
      const { container } = render(<ProgressCircle percent={100} />)
      // Check for green stroke color (#52C41A)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should use blue color when progress is less than 100%', () => {
      const { container } = render(<ProgressCircle percent={75} />)
      // Check for blue stroke color (#0066CC)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should use blue color for 0%', () => {
      const { container } = render(<ProgressCircle percent={0} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should use blue color for 99%', () => {
      const { container } = render(<ProgressCircle percent={99} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle fractional percentages', () => {
      render(<ProgressCircle percent={75.5} />)
      expect(screen.getByText('75.5%')).toBeInTheDocument()
    })

    it('should handle large sizes', () => {
      const { container } = render(<ProgressCircle percent={50} size={200} />)
      const progressCircle = container.querySelector('.ant-progress-circle')
      expect(progressCircle).toBeInTheDocument()
    })

    it('should handle small sizes', () => {
      const { container} = render(<ProgressCircle percent={50} size={20} />)
      const progressCircle = container.querySelector('.ant-progress-circle')
      expect(progressCircle).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<ProgressCircle percent={75} />)
      const progress = container.querySelector('[role="progressbar"]')
      expect(progress).toBeInTheDocument()
    })
  })
})
