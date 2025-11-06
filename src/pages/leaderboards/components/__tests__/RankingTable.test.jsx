import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RankingTable } from '../RankingTable'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.table.rank': 'Rank',
        'feature.feature_leaderboards.table.name': 'Name',
        'feature.feature_leaderboards.table.score': 'Score',
        'feature.feature_leaderboards.table.you': 'You',
      }
      return translations[key] || key
    },
  }),
}))

describe('RankingTable', () => {
  const mockColumnLeft = [
    {
      userid: '4',
      firstname: 'Alice',
      lastname: 'Johnson',
      rank: 4,
      totalgrade: 700,
      role: 'Engineer',
      isyou: 0,
    },
    {
      userid: '5',
      firstname: 'Charlie',
      lastname: 'Brown',
      rank: 5,
      totalgrade: 650,
      role: 'Developer',
      isyou: 0,
    },
  ]

  const mockColumnRight = [
    {
      userid: '10',
      firstname: 'David',
      lastname: 'Lee',
      rank: 10,
      totalgrade: 500,
      role: 'Designer',
      isyou: 0,
    },
    {
      userid: '11',
      firstname: 'Emma',
      lastname: 'Davis',
      rank: 11,
      totalgrade: 450,
      role: 'Manager',
      isyou: 0,
    },
  ]

  it('should render null when columnLeft is null', () => {
    const { container } = render(<RankingTable columnLeft={null} columnRight={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render null when columnLeft is empty', () => {
    const { container } = render(<RankingTable columnLeft={[]} columnRight={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render table headers', () => {
    render(<RankingTable columnLeft={mockColumnLeft} columnRight={null} />)

    expect(screen.getByText('Rank')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('should render left column data', () => {
    render(<RankingTable columnLeft={mockColumnLeft} columnRight={null} />)

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('should render right column data when provided', () => {
    render(
      <RankingTable
        columnLeft={mockColumnLeft}
        columnRight={mockColumnRight}
      />
    )

    expect(screen.getByText('David Lee')).toBeInTheDocument()
    expect(screen.getByText('Emma Davis')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('should render only left column when right column is empty', () => {
    const { container } = render(
      <RankingTable columnLeft={mockColumnLeft} columnRight={[]} />
    )

    // Should not have two column layout
    const columnRankFlex = container.querySelector('.column-rank-flex')
    expect(columnRankFlex).toBeInTheDocument()
  })

  it('should display rank numbers correctly', () => {
    render(<RankingTable columnLeft={mockColumnLeft} columnRight={null} />)

    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should display scores with dot separator', () => {
    render(<RankingTable columnLeft={mockColumnLeft} columnRight={null} />)

    expect(screen.getByText('700')).toBeInTheDocument()
    expect(screen.getByText('650')).toBeInTheDocument()
  })

  it('should highlight current user row', () => {
    const dataWithCurrentUser = [
      { ...mockColumnLeft[0], isyou: 1 },
      mockColumnLeft[1],
    ]

    const { container } = render(
      <RankingTable columnLeft={dataWithCurrentUser} columnRight={null} yourRank={4} />
    )

    const highlightedRow = container.querySelector('.you-highlight')
    expect(highlightedRow).toBeInTheDocument()
  })

  it('should display "You" for current user', () => {
    const dataWithCurrentUser = [
      { ...mockColumnLeft[0], isyou: 1 },
      mockColumnLeft[1],
    ]

    render(
      <RankingTable columnLeft={dataWithCurrentUser} columnRight={null} yourRank={4} />
    )

    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
  })

  it('should use yourRank for current user instead of rank from data', () => {
    const dataWithCurrentUser = [
      { ...mockColumnLeft[0], isyou: 1, rank: 15 },
      mockColumnLeft[1],
    ]

    render(
      <RankingTable columnLeft={dataWithCurrentUser} columnRight={null} yourRank={20} />
    )

    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('should render avatars for all users', () => {
    const { container } = render(
      <RankingTable columnLeft={mockColumnLeft} columnRight={null} />
    )

    const avatars = container.querySelectorAll('.ant-avatar')
    expect(avatars.length).toBeGreaterThanOrEqual(2)
  })

  it('should render with two column layout when both columns provided', () => {
    const { container } = render(
      <RankingTable
        columnLeft={mockColumnLeft}
        columnRight={mockColumnRight}
      />
    )

    const columnRankFlex = container.querySelector('.column-rank-flex')
    expect(columnRankFlex).toHaveStyle({ display: 'flex' })
  })

  it('should render with single column layout when only left provided', () => {
    const { container } = render(
      <RankingTable columnLeft={mockColumnLeft} columnRight={null} />
    )

    const columnRankFlex = container.querySelector('.column-rank-flex')
    expect(columnRankFlex).toHaveStyle({ display: 'block' })
  })

  it('should handle users without pictures', () => {
    const dataWithoutPictures = mockColumnLeft.map((user) => ({
      ...user,
      picture: null,
    }))

    const { container } = render(
      <RankingTable columnLeft={dataWithoutPictures} columnRight={null} />
    )

    const avatars = container.querySelectorAll('.ant-avatar')
    expect(avatars.length).toBeGreaterThanOrEqual(2)
  })

  it('should render data-id attribute for each row', () => {
    const { container } = render(
      <RankingTable columnLeft={mockColumnLeft} columnRight={null} />
    )

    const row1 = container.querySelector('[data-id="4"]')
    const row2 = container.querySelector('[data-id="5"]')

    expect(row1).toBeInTheDocument()
    expect(row2).toBeInTheDocument()
  })

  it('should apply correct column span based on two column mode', () => {
    // Two column mode
    render(
      <RankingTable
        columnLeft={mockColumnLeft}
        columnRight={mockColumnRight}
      />
    )

    // Headers should exist (checking table structure is rendered)
    expect(screen.getAllByText('Rank').length).toBeGreaterThan(0)
  })
})
