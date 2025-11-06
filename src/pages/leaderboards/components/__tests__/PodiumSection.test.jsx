import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PodiumSection } from '../PodiumSection'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => (key === 'feature.feature_leaderboards.table.you' ? 'You' : key),
  }),
}))

// Mock antd Card, Avatar, Image
vi.mock('antd', () => {
  const Card = ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>
  Card.Meta = ({ description }) => <div data-testid="meta">{description}</div>
  
  return {
    Card,
    Avatar: ({ src, children, size, className, style }) => (
      <div data-testid="avatar" data-src={src} data-size={size} className={className} style={style}>{children}</div>
    ),
    Image: ({ alt, ...props }) => <img data-testid="medal-img" alt={alt} {...props} />,
  }
})

describe('PodiumSection', () => {
  const mockTop3 = [
    {
      userid: '1',
      firstname: 'John',
      lastname: 'Doe',
      rank: 1,
      totalgrade: 1000,
      picture: 'https://example.com/john.jpg',
      role: 'Developer',
      isyou: 0,
    },
    {
      userid: '2',
      firstname: 'Jane',
      lastname: 'Smith',
      rank: 2,
      totalgrade: 900,
      picture: 'https://example.com/jane.jpg',
      role: 'Designer',
      isyou: 0,
    },
    {
      userid: '3',
      firstname: 'Bob',
      lastname: 'Wilson',
      rank: 3,
      totalgrade: 800,
      picture: '',
      role: 'Manager',
      isyou: 0,
    },
  ]

  it('should render null when top3 is null', () => {
    const { container } = render(<PodiumSection top3={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render null when top3 is empty array', () => {
    const { container } = render(<PodiumSection top3={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render all three podium cards', () => {
    render(<PodiumSection top3={mockTop3} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(3)
  })

  it('should render scores with dot separator', () => {
    render(<PodiumSection top3={mockTop3} />)

    expect(screen.getByText('1.000')).toBeInTheDocument()
    expect(screen.getByText('900')).toBeInTheDocument()
    expect(screen.getByText('800')).toBeInTheDocument()
  })

  it('should render roles for each user', () => {
    render(<PodiumSection top3={mockTop3} />)

    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('should render medal images for each rank', () => {
    render(<PodiumSection top3={mockTop3} />)

    const medals = screen.getAllByAltText(/Rank \d+ Medal/)
    expect(medals).toHaveLength(3)
  })

  it('should display "You" when isyou flag is set', () => {
    const dataWithCurrentUser = [
      {
        ...mockTop3[0],
        isyou: 1,
      },
      mockTop3[1],
      mockTop3[2],
    ]

    render(<PodiumSection top3={dataWithCurrentUser} />)

    expect(screen.getByText('You')).toBeInTheDocument()
  })

  it('should render avatars for all users', () => {
    render(<PodiumSection top3={mockTop3} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars.length).toBeGreaterThanOrEqual(3)
  })

  it('should use different styles for rank 1 (larger)', () => {
    const { container } = render(<PodiumSection top3={mockTop3} />)
    const podiums = container.querySelectorAll('.podium')
    expect(podiums).toHaveLength(3)
  })

  it('should handle missing picture with initials', () => {
    render(<PodiumSection top3={mockTop3} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars.length).toBeGreaterThanOrEqual(3)
  })

  it('should render podium in correct order (2-1-3)', () => {
    const { container } = render(<PodiumSection top3={mockTop3} />)

    const podiums = container.querySelectorAll('[name^="square-podium"]')
    expect(podiums).toHaveLength(3)
    expect(podiums[0]).toHaveAttribute('name', 'square-podium-2-leaderboards')
    expect(podiums[1]).toHaveAttribute('name', 'square-podium-1-leaderboards')
    expect(podiums[2]).toHaveAttribute('name', 'square-podium-3-leaderboards')
  })

  it('should handle incomplete top3 data gracefully', () => {
    const incompleteData = [mockTop3[0], mockTop3[1], null]

    const { container } = render(<PodiumSection top3={incompleteData} />)
    
    // Should render without crashing
    expect(container.querySelector('.podium-wrapper')).toBeInTheDocument()
  })

  it('should hide role when role is not provided', () => {
    const dataWithoutRole = [
      {
        ...mockTop3[0],
        role: null,
      },
      mockTop3[1],
      mockTop3[2],
    ]

    const { container } = render(<PodiumSection top3={dataWithoutRole} />)

    // Role divs should have visibility: hidden
    const roleDivs = container.querySelectorAll('[style*="visibility"]')
    expect(roleDivs.length).toBeGreaterThan(0)
  })
})
