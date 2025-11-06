/**
 * Categorize event members by their confirmation status
 *
 * @param {Array} members - Array of member objects with status field
 * @returns {Object} Object with confirmed, notConfirmed, declined arrays
 */
export function categorizeMemberStatus(members) {
  if (!members || members.length === 0) {
    return {
      confirmed: [],
      notConfirmed: [],
      declined: [],
    }
  }

  const confirmed = []
  const notConfirmed = []
  const declined = []

  members.forEach((member) => {
    if (member.status === 'accepted') {
      confirmed.push(member)
    } else if (member.status === 'declined') {
      declined.push(member)
    } else if (member.status === 'tentatively' || member.status === null) {
      notConfirmed.push(member)
    }
  })

  return {
    confirmed,
    notConfirmed,
    declined,
  }
}

/**
 * Get member full name
 *
 * @param {Object} member - Member object
 * @returns {string} Full name
 */
export function getMemberFullName(member) {
  if (!member) return ''

  if (member.fullname) {
    return member.fullname
  }

  return `${member.firstname || ''} ${member.lastname || ''}`.trim()
}

/**
 * Filter incomplete programs
 *
 * @param {Array} programs - Array of program objects
 * @returns {Array} Incomplete programs only
 */
export function filterIncompletePrograms(programs) {
  if (!programs || programs.length === 0) return []

  return programs.filter((program) => program.is_completed < 1)
}
