import { describe, it, expect } from 'vitest'
import { processLeaderboardsData } from '../dataProcessing'

describe('processLeaderboardsData', () => {
  it('should return empty sections when no data', () => {
    const result = processLeaderboardsData(null, 1, { filtOrg: 'company' }, {})

    expect(result).toEqual({
      top3: [],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    })
  })

  it('should return empty sections when boards is missing', () => {
    const data = { current: [] }
    const result = processLeaderboardsData(
      data,
      1,
      { filtOrg: 'company' },
      {}
    )

    expect(result).toEqual({
      top3: [],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    })
  })

  it('should split data into top3, columnLeft, columnRight', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          totalgrade: 90,
        },
        {
          rank: '3',
          userid: '3',
          firstname: 'User',
          lastname: 'Three',
          totalgrade: 80,
        },
        {
          rank: '4',
          userid: '4',
          firstname: 'User',
          lastname: 'Four',
          totalgrade: 70,
        },
        {
          rank: '10',
          userid: '10',
          firstname: 'User',
          lastname: 'Ten',
          totalgrade: 50,
        },
      ],
      current: [],
    }

    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'company' },
      {}
    )

    expect(result.top3.length).toBe(3)
    expect(result.columnLeft.length).toBe(2) // rank 4 and 10
    expect(result.columnRight.length).toBe(0)
  })

  it('should mark current user with isyou flag', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '5',
          firstname: 'Current',
          lastname: 'User',
          totalgrade: 90,
        },
      ],
      current: [],
    }

    const result = processLeaderboardsData(
      data,
      5,
      { filtOrg: 'company' },
      {}
    )

    const currentUser = result.top3.find((u) => u.userid === '5')
    expect(currentUser.isyou).toBe(1)
    expect(result.yourRank).toBe(2) // Numeric rank from array index + 1
  })

  it('should filter by directorate organization level', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          directorate: 'IT',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          directorate: 'HR',
          totalgrade: 90,
        },
      ],
      current: [],
    }

    const profileData = { directorate: 'IT' }
    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'directorate' },
      profileData
    )

    expect(result.top3.length).toBe(1)
    expect(result.top3[0].directorate).toBe('IT')
  })

  it('should filter by division organization level', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          division: 'Engineering',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          division: 'Sales',
          totalgrade: 90,
        },
      ],
      current: [],
    }

    const profileData = { division: 'Engineering' }
    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'division' },
      profileData
    )

    expect(result.top3.length).toBe(1)
    expect(result.top3[0].division).toBe('Engineering')
  })

  it('should re-rank after filtering', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          division: 'Sales',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          division: 'Engineering',
          totalgrade: 90,
        },
        {
          rank: '3',
          userid: '3',
          firstname: 'User',
          lastname: 'Three',
          division: 'Engineering',
          totalgrade: 80,
        },
      ],
      current: [],
    }

    const profileData = { division: 'Engineering' }
    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'division' },
      profileData
    )

    expect(result.top3.length).toBe(2)
    expect(result.top3[0].rank).toBe(1) // Re-ranked from 2
    expect(result.top3[1].rank).toBe(2) // Re-ranked from 3
  })

  it('should handle user in current array when not in top 15', () => {
    const data = {
      boards: Array.from({ length: 15 }, (_, i) => ({
        rank: `${i + 1}`,
        userid: `${i + 1}`,
        firstname: 'User',
        lastname: `${i + 1}`,
        totalgrade: 100 - i,
      })),
      current: [
        {
          rank: '20',
          userid: '99',
          firstname: 'Current',
          lastname: 'User',
          totalgrade: 50,
        },
      ],
    }

    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'company' },
      {}
    )

    expect(result.yourRank).toBe('20')
    // User should be in rank 15 position
    const currentUser = [...result.columnLeft, ...result.columnRight].find(
      (u) => u.userid === '99'
    )
    expect(currentUser).toBeDefined()
    expect(currentUser.rank).toBe(15)
  })

  it('should sort boards by rank', () => {
    const data = {
      boards: [
        {
          rank: '3',
          userid: '3',
          firstname: 'User',
          lastname: 'Three',
          totalgrade: 80,
        },
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          totalgrade: 90,
        },
      ],
      current: [],
    }

    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'company' },
      {}
    )

    expect(result.top3[0].rank).toBe(1)
    expect(result.top3[1].rank).toBe(2)
    expect(result.top3[2].rank).toBe(3)
  })

  it('should handle case-insensitive organization filtering', () => {
    const data = {
      boards: [
        {
          rank: '1',
          userid: '1',
          firstname: 'User',
          lastname: 'One',
          division: 'Engineering',
          totalgrade: 100,
        },
        {
          rank: '2',
          userid: '2',
          firstname: 'User',
          lastname: 'Two',
          division: 'ENGINEERING',
          totalgrade: 90,
        },
      ],
      current: [],
    }

    const profileData = { division: 'engineering' }
    const result = processLeaderboardsData(
      data,
      99,
      { filtOrg: 'division' },
      profileData
    )

    expect(result.top3.length).toBe(2)
  })
})
