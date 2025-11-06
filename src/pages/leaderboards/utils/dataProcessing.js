/**
 * Process leaderboards data and split into sections
 * @param {Object} data - Raw leaderboards data from API
 * @param {number} userId - Current user ID
 * @param {Object} filters - Organization filters
 * @param {Object} profileData - User profile data
 * @returns {Object} Processed leaderboards data
 */
export function processLeaderboardsData(data, userId, filters, profileData) {
  if (!data || !data.boards) {
    return {
      top3: [],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    }
  }

  // Clone and sort data
  const sortedBoards = [...data.boards].sort(
    (a, b) => parseInt(a.rank) - parseInt(b.rank)
  )

  // Apply organization filter
  const filteredData = applyOrgFilter(
    sortedBoards,
    data.current,
    filters.filtOrg,
    profileData
  )

  // Find user's rank and mark as "you"
  const processedData = markUserRank(
    filteredData.boards,
    filteredData.current,
    userId
  )

  // Split into sections
  return splitDataIntoSections(processedData.boards, processedData.yourRank)
}

/**
 * Apply organization level filter
 */
function applyOrgFilter(boards, current, filterType, profileData) {
  let filteredBoards = boards
  let filteredCurrent = current

  switch (filterType) {
    case 'directorate':
      filteredBoards = boards.filter(
        (item) =>
          item.directorate?.toLowerCase() ===
          profileData.directorate?.toLowerCase()
      )
      filteredCurrent = current.filter(
        (item) =>
          item.directorate?.toLowerCase() ===
          profileData.directorate?.toLowerCase()
      )
      break

    case 'division':
      filteredBoards = boards.filter(
        (item) =>
          item.division?.toLowerCase() === profileData.division?.toLowerCase()
      )
      filteredCurrent = current.filter(
        (item) =>
          item.division?.toLowerCase() === profileData.division?.toLowerCase()
      )
      break

    case 'department':
      filteredBoards = boards.filter(
        (item) =>
          item.department?.toLowerCase() ===
          profileData.department?.toLowerCase()
      )
      filteredCurrent = current.filter(
        (item) =>
          item.department?.toLowerCase() ===
          profileData.department?.toLowerCase()
      )
      break

    case 'group':
      filteredBoards = boards.filter(
        (item) => item.group?.toLowerCase() === profileData.group?.toLowerCase()
      )
      filteredCurrent = current.filter(
        (item) => item.group?.toLowerCase() === profileData.group?.toLowerCase()
      )
      break

    case 'role':
      filteredBoards = boards.filter(
        (item) => item.role?.toLowerCase() === profileData.role?.toLowerCase()
      )
      filteredCurrent = current.filter(
        (item) => item.role?.toLowerCase() === profileData.role?.toLowerCase()
      )
      break

    case 'company':
    default:
      filteredBoards = boards
      filteredCurrent = current
      break
  }

  // Re-rank after filtering
  const rankedBoards = filteredBoards.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))

  return {
    boards: rankedBoards,
    current: filteredCurrent,
  }
}

/**
 * Find and mark user's rank
 */
function markUserRank(boards, current, userId) {
  let yourRank = null
  let userItem = null
  let filteredBoards = []
  let foundInBoards = false

  // Check in boards
  for (const item of boards) {
    if (parseInt(item.userid) === parseInt(userId)) {
      foundInBoards = true
      yourRank = item.rank
      userItem = { ...item, isyou: 1 }

      // If rank > 15, replace rank 15
      if (parseInt(item.rank) > 15) {
        userItem.rank = 15
      }
    } else {
      filteredBoards.push(item)
    }
  }

  // Check in current if not found in boards
  if (!foundInBoards && current && current.length > 0) {
    for (const item of current) {
      if (parseInt(item.userid) === parseInt(userId)) {
        yourRank = item.rank
        userItem = { ...item, isyou: 1 }

        // If rank > 15, replace rank 15
        if (parseInt(item.rank) > 15) {
          userItem.rank = 15
        }
        break
      }
    }
  }

  // Insert user item back
  if (userItem) {
    if (yourRank > 15) {
      // Replace rank 15 with user
      const index = filteredBoards.findIndex(
        (item) => parseInt(item.rank) === 15
      )
      if (index !== -1) {
        filteredBoards[index] = userItem
      } else {
        filteredBoards.push(userItem)
      }
    } else {
      filteredBoards.push(userItem)
    }
  }

  // Sort by rank
  filteredBoards.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))

  return {
    boards: filteredBoards,
    yourRank,
  }
}

/**
 * Split data into top3, columnLeft, columnRight
 */
function splitDataIntoSections(boards, yourRank) {
  const top3 = boards.filter((item) => parseInt(item.rank) <= 3)
  const columnLeft = boards.filter(
    (item) => parseInt(item.rank) > 3 && parseInt(item.rank) < 10
  )
  const columnRight = boards.filter(
    (item) => parseInt(item.rank) > 9 && parseInt(item.rank) < 16
  )

  return {
    top3: top3.sort((a, b) => parseInt(a.rank) - parseInt(b.rank)),
    columnLeft: columnLeft.sort((a, b) => parseInt(a.rank) - parseInt(b.rank)),
    columnRight: columnRight.sort(
      (a, b) => parseInt(a.rank) - parseInt(b.rank)
    ),
    yourRank,
  }
}
