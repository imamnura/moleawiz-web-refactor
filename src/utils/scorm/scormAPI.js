/**
 * SCORM 1.2 API Implementation
 * Provides window.API object for SCORM content communication
 *
 * Reference: SCORM 1.2 Run-Time Environment
 * https://scorm.com/scorm-explained/technical-scorm/run-time/
 */

class SCORMAPI {
  constructor() {
    this.LMSInitialized = false
    this.LMSFinishCalled = false
    this.data = {}
    this.errorCode = '0'
    this.errorString = ''
    this.diagnosticInfo = ''

    // Callbacks
    this.onInitialize = null
    this.onFinish = null
    this.onSetValue = null
    this.onCommit = null

    // Initialize default CMI data structure
    this.initializeDefaultData()
  }

  /**
   * Initialize default SCORM data model
   */
  initializeDefaultData() {
    this.data = {
      'cmi.core._children':
        'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time',
      'cmi.core.student_id': '',
      'cmi.core.student_name': '',
      'cmi.core.lesson_location': '',
      'cmi.core.credit': 'credit',
      'cmi.core.lesson_status': 'not attempted',
      'cmi.core.entry': 'ab-initio',
      'cmi.core.score._children': 'raw,min,max',
      'cmi.core.score.raw': '',
      'cmi.core.score.min': '',
      'cmi.core.score.max': '',
      'cmi.core.total_time': '0000:00:00.00',
      'cmi.core.lesson_mode': 'normal',
      'cmi.core.exit': '',
      'cmi.core.session_time': '0000:00:00.00',
      'cmi.suspend_data': '',
      'cmi.launch_data': '',
      'cmi.comments': '',
      'cmi.comments_from_lms': '',
      'cmi.objectives._count': '0',
      'cmi.student_data._children':
        'mastery_score,max_time_allowed,time_limit_action',
      'cmi.student_data.mastery_score': '',
      'cmi.student_data.max_time_allowed': '',
      'cmi.student_data.time_limit_action': '',
      'cmi.student_preference._children': 'audio,language,speed,text',
      'cmi.student_preference.audio': '0',
      'cmi.student_preference.language': '',
      'cmi.student_preference.speed': '0',
      'cmi.student_preference.text': '0',
      'cmi.interactions._count': '0',
    }
  }

  /**
   * LMSInitialize - Called when SCO is launched
   * @param {string} parameter - Empty string "" (required by SCORM spec but unused)
   * @returns {string} "true" or "false"
   */
  // eslint-disable-next-line no-unused-vars
  LMSInitialize(parameter) {
    console.log('[SCORM API] LMSInitialize called')

    if (this.LMSInitialized) {
      this.setError('101', 'Already initialized')
      return 'false'
    }

    if (this.LMSFinishCalled) {
      this.setError('101', 'LMSFinish already called')
      return 'false'
    }

    this.LMSInitialized = true
    this.setError('0', 'No error')

    // Callback
    if (typeof this.onInitialize === 'function') {
      this.onInitialize()
    }

    return 'true'
  }

  /**
   * LMSFinish - Called when SCO is terminated
   * @param {string} parameter - Empty string "" (required by SCORM spec but unused)
   * @returns {string} "true" or "false"
   */
  // eslint-disable-next-line no-unused-vars
  LMSFinish(parameter) {
    console.log('[SCORM API] LMSFinish called')

    if (!this.LMSInitialized) {
      this.setError('301', 'Not initialized')
      return 'false'
    }

    if (this.LMSFinishCalled) {
      this.setError('101', 'Already finished')
      return 'false'
    }

    this.LMSFinishCalled = true
    this.LMSInitialized = false
    this.setError('0', 'No error')

    // Callback
    if (typeof this.onFinish === 'function') {
      this.onFinish(this.data)
    }

    return 'true'
  }

  /**
   * LMSGetValue - Retrieves a value from the data model
   * @param {string} element - CMI element name
   * @returns {string} Value or empty string
   */
  LMSGetValue(element) {
    console.log('[SCORM API] LMSGetValue:', element)

    if (!this.LMSInitialized) {
      this.setError('301', 'Not initialized')
      return ''
    }

    if (!element || element === '') {
      this.setError('201', 'Invalid argument')
      return ''
    }

    const value = this.data[element]

    if (value === undefined) {
      this.setError('203', 'Element not found: ' + element)
      return ''
    }

    this.setError('0', 'No error')
    return String(value)
  }

  /**
   * LMSSetValue - Sets a value in the data model
   * @param {string} element - CMI element name
   * @param {string} value - Value to set
   * @returns {string} "true" or "false"
   */
  LMSSetValue(element, value) {
    console.log('[SCORM API] LMSSetValue:', element, '=', value)

    if (!this.LMSInitialized) {
      this.setError('301', 'Not initialized')
      return 'false'
    }

    if (!element || element === '') {
      this.setError('201', 'Invalid argument')
      return 'false'
    }

    // Read-only elements check
    const readOnlyElements = [
      'cmi.core._children',
      'cmi.core.student_id',
      'cmi.core.student_name',
      'cmi.core.credit',
      'cmi.core.entry',
      'cmi.core.total_time',
      'cmi.core.lesson_mode',
      'cmi.launch_data',
      'cmi.comments_from_lms',
      'cmi.objectives._count',
      'cmi.student_data._children',
      'cmi.student_preference._children',
      'cmi.interactions._count',
    ]

    if (readOnlyElements.includes(element)) {
      this.setError('403', 'Element is read only')
      return 'false'
    }

    // Set the value
    this.data[element] = value
    this.setError('0', 'No error')

    // Callback
    if (typeof this.onSetValue === 'function') {
      this.onSetValue(element, value)
    }

    return 'true'
  }

