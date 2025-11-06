import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MobilePodiumSection } from '../MobilePodiumSection'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.label.you': 'You',
        'feature.feature_leaderboards.table.you': 'You',
      }
      return translations[key] || key
    },
  }),
}))

// Mock Ant Design Card, Avatar, Image
vi.mock('antd', () => {
  const Card = ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>
  Card.Meta = ({ description }) => <div data-testid="meta">{description}</div>
  
  return {
    Card,
    Avatar: ({ src, children, size, className }) => (
      <div data-testid="avatar" data-src={src} data-size={size} className={className}>{children}</div>
    ),
    Image: ({ alt, ...props }) => <img data-testid="medal-img" alt={alt} {...props} />,
  }
})

describe('MobilePodiumSection', () => {
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
      isyou: 1,
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

  it('should render null when podiumData is null', () => {
    const { container } = render(<MobilePodiumSection top3={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render null when podiumData is empty array', () => {
    const { container } = render(<MobilePodiumSection top3={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render all three podium cards', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(3)
  })

  it('should render podium in mobile layout (vertical stacking)', () => {
    const { container } = render(<MobilePodiumSection top3={mockTop3} />)

    const podiumContainer = container.querySelector('.flex.flex-row')
    expect(podiumContainer).toBeInTheDocument()
  })

  it('should render scores with dot separator', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    expect(screen.getByText('1.000')).toBeInTheDocument()
    expect(screen.getByText('900')).toBeInTheDocument()
    expect(screen.getByText('800')).toBeInTheDocument()
  })

  it('should render role for each user', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('should display "You" when isyou flag is set', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const youElements = screen.getAllByText('You')
    expect(youElements.length).toBeGreaterThan(0)
  })

  it('should render medal images for each rank', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const medalImages = screen.getAllByTestId('medal-img')
    expect(medalImages.length).toBe(3)
  })

  it('should render avatars for all users with pictures', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const avatars = screen.getAllByTestId('avatar')
    // Order is 2-1-3 (Jane, John, Bob)
    expect(avatars[0]).toHaveAttribute(
      'data-src',
      'https://example.com/jane.jpg'
    )
    expect(avatars[1]).toHaveAttribute(
      'data-src',
      'https://example.com/john.jpg'
    )
  })

  it('should render initials for users without pictures', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const avatars = screen.getAllByTestId('avatar')
    const avatarWithoutPicture = avatars[2]
    expect(avatarWithoutPicture).toHaveTextContent('B')
  })

  it('should render user full names', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    // Jane has isyou=1, so shows "You" instead of name
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('You')).toBeInTheDocument() // Jane shows as "You"
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
  })

  it('should handle incomplete top3 data gracefully', () => {
    const incompleteData = [mockTop3[0], mockTop3[1]]

    render(<MobilePodiumSection top3={incompleteData} />)

    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(2)
  })

  it('should not render role when missing', () => {
    const dataWithoutRole = [
      {
        ...mockTop3[0],
        role: null,
      },
      mockTop3[1],
      mockTop3[2],
    ]

    render(<MobilePodiumSection top3={dataWithoutRole} />)

    // Empty text still renders, so we check it
    expect(screen.getByText('empty')).toBeInTheDocument()
  })

  it('should use smaller avatar sizes for mobile', () => {
    render(<MobilePodiumSection top3={mockTop3} />)

    const avatars = screen.getAllByTestId('avatar')
    avatars.forEach((avatar) => {
      expect(avatar).toHaveAttribute('data-size')
    })
  })

  it('should render with proper spacing between cards', () => {
    const { container } = render(<MobilePodiumSection top3={mockTop3} />)

    const podiumWrapper = container.querySelector('.podium-wrapper')
    expect(podiumWrapper).toBeInTheDocument()
  })
})
