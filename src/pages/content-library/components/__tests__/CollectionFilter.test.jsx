/**
 * CollectionFilter Component Tests
 * Unit tests for CollectionFilter component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollectionFilter } from '../CollectionFilter'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_cl.filter.all': 'All',
        'feature.feature_cl.filter.program': 'Programs',
        'feature.feature_cl.filter.course': 'Courses',
        'feature.feature_cl.filter.module': 'Modules',
      }
      return translations[key] || key
    },
  }),
}))

describe('CollectionFilter', () => {
  const defaultProps = {
    value: 'allcl',
    onChange: vi.fn(),
    isMobile: false,
  }

  it('should render all filter options', () => {
    render(<CollectionFilter {...defaultProps} />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Programs')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Modules')).toBeInTheDocument()
  })

  it('should call onChange when filter option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<CollectionFilter {...defaultProps} onChange={onChange} />)

    const programButton = screen.getByText('Programs')
    await user.click(programButton)

    expect(onChange).toHaveBeenCalledWith('programcl')
  })

  it('should highlight selected filter', () => {
    render(<CollectionFilter {...defaultProps} value="coursecl" />)

    const courseButton = screen.getByText('Courses').closest('label')
    expect(courseButton).toHaveClass('ant-radio-button-wrapper-checked')
  })

  it('should render in mobile layout when isMobile is true', () => {
    const { container } = render(
      <CollectionFilter {...defaultProps} isMobile={true} />
    )

    const wrapper = container.querySelector('.overflow-x-auto')
    expect(wrapper).toBeInTheDocument()
  })

  it('should render in desktop layout when isMobile is false', () => {
    const { container } = render(
      <CollectionFilter {...defaultProps} isMobile={false} />
    )

    const wrapper = container.querySelector('.absolute')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('top-0', 'right-0')
  })

  it('should allow changing between different filters', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<CollectionFilter {...defaultProps} onChange={onChange} />)

    await user.click(screen.getByText('Courses'))
    expect(onChange).toHaveBeenCalledWith('coursecl')

    await user.click(screen.getByText('Modules'))
    expect(onChange).toHaveBeenCalledWith('modulecl')
  })
})
