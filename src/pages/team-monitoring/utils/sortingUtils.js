/**
 * Sort program members with complex logic:
 * 1. Sort all by progress (ascending)
 * 2. Separate incomplete (<100%) and complete (>=100%)
 * 3. Sort complete alphabetically by fullname
 * 4. Combine: incomplete first, then complete
 *
 * @param {Array} members - Array of member objects
 * @returns {Array} Sorted members
 */
export function sortProgramMembers(members) {
  if (!members || members.length === 0) return []

  // Step 1: Sort all by progress (ascending)
  const sortedByProgress = [...members].sort((a, b) => a.progress - b.progress)

  // Step 2: Separate incomplete and complete
  const incomplete = sortedByProgress.filter((member) => member.progress < 100)
  const complete = sortedByProgress.filter((member) => member.progress >= 100)

  // Step 3: Sort complete alphabetically
  const completeSorted = complete.sort((a, b) =>
    ('' + a.fullname).localeCompare(b.fullname)
  )

  // Step 4: Combine
  return [...incomplete, ...completeSorted]
}

/**
 * Sort team members by total ongoing programs (descending)
 *
 * @param {Array} teams - Array of team member objects
 * @returns {Array} Sorted teams
 */
export function sortTeamsByOngoing(teams) {
  if (!teams || teams.length === 0) return []

  return [...teams].sort((a, b) => b.total_ongoing - a.total_ongoing)
}

/**
 * Sort team members alphabetically by fullname
 *
 * @param {Array} teams - Array of team member objects
 * @returns {Array} Sorted teams
 */
export function sortTeamsByName(teams) {
  if (!teams || teams.length === 0) return []

  return [...teams].sort((a, b) => ('' + a.fullname).localeCompare(b.fullname))
}

/**
 * Sort programs by progress (ascending)
 *
 * @param {Array} programs - Array of program objects
 * @returns {Array} Sorted programs
 */
export function sortProgramsByProgress(programs) {
  if (!programs || programs.length === 0) return []

  return [...programs].sort((a, b) => a.progress - b.progress)
}

/**
 * Paginate array for infinite scroll
 *
 * @param {Array} data - Full data array
 * @param {number} startIndex - Start index
 * @param {number} pageSize - Items per page
 * @returns {Array} Paginated data
 */
export function paginateData(data, startIndex, pageSize = 12) {
  if (!data || data.length === 0) return []

  return data.slice(startIndex, startIndex + pageSize)
}
