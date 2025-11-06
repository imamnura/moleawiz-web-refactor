/**
 * Customer Support Configuration
 */

// Default customer support email
export const customer_support_email =
  import.meta.env.VITE_CUSTOMER_SUPPORT_EMAIL || 'support@moleawiz.com'
export const contactEmail = customer_support_email

// Email subject template
export const subjectEmail =
  import.meta.env.VITE_SUPPORT_EMAIL_SUBJECT || 'Help Request - ###'

// Email body template
export const bodyEmail =
  import.meta.env.VITE_SUPPORT_EMAIL_BODY || 'Hello, I need help with ###'

// Default values for backward compatibility
export default {
  email: customer_support_email,
  contactEmail,
  subjectEmail,
  bodyEmail,
}
