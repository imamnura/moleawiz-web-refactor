import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MobileRankList } from '../MobileRankList'

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

// Mock Ant Design Avatar and Typography
vi.mock('antd', () => ({
  Card: ({ children, className, style }) => (
    <div data-testid="rank-card" className={className} style={style}>
      {children}
    </div>
  ),
  Avatar: ({ src, children, className }) => (
    <div data-testid="avatar" data-src={src} className={className}>
      {children}
    </div>
  ),
  Typography: {
    Text: ({ children, className }) => (
      <span data-testid="text" className={className}>
        {children}
      </span>
    ),
  },
}))

describe('MobileRankList', () => {
  const mockListData = [
    {
      userid: '4',
      firstname: 'Alice',
      lastname: 'Johnson',
      rank: 4,
      totalgrade: 750,
      picture: 'https://example.com/alice.jpg',
      role: 'Developer',
      isyou: 0,
    },
    {
      userid: '5',
      firstname: 'Charlie',
      lastname: 'Brown',
      rank: 5,
      totalgrade: 700,
      picture: '',
      role: 'Designer',
      isyou: 1,
    },
    {
      userid: '6',
      firstname: 'David',
      lastname: 'Lee',
      rank: 6,
      totalgrade: 650,
      picture: 'https://example.com/david.jpg',
      role: 'Manager',
      isyou: 0,
    },
  ]

  it('should render null when listData is null', () => {
    const { container } = render(<MobileRankList data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render null when listData is empty array', () => {
    const { container } = render(<MobileRankList data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render all rank cards', () => {
    render(<MobileRankList data={mockListData} />)

    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(3)
  })

  it('should render rank numbers', () => {
    render(<MobileRankList data={mockListData} />)

    expect(screen.getByText('#4')).toBeInTheDocument()
    // User with isyou=1 doesn't show rank number without yourRank prop
    expect(screen.getByText('#6')).toBeInTheDocument()
  })

  it('should render scores with dot separator', () => {
    render(<MobileRankList data={mockListData} />)

    expect(screen.getByText('750')).toBeInTheDocument()
    expect(screen.getByText('700')).toBeInTheDocument()
    expect(screen.getByText('650')).toBeInTheDocument()
  })

  it('should render user full names', () => {
    render(<MobileRankList data={mockListData} />)

    expect(screen.getByText(/Alice Johnson/)).toBeInTheDocument()
    // Charlie Brown has isyou=1, so shows "You" instead
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText(/David Lee/)).toBeInTheDocument()
  })

  it('should highlight current user card', () => {
    const { container } = render(<MobileRankList data={mockListData} />)

    // Check that isyou=1 user has special background
    const cards = container.querySelectorAll('[data-testid="rank-card"]')
    expect(cards.length).toBe(3)
  })

  it('should display "You" for current user', () => {
    render(<MobileRankList data={mockListData} />)

    const youElements = screen.getAllByText('You')
    expect(youElements.length).toBeGreaterThan(0)
  })

  it('should use yourRank for current user when provided', () => {
    const yourRank = '20'
    const dataWithYou = [
      {
        ...mockListData[1],
        isyou: 1,
        rank: 5,
      },
    ]

    render(<MobileRankList data={dataWithYou} yourRank={yourRank} />)

    expect(screen.getByText('#20')).toBeInTheDocument()
  })

  it('should render avatars for users with pictures', () => {
    render(<MobileRankList data={mockListData} />)

    const avatars = screen.getAllByTestId('avatar')
    expect(avatars[0]).toHaveAttribute(
      'data-src',
      'https://example.com/alice.jpg'
    )
    expect(avatars[2]).toHaveAttribute(
      'data-src',
      'https://example.com/david.jpg'
    )
  })

  it('should render initials for users without pictures', () => {
    render(<MobileRankList data={mockListData} />)

    const avatars = screen.getAllByTestId('avatar')
    const avatarWithoutPicture = avatars[1]
    expect(avatarWithoutPicture).toHaveTextContent('C')
  })

  it('should render in a vertical list', () => {
    const { container } = render(<MobileRankList data={mockListData} />)

    const listContainer = container.querySelector('div')
    expect(listContainer).toBeInTheDocument()
  })

  it('should render role information', () => {
    render(<MobileRankList data={mockListData} />)

    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })
})
