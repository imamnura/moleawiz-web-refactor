import { parseISO, compareAsc, compareDesc } from 'date-fns'

/**
 * Sort submissions by FIFO (First In First Out) - oldest first
 * @param {Array} submissions - Array of submission objects
 * @returns {Array} Sorted array (ascending by submit date)
 */
export const sortByFIFO = (submissions) => {
  if (!submissions || !Array.isArray(submissions)) return []
  return [...submissions].sort((a, b) => {
    const dateA =
      typeof a.submited === 'string' ? parseISO(a.submited) : a.submited
    const dateB =
      typeof b.submited === 'string' ? parseISO(b.submited) : b.submited
    return compareAsc(dateA, dateB)
  })
}

/**
 * Sort submissions by LIFO (Last In First Out) - newest first
 * @param {Array} submissions - Array of submission objects
 * @returns {Array} Sorted array (descending by submit date)
 */
export const sortByLIFO = (submissions) => {
  if (!submissions || !Array.isArray(submissions)) return []
  return [...submissions].sort((a, b) => {
    const dateA =
      typeof a.submited === 'string' ? parseISO(a.submited) : a.submited
    const dateB =
      typeof b.submited === 'string' ? parseISO(b.submited) : b.submited
    return compareDesc(dateA, dateB)
  })
}

/**
 * Sort users alphabetically by fullname
 * @param {Array} users - Array of user objects
 * @returns {Array} Sorted array (alphabetical by fullname)
 */
export const sortByName = (users) => {
  if (!users || !Array.isArray(users)) return []
  return [...users].sort((a, b) => a.fullname.localeCompare(b.fullname))
}

/**
 * Filter submissions by status
 * @param {Array} submissions - Array of submission objects
 * @param {string} status - Filter type: 'need_review', 'approved', 'decline', 'all'
 * @param {Array} notSubmitted - Array of users who haven't submitted
 * @returns {Array} Filtered and sorted array
 */
export const filterByStatus = (submissions, status, notSubmitted = []) => {
  if (!submissions || !Array.isArray(submissions)) return []

  switch (status) {
    case 'need_review': {
      const filtered = submissions.filter((item) => item.status === null)
      return sortByFIFO(filtered) // FIFO for need review
    }

    case 'approved': {
      const filtered = submissions.filter((item) => item.status === 1)
      return sortByLIFO(filtered) // LIFO for approved
    }

    case 'decline': {
      const filtered = submissions.filter((item) => item.status === 0)
      return sortByLIFO(filtered) // LIFO for declined
    }

    case 'all': {
      const needReview = sortByFIFO(
        submissions.filter((item) => item.status === null)
      )
      const declined = sortByLIFO(
        submissions.filter((item) => item.status === 0)
      )
      const approved = sortByLIFO(
        submissions.filter((item) => item.status === 1)
      )
      const notSubmittedSorted = sortByName(notSubmitted)

      return [...notSubmittedSorted, ...needReview, ...declined, ...approved]
    }

    default:
      return sortByFIFO(submissions.filter((item) => item.status === null))
  }
}

/**
 * Count submissions by status
 * @param {Array} submissions - Array of submission objects
 * @returns {Object} Count object { needReview, approved, declined }
 */
export const countByStatus = (submissions) => {
  if (!submissions || !Array.isArray(submissions)) {
    return { needReview: 0, approved: 0, declined: 0 }
  }

  return {
    needReview: submissions.filter((item) => item.status === null).length,
    approved: submissions.filter((item) => item.status === 1).length,
    declined: submissions.filter((item) => item.status === 0).length,
  }
}

/**
 * Process review data - add increment numbers for answers
 * @param {Array} reviewData - Array of review stage objects
 * @returns {Array} Processed review data with increment numbers
 */
export const processReviewData = (reviewData) => {
  if (!reviewData || !Array.isArray(reviewData)) return []

  // Sort by stage
  const sorted = [...reviewData].sort((a, b) => a.stage - b.stage)

  // Add incrementNumber to each answer for Popover index
  let counterIncrement = 0
  sorted.forEach((stage) => {
    if (stage.answers && Array.isArray(stage.answers)) {
      stage.answers.forEach((answer) => {
        answer.incrementNumber = counterIncrement
        counterIncrement++
      })
    }
  })

  return sorted
}

/**
 * Count accept/reject in review
 * @param {Array} reviewData - Array of review stage objects
 * @returns {Object} Count object { accepted, rejected }
 */
export const countReviewDecisions = (reviewData) => {
  if (!reviewData || !Array.isArray(reviewData)) {
    return { accepted: 0, rejected: 0 }
  }

  let accepted = 0
  let rejected = 0

  reviewData.forEach((stage) => {
    if (stage.review_status === 1) accepted++
    if (stage.review_status === 0) rejected++
  })

  return { accepted, rejected }
}

/**
 * Combine has_submitted and not_submitted users
 * @param {Object} data - Data object with has_submited and not_submited arrays
 * @returns {Object} { allUsers, hasSubmitted, notSubmitted }
 */
export const combineUserData = (data) => {
  if (!data) {
    return { allUsers: [], hasSubmitted: [], notSubmitted: [] }
  }

  const hasSubmitted = data.has_submited || []
  const notSubmitted = data.not_submited || []
  const allUsers = [...hasSubmitted, ...notSubmitted]

  return { allUsers, hasSubmitted, notSubmitted }
}