  /**
   * LMSCommit - Persists any changes to the data model
   * @param {string} parameter - Empty string "" (required by SCORM spec but unused)
   * @returns {string} "true" or "false"
   */
  // eslint-disable-next-line no-unused-vars
  LMSCommit(parameter) {
    console.log('[SCORM API] LMSCommit called')

    if (!this.LMSInitialized) {
      this.setError('301', 'Not initialized')
      return 'false'
    }

    this.setError('0', 'No error')

    // Callback
    if (typeof this.onCommit === 'function') {
      this.onCommit(this.data)
    }

    return 'true'
  }

  /**
   * LMSGetLastError - Returns the error code from the last API call
   * @returns {string} Error code
   */
  LMSGetLastError() {
    return this.errorCode
  }

  /**
   * LMSGetErrorString - Returns the error description
   * @param {string} errorCode - Error code
   * @returns {string} Error description
   */
  LMSGetErrorString(errorCode) {
    const errorStrings = {
      0: 'No error',
      101: 'General exception',
      201: 'Invalid argument error',
      202: 'Element cannot have children',
      203: 'Element not an array - cannot have count',
      301: 'Not initialized',
      401: 'Not implemented error',
      402: 'Invalid set value, element is a keyword',
      403: 'Element is read only',
      404: 'Element is write only',
      405: 'Incorrect data type',
    }

    return errorStrings[errorCode] || 'Unknown error'
  }

  /**
   * LMSGetDiagnostic - Returns detailed diagnostic information
   * @param {string} errorCode - Error code
   * @returns {string} Diagnostic information
   */
  LMSGetDiagnostic(errorCode) {
    return this.diagnosticInfo || this.LMSGetErrorString(errorCode)
  }

  /**
   * Set error state
   * @param {string} code - Error code
   * @param {string} string - Error string
   * @param {string} diagnostic - Diagnostic info
   */
  setError(code, string, diagnostic = '') {
    this.errorCode = code
    this.errorString = string
    this.diagnosticInfo = diagnostic

    if (code !== '0') {
      console.warn('[SCORM API] Error:', code, string)
    }
  }

  /**
   * Load existing SCORM data
   * @param {Object} savedData - Previously saved SCORM data
   */
  loadData(savedData) {
    if (savedData && typeof savedData === 'object') {
      this.data = { ...this.data, ...savedData }
      console.log('[SCORM API] Data loaded:', this.data)
    }
  }

  /**
   * Get current SCORM data
   * @returns {Object} Current data model
   */
  getData() {
    return { ...this.data }
  }

  /**
   * Reset API to initial state
   */
  reset() {
    this.LMSInitialized = false
    this.LMSFinishCalled = false
    this.initializeDefaultData()
    this.setError('0', 'No error')
    console.log('[SCORM API] Reset complete')
  }

  /**
   * Set student info
   * @param {string} studentId - Student ID
   * @param {string} studentName - Student name
   */
  setStudentInfo(studentId, studentName) {
    this.data['cmi.core.student_id'] = String(studentId)
    this.data['cmi.core.student_name'] = String(studentName)
  }

  /**
   * Get lesson status
   * @returns {string} Lesson status
   */
  getLessonStatus() {
    return this.data['cmi.core.lesson_status'] || 'not attempted'
  }

  /**
   * Get session time
   * @returns {string} Session time in SCORM format
   */
  getSessionTime() {
    return this.data['cmi.core.session_time'] || '0000:00:00.00'
  }

  /**
   * Get score
   * @returns {Object} Score object
   */
  getScore() {
    return {
      raw: this.data['cmi.core.score.raw'] || '',
      min: this.data['cmi.core.score.min'] || '',
      max: this.data['cmi.core.score.max'] || '',
    }
  }
}

/**
 * Create and expose SCORM API to window
 * @param {Object} options - Configuration options
 * @returns {SCORMAPI} SCORM API instance
 */
export function createSCORMAPI(options = {}) {
  const api = new SCORMAPI()

  // Set callbacks
  if (options.onInitialize) api.onInitialize = options.onInitialize
  if (options.onFinish) api.onFinish = options.onFinish
  if (options.onSetValue) api.onSetValue = options.onSetValue
  if (options.onCommit) api.onCommit = options.onCommit

  // Load saved data if provided
  if (options.savedData) {
    api.loadData(options.savedData)
  }

  // Set student info if provided
  if (options.studentId && options.studentName) {
    api.setStudentInfo(options.studentId, options.studentName)
  }

  // Expose to window for SCORM content
  window.API = api

  console.log('[SCORM API] API created and exposed to window.API')

  return api
}

/**
 * Remove SCORM API from window
 */
export function destroySCORMAPI() {
  if (window.API) {
    delete window.API
    console.log('[SCORM API] API removed from window')
  }
}

export default SCORMAPI
