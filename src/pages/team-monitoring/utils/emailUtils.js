/**
 * Generate mailto: link for sending notifications
 *
 * @param {Array} selectedMembers - Array of member objects with email
 * @param {string} programName - Program name
 * @returns {string} mailto: link
 */
export function generateEmailLink(selectedMembers, programName) {
  if (!selectedMembers || selectedMembers.length === 0) return ''

  // Join all emails with semicolon
  const emailRecipients = selectedMembers
    .map((member) => member.email)
    .join(';')

  // Format program name for URL
  const formattedProgramName = programName.split(' ').join('%20')

  // Create mailto link with pre-filled subject and body
  const subject = `Reminder%20Penyelesaian%20Program%20${formattedProgramName}`
  const body = `**Tuliskan%20kalimat%20pemberitahuan%20kepada%20tim%20member%20Anda%20bahwa%20mereka%20harus%20segera%20menyelesaikan%20program%20terkait**`

  return `mailto:${emailRecipients}?subject=${subject}&body=${body}`
}

/**
 * Open email client with mailto: link
 *
 * @param {Array} selectedMembers - Array of member objects
 * @param {string} programName - Program name
 */
export function openEmailClient(selectedMembers, programName) {
  const mailtoLink = generateEmailLink(selectedMembers, programName)
  if (mailtoLink) {
    window.open(mailtoLink)
  }
}
