/**
 * Constants for Review/Anchor Feature
 */

// Review Status
export const REVIEW_STATUS = {
  NEED_REVIEW: null,
  APPROVED: 1,
  DECLINED: 0,
}

// Answer Types
export const ANSWER_TYPE = {
  TEXT: 1,
  IMAGE: 2,
  HTML: 3,
  FILE: 6,
}

// Character Limits
export const MAX_COMMENT_LENGTH = 200
export const MAX_FEEDBACK_LENGTH = 200

// Filter Status Values
export const FILTER_STATUS = {
  NEED_REVIEW: 'need_review',
  APPROVED: 'approved',
  DECLINED: 'decline',
  ALL: 'all',
}

// Submission Flag
export const SUBMISSION_FLAG = {
  CURRENT: 0,
  PREVIOUS: 1,
}
