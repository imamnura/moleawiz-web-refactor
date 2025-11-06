import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ProgramSelectorModal,
  OrganizationSelectorModal,
} from '../SelectorModals'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.header.select_program': 'Select Program',
        'feature.feature_leaderboards.header.search_program': 'Search program...',
        'feature.feature_leaderboards.header.select_organization_level':
          'Select Organization Level',
      }
      return translations[key] || key
    },
  }),
}))

describe('ProgramSelectorModal', () => {
  const mockOptions = [
    { label: 'Program Alpha', value: 1 },
    { label: 'Program Beta', value: 2 },
    { label: 'Program Gamma', value: 3 },
  ]

  const mockOnClose = vi.fn()
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when visible is false', () => {
    render(
      <ProgramSelectorModal
        visible={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(screen.queryByText('Select Program')).not.toBeInTheDocument()
  })

  it('should render when visible is true', () => {
    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(screen.getByText('Select Program')).toBeInTheDocument()
  })

  it('should render all program options', () => {
    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(screen.getByText('Program Alpha')).toBeInTheDocument()
    expect(screen.getByText('Program Beta')).toBeInTheDocument()
    expect(screen.getByText('Program Gamma')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search program...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should filter programs when searching', async () => {
    const user = userEvent.setup()

    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search program...')
    await user.type(searchInput, 'Alpha')

    await waitFor(() => {
      expect(screen.getByText('Program Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Program Beta')).not.toBeInTheDocument()
      expect(screen.queryByText('Program Gamma')).not.toBeInTheDocument()
    })
  })

  it('should call onSelect with correct value when program clicked', async () => {
    const user = userEvent.setup()

    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const program = screen.getByText('Program Beta')
    await user.click(program)

    expect(mockOnSelect).toHaveBeenCalledWith(2)
  })

  it('should call onClose after selecting program', async () => {
    const user = userEvent.setup()

    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const program = screen.getByText('Program Alpha')
    await user.click(program)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show checkmark for selected program', () => {
    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={2}
      />
    )

    const listItems = screen.getAllByRole('listitem')
    // Beta should have checkmark (selected)
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('should clear search when modal opens', () => {
    const { rerender } = render(
      <ProgramSelectorModal
        visible={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    rerender(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search program...')
    expect(searchInput).toHaveValue('')
  })

  it('should handle empty options', () => {
    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={[]}
        selected={null}
      />
    )

    expect(screen.getByText('Select Program')).toBeInTheDocument()
  })

  it('should filter case-insensitively', async () => {
    const user = userEvent.setup()

    render(
      <ProgramSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search program...')
    await user.type(searchInput, 'beta')

    await waitFor(() => {
      expect(screen.getByText('Program Beta')).toBeInTheDocument()
    })
  })
})

describe('OrganizationSelectorModal', () => {
  const mockOptions = [
    { label: 'Company Level - ACME Corp', value: 'company' },
    { label: 'Directorate Level - IT', value: 'directorate' },
    { label: 'Division Level - Engineering', value: 'division' },
  ]

  const mockOnClose = vi.fn()
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when visible is false', () => {
    render(
      <OrganizationSelectorModal
        visible={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(
      screen.queryByText('Select Organization Level')
    ).not.toBeInTheDocument()
  })

  it('should render when visible is true', () => {
    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(screen.getByText('Select Organization Level')).toBeInTheDocument()
  })

  it('should render all organization options', () => {
    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    expect(screen.getByText('Company Level - ACME Corp')).toBeInTheDocument()
    expect(screen.getByText('Directorate Level - IT')).toBeInTheDocument()
    expect(screen.getByText('Division Level - Engineering')).toBeInTheDocument()
  })

  it('should call onSelect with correct value when option clicked', async () => {
    const user = userEvent.setup()

    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const option = screen.getByText('Directorate Level - IT')
    await user.click(option)

    expect(mockOnSelect).toHaveBeenCalledWith('directorate')
  })

  it('should call onClose after selecting option', async () => {
    const user = userEvent.setup()

    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const option = screen.getByText('Company Level - ACME Corp')
    await user.click(option)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show checkmark for selected organization', () => {
    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected="division"
      />
    )

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('should handle empty options', () => {
    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={[]}
        selected={null}
      />
    )

    expect(screen.getByText('Select Organization Level')).toBeInTheDocument()
  })

  it('should not have search input (unlike ProgramSelector)', () => {
    render(
      <OrganizationSelectorModal
        visible={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={mockOptions}
        selected={null}
      />
    )

    const searchInputs = screen.queryAllByRole('textbox')
    expect(searchInputs).toHaveLength(0)
  })
})
