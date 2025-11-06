# SCORM Player Documentation

## Table of Contents

1. [Overview](#overview)
2. [SCORM 1.2 Specification](#scorm-12-specification)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Data Flow](#data-flow)
7. [Storage & Persistence](#storage--persistence)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Browser Compatibility](#browser-compatibility)
12. [Migration from Legacy](#migration-from-legacy)

---

## Overview

The SCORM Player implementation provides a complete SCORM 1.2 (Sharable Content Object Reference Model) runtime environment for delivering e-learning content. It enables tracking of learner progress, scores, and interactions while ensuring data persistence and synchronization with the server.

### Key Features

- ✅ **Full SCORM 1.2 Compliance**: Implements all required API methods and CMI data model
- ✅ **Auto-sync**: Automatic progress synchronization every 30 seconds
- ✅ **Offline Support**: Encrypted localStorage for network interruptions
- ✅ **Fullscreen Mode**: Immersive learning experience
- ✅ **Progress Tracking**: Lesson status, scores, time tracking, interactions
- ✅ **Server Sync**: TanStack Query integration for robust API communication
- ✅ **Exit Confirmation**: Prevents accidental data loss
- ✅ **Security**: Sandboxed iframe with controlled permissions

### Technology Stack

- **React 19.1.1**: Component framework
- **TanStack Query 5.90.5**: Server state management
- **Ant Design 5.27.6**: UI components (Drawer, Modal, Button)
- **SCORM 1.2 API**: Standard e-learning runtime specification
- **Encrypted Storage**: Base64 encryption for offline data

---

## SCORM 1.2 Specification

### What is SCORM?

SCORM (Sharable Content Object Reference Model) is a set of technical standards for e-learning software products. It defines how learning content and Learning Management Systems (LMS) communicate with each other.

### SCORM 1.2 API Methods

The SCORM Runtime API provides 8 methods that content can call:

| Method                         | Purpose                           | Returns               |
| ------------------------------ | --------------------------------- | --------------------- |
| `LMSInitialize("")`            | Initialize communication session  | `"true"` or `"false"` |
| `LMSFinish("")`                | Terminate communication session   | `"true"` or `"false"` |
| `LMSGetValue(element)`         | Retrieve data model element value | String value or `""`  |
| `LMSSetValue(element, value)`  | Store data model element value    | `"true"` or `"false"` |
| `LMSCommit("")`                | Persist data to server            | `"true"` or `"false"` |
| `LMSGetLastError()`            | Get last error code               | Error code string     |
| `LMSGetErrorString(errorCode)` | Get error description             | Error string          |
| `LMSGetDiagnostic(errorCode)`  | Get detailed diagnostic info      | Diagnostic string     |

### CMI Data Model

The Core CMI (Computer Managed Instruction) data model includes:

#### Core Elements (`cmi.core.*`)

```javascript
{
  student_id: "user123",              // Learner identifier (read-only)
  student_name: "John Doe",           // Learner name (read-only)
  lesson_location: "",                // Bookmark location
  credit: "credit",                   // Credit mode (read-only)
  lesson_status: "not attempted",     // Status: not attempted, incomplete, completed, passed, failed, browsed
  entry: "ab-initio",                 // Entry point (read-only): ab-initio, resume, ""
  score: {
    raw: "",                          // Raw score (0-100)
    min: "",                          // Minimum score
    max: ""                           // Maximum score
  },
  total_time: "0000:00:00.00",       // Cumulative time (read-only)
  lesson_mode: "normal",             // Mode (read-only): normal, browse, review
  exit: "",                          // Exit status: timeout, suspend, logout, ""
  session_time: ""                   // Current session time (write-only)
}
```

#### Suspend Data

```javascript
{
  suspend_data: '' // Up to 4096 characters for custom data
}
```

#### Launch Data

```javascript
{
  launch_data: '' // Initialization data (read-only)
}
```

#### Comments

```javascript
{
  comments: '' // Learner comments
}
```

#### Comments from LMS

```javascript
{
  comments_from_lms: '' // LMS comments (read-only)
}
```

#### Objectives

```javascript
{
  objectives: {
    _count: 0,
    _children: "id,score,status",
    0: {
      id: "",
      score: { raw: "", min: "", max: "" },
      status: ""
    }
  }
}
```

#### Student Data

```javascript
{
  student_data: {
    _children: "mastery_score,max_time_allowed,time_limit_action",
    mastery_score: "",
    max_time_allowed: "",
    time_limit_action: ""
  }
}
```

#### Student Preference

```javascript
{
  student_preference: {
    _children: "audio,language,speed,text",
    audio: "",
    language: "",
    speed: "",
    text: ""
  }
}
```

#### Interactions

```javascript
{
  interactions: {
    _count: 0,
    _children: "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
    0: {
      id: "",
      objectives: { _count: 0, 0: { id: "" } },
      time: "",
      type: "",  // true-false, choice, fill-in, matching, performance, sequencing, likert, numeric
      correct_responses: { _count: 0, 0: { pattern: "" } },
      weighting: "",
      student_response: "",
      result: "",  // correct, wrong, unanticipated, neutral, x.x (0.0 to 1.0)
      latency: ""
    }
  }
}
```

### Error Codes

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `0`   | No error                                 |
| `101` | General exception                        |
| `201` | Invalid argument error                   |
| `202` | Element cannot have children             |
| `203` | Element not an array - cannot have count |
| `301` | Not initialized                          |
| `401` | Not implemented error                    |
| `402` | Invalid set value, element is a keyword  |
| `403` | Element is read only                     |
| `404` | Element is write only                    |
| `405` | Incorrect data type                      |

---

## Architecture

### Component Structure

```
src/
├── features/journey/
│   ├── components/
│   │   └── SCORMPlayer.jsx          # Player UI component
│   └── hooks/
│       └── useSCORMPlayer.js        # State management hook
├── pages/journey/
│   └── SCORMPlayerPage.jsx          # Full-screen player page
└── utils/scorm/
    ├── scormAPI.js                  # SCORM 1.2 API implementation
    └── index.js                     # Exports
```

### Component Hierarchy

```
SCORMPlayerPage
└── SCORMPlayer
    ├── useSCORMPlayer (hook)
    │   ├── SCORMAPI (window.API)
    │   ├── Auto-sync Timer
    │   ├── Encrypted Storage
    │   └── TanStack Query Mutation
    └── iframe (SCORM content)
```

---

## API Reference

### `createSCORMAPI(options)`

Factory function to create and expose SCORM API to `window.API`.

**Parameters:**

```javascript
{
  onInitialize: (data) => void,      // Called when LMSInitialize is invoked
  onFinish: (data) => void,          // Called when LMSFinish is invoked
  onSetValue: (element, value) => void,  // Called when LMSSetValue is invoked
  onCommit: (data) => void,          // Called when LMSCommit is invoked
  studentId: string,                 // Learner identifier
  studentName: string,               // Learner name
  savedData: object                  // Previously saved SCORM data
}
```

**Returns:** `SCORMAPI` instance

**Example:**

```javascript
import { createSCORMAPI } from '@utils/scorm'

const api = createSCORMAPI({
  onInitialize: (data) => {
    console.log('SCORM initialized', data)
  },
  onFinish: (data) => {
    console.log('SCORM finished', data)
    // Send to server
  },
  onSetValue: (element, value) => {
    console.log(`Set ${element} = ${value}`)
  },
  onCommit: (data) => {
    console.log('Data committed', data)
  },
  studentId: 'user123',
  studentName: 'John Doe',
  savedData: null, // or previous session data
})
```

### `destroySCORMAPI()`

Cleanup function to remove SCORM API from window object.

**Example:**

```javascript
import { destroySCORMAPI } from '@utils/scorm'

useEffect(() => {
  const api = createSCORMAPI({
    /* options */
  })

  return () => {
    destroySCORMAPI() // Cleanup on unmount
  }
}, [])
```

### `useSCORMPlayer(options)`

React hook for SCORM player state management.

**Parameters:**

```javascript
{
  moduleId: string,           // Module identifier
  savedData: object,          // Previously saved SCORM data
  studentId: string,          // Learner identifier
  studentName: string,        // Learner name
  onComplete: (data) => void  // Callback when completed
}
```

**Returns:**

```javascript
{
  scormData: object,          // Current SCORM data
  isInitialized: boolean,     // Initialization state
  isCompleted: boolean,       // Completion state
  handleInitialize: (data) => void,
  handleFinish: (data) => void,
  handleSetValue: (element, value) => void,
  handleCommit: (data) => void,
  syncData: () => void,       // Manual sync to server
  resyncData: () => void,     // Retry failed sync
  clearData: () => void,      // Clear local storage
  getProgress: () => object   // Get current progress
}
```

**Example:**

```javascript
import { useSCORMPlayer } from '@hooks'

const MyComponent = () => {
  const {
    scormData,
    isInitialized,
    isCompleted,
    handleInitialize,
    handleFinish,
    handleSetValue,
    handleCommit,
    syncData,
  } = useSCORMPlayer({
    moduleId: 'module-123',
    savedData: null,
    studentId: 'user123',
    studentName: 'John Doe',
    onComplete: (data) => {
      console.log('Module completed!', data)
      navigate('/next-page')
    },
  })

  // Use in createSCORMAPI callbacks
  return <div>Player UI</div>
}
```

---

## Integration Guide

### Basic Integration

**Step 1: Import Components**

```javascript
import { SCORMPlayer } from '@components'
import { useSCORMPlayer } from '@hooks'
```

**Step 2: Setup Hook**

```javascript
const {
  scormData,
  isInitialized,
  isCompleted,
  handleInitialize,
  handleFinish,
  handleSetValue,
  handleCommit,
} = useSCORMPlayer({
  moduleId: moduleId,
  savedData: module?.scorm_data || null,
  studentId: userId,
  studentName: userName,
  onComplete: (data) => {
    console.log('Completed:', data)
    navigate(-1) // Go back
  },
})
```

**Step 3: Render Player**

```javascript
<SCORMPlayer
  contentUrl={module.content_url}
  module={module}
  onComplete={(data) => navigate(-1)}
  onExit={() => navigate(-1)}
  savedData={scormData}
  studentId={userId}
  studentName={userName}
/>
```

### Full Page Example

```javascript
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SCORMPlayer } from '@components'
import { useSCORMPlayer, useModuleDetail } from '@hooks'
import { Alert, Spin } from 'antd'

const SCORMPlayerPage = () => {
  const { journeyId, courseId, moduleId } = useParams()
  const navigate = useNavigate()

  // Get user info from Redux
  const { userId, userName } = useSelector((state) => ({
    userId: state.auth.user?.id,
    userName: state.auth.user?.name,
  }))

  // Fetch module data
  const {
    data: module,
    isLoading,
    error,
  } = useModuleDetail(journeyId, courseId, moduleId)

  // SCORM state management
  const scormPlayer = useSCORMPlayer({
    moduleId,
    savedData: module?.scorm_data || null,
    studentId: userId,
    studentName: userName,
    onComplete: () => navigate(-1),
  })

  if (isLoading) return <Spin fullscreen />
  if (error) return <Alert type="error" message="Failed to load module" />
  if (!module?.content_url) return <Alert type="warning" message="No content" />

  return (
    <div className="h-screen">
      <SCORMPlayer
        contentUrl={module.content_url}
        module={module}
        onComplete={() => navigate(-1)}
        onExit={() => navigate(-1)}
        savedData={scormPlayer.scormData}
        studentId={userId}
        studentName={userName}
      />
    </div>
  )
}

export default SCORMPlayerPage
```

### Routing Setup

```javascript
// In router/index.jsx
import SCORMPlayerPage from '@pages/journey/SCORMPlayerPage';

{
  path: 'journey/:journeyId',
  element: <JourneyLayout />,
  children: [
    {
      path: 'course/:courseId/module/:moduleId',
      element: <ModuleDetailPage />
    },
    {
      path: 'course/:courseId/module/:moduleId/play',
      element: <SCORMPlayerPage />
    }
  ]
}
```

### API Service Integration

```javascript
// In services/learningJourney.js
export const learningJourneyService = {
  // Update module progress with SCORM data
  updateModuleProgress: async (moduleId, progressData) => {
    const response = await apiClient.post(`/modules/${moduleId}/progress`, {
      scorm_data: progressData.scorm_data,
      lesson_status: progressData.lesson_status,
      score: progressData.score,
      session_time: progressData.session_time,
      total_time: progressData.total_time,
    })
    return response.data
  },
}
```

---

## Data Flow

### Initialization Flow

```
1. User clicks "Start Module"
   ↓
2. Navigate to /journey/:id/course/:id/module/:id/play
   ↓
3. SCORMPlayerPage loads
   ↓
4. useSCORMPlayer hook initializes
   ↓
5. createSCORMAPI() exposes window.API
   ↓
6. SCORM content iframe loads
   ↓
7. Content calls window.API.LMSInitialize("")
   ↓
8. handleInitialize callback triggered
   ↓
9. setIsInitialized(true)
   ↓
10. Auto-sync timer starts (30s interval)
```

### Progress Tracking Flow

```
1. Learner interacts with content
   ↓
2. Content calls window.API.LMSSetValue("cmi.core.lesson_status", "incomplete")
   ↓
3. handleSetValue callback triggered
   ↓
4. scormData state updated
   ↓
5. Data saved to encrypted localStorage
   ↓
6. Auto-sync timer triggers (every 30s)
   ↓
7. TanStack Query mutation sends to server
   ↓
8. On success: clear localStorage
   ↓
9. On error: keep in localStorage for retry
```

### Completion Flow

```
1. Learner completes content
   ↓
2. Content calls window.API.LMSSetValue("cmi.core.lesson_status", "completed")
   ↓
3. Content calls window.API.LMSFinish("")
   ↓
4. handleFinish callback triggered
   ↓
5. Calculate final session_time
   ↓
6. Send final data to server (mutation)
   ↓
7. Clear localStorage
   ↓
8. setIsCompleted(true)
   ↓
9. onComplete callback → navigate away
```

### Exit Flow

```
1. User clicks "Exit" button
   ↓
2. Modal confirms "Save progress?"
   ↓
3. If YES:
   - Call window.API.LMSCommit("")
   - Sync to server
   - Navigate away
   ↓
4. If NO:
   - Clear localStorage
   - Navigate away
```

---

## Storage & Persistence

### Encrypted localStorage

**Storage Key Format:**

```javascript
const storageKey = `scorm-${moduleId}`
```

**Encryption:**

```javascript
import { setEncryptedStorage, getEncryptedStorage } from '@utils/storage'

// Save
setEncryptedStorage(storageKey, {
  key: 'data_scorm_web',
  value: JSON.stringify(scormData),
})

// Retrieve
const encrypted = getEncryptedStorage(storageKey)
const data = JSON.parse(encrypted?.value || '{}')
```

### Auto-sync Mechanism

```javascript
useEffect(() => {
  if (!isInitialized || isCompleted) return

  const syncTimer = setInterval(() => {
    syncData() // Send to server
  }, 30000) // Every 30 seconds

  return () => clearInterval(syncTimer)
}, [isInitialized, isCompleted])
```

### Server Sync

**Mutation with TanStack Query:**

```javascript
const { mutate: sendSCORMData } = useMutation({
  mutationFn: (data) =>
    learningJourneyService.updateModuleProgress(moduleId, data),
  onSuccess: () => {
    // Clear localStorage on successful sync
    removeLocalStorage(storageKey)
  },
  onError: (error) => {
    console.error('Failed to sync SCORM data:', error)
    // Data remains in localStorage for retry
  },
})
```

### Data Recovery

If network fails or browser closes unexpectedly:

```javascript
// On next visit, retrieve saved data
const savedData = getEncryptedStorage(storageKey)

// Pass to useSCORMPlayer
useSCORMPlayer({
  moduleId,
  savedData: savedData ? JSON.parse(savedData.value) : null,
  // ... other options
})

// SCORM API will resume from saved state
```

---

## Error Handling

### SCORM API Errors

```javascript
// In SCORM content
var result = window.API.LMSSetValue('invalid.element', 'value')
if (result === 'false') {
  var errorCode = window.API.LMSGetLastError()
  var errorString = window.API.LMSGetErrorString(errorCode)
  console.error(`Error ${errorCode}: ${errorString}`)
}
```

### Network Errors

```javascript
const {
  mutate: sendSCORMData,
  error,
  isError,
} = useMutation({
  mutationFn: (data) =>
    learningJourneyService.updateModuleProgress(moduleId, data),
  retry: 3, // Retry 3 times
  retryDelay: 1000, // Wait 1s between retries
  onError: (error) => {
    message.error('Failed to save progress. Data saved locally.')
  },
})
```

### Content Loading Errors

```javascript
<SCORMPlayer
  contentUrl={module.content_url}
  // ...
  onError={(error) => {
    console.error('Content failed to load:', error)
    message.error('Failed to load SCORM content')
  }}
/>
```

### Validation Errors

```javascript
LMSSetValue(element, value) {
  // Validate element path
  if (!this.isValidElement(element)) {
    this.errorCode = '201';  // Invalid argument
    return 'false';
  }

  // Check read-only
  if (this.isReadOnly(element)) {
    this.errorCode = '403';  // Read only
    return 'false';
  }

  // Validate data type
  if (!this.isValidValue(element, value)) {
    this.errorCode = '405';  // Incorrect data type
    return 'false';
  }

  // Set value
  // ...
  return 'true';
}
```

---

## Testing

### Unit Tests

**Test SCORM API Methods:**

```javascript
import { createSCORMAPI, destroySCORMAPI } from '@utils/scorm'

describe('SCORMAPI', () => {
  let api

  beforeEach(() => {
    api = createSCORMAPI({
      studentId: 'test123',
      studentName: 'Test User',
    })
  })

  afterEach(() => {
    destroySCORMAPI()
  })

  test('LMSInitialize returns true', () => {
    expect(window.API.LMSInitialize('')).toBe('true')
  })

  test('LMSGetValue returns student_id', () => {
    window.API.LMSInitialize('')
    expect(window.API.LMSGetValue('cmi.core.student_id')).toBe('test123')
  })

  test('LMSSetValue sets lesson_status', () => {
    window.API.LMSInitialize('')
    expect(window.API.LMSSetValue('cmi.core.lesson_status', 'completed')).toBe(
      'true'
    )
    expect(window.API.LMSGetValue('cmi.core.lesson_status')).toBe('completed')
  })

  test('LMSSetValue rejects read-only element', () => {
    window.API.LMSInitialize('')
    expect(window.API.LMSSetValue('cmi.core.student_id', 'hacker')).toBe(
      'false'
    )
    expect(window.API.LMSGetLastError()).toBe('403')
  })
})
```

**Test useSCORMPlayer Hook:**

```javascript
import { renderHook, act } from '@testing-library/react'
import { useSCORMPlayer } from '@hooks'

describe('useSCORMPlayer', () => {
  test('initializes with default state', () => {
    const { result } = renderHook(() =>
      useSCORMPlayer({
        moduleId: 'test-module',
        studentId: 'test123',
        studentName: 'Test User',
      })
    )

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isCompleted).toBe(false)
  })

  test('handleInitialize sets initialized state', () => {
    const { result } = renderHook(() =>
      useSCORMPlayer({
        moduleId: 'test-module',
        studentId: 'test123',
        studentName: 'Test User',
      })
    )

    act(() => {
      result.current.handleInitialize({})
    })

    expect(result.current.isInitialized).toBe(true)
  })

  test('auto-sync timer is set', () => {
    jest.useFakeTimers()
    const syncSpy = jest.fn()

    renderHook(() =>
      useSCORMPlayer({
        moduleId: 'test-module',
        studentId: 'test123',
        studentName: 'Test User',
        onSync: syncSpy,
      })
    )

    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(syncSpy).toHaveBeenCalled()
    jest.useRealTimers()
  })
})
```

### Integration Tests

**Test SCORMPlayer Component:**

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import { SCORMPlayer } from '@components'

describe('SCORMPlayer', () => {
  test('renders iframe with content URL', () => {
    render(
      <SCORMPlayer
        contentUrl="https://example.com/content/index.html"
        module={{ title: 'Test Module' }}
        studentId="test123"
        studentName="Test User"
      />
    )

    const iframe = screen.getByTitle('SCORM Content Player')
    expect(iframe).toHaveAttribute(
      'src',
      'https://example.com/content/index.html'
    )
  })

  test('shows loading spinner initially', () => {
    render(
      <SCORMPlayer
        contentUrl="https://example.com/content/index.html"
        module={{ title: 'Test Module' }}
        studentId="test123"
        studentName="Test User"
      />
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('exposes window.API for SCORM content', async () => {
    render(
      <SCORMPlayer
        contentUrl="https://example.com/content/index.html"
        module={{ title: 'Test Module' }}
        studentId="test123"
        studentName="Test User"
      />
    )

    await waitFor(() => {
      expect(window.API).toBeDefined()
      expect(window.API.LMSInitialize).toBeInstanceOf(Function)
    })
  })
})
```

### E2E Tests (Cypress/Playwright)

```javascript
describe('SCORM Player Flow', () => {
  it('completes a module successfully', () => {
    cy.visit('/journey/1/course/1/module/1')
    cy.contains('Start Module').click()

    // Wait for SCORM player to load
    cy.url().should('include', '/play')
    cy.get('iframe[title="SCORM Content Player"]').should('exist')

    // Simulate SCORM content interactions
    cy.window().then((win) => {
      win.API.LMSInitialize('')
      win.API.LMSSetValue('cmi.core.lesson_status', 'completed')
      win.API.LMSSetValue('cmi.core.score.raw', '100')
      win.API.LMSFinish('')
    })

    // Verify completion and navigation
    cy.url().should('not.include', '/play')
    cy.contains('Module completed').should('be.visible')
  })

  it('persists progress on refresh', () => {
    cy.visit('/journey/1/course/1/module/1/play')

    // Set some progress
    cy.window().then((win) => {
      win.API.LMSInitialize('')
      win.API.LMSSetValue('cmi.core.lesson_location', 'page5')
      win.API.LMSCommit('')
    })

    // Refresh page
    cy.reload()

    // Verify progress restored
    cy.window().then((win) => {
      win.API.LMSInitialize('')
      expect(win.API.LMSGetValue('cmi.core.lesson_location')).to.equal('page5')
    })
  })
})
```

---

## Troubleshooting

### Common Issues

#### 1. `window.API is undefined`

**Symptom:** SCORM content shows error "API not found"

**Solution:**

- Ensure `createSCORMAPI()` is called before content loads
- Check iframe `onLoad` timing
- Verify SCORM content looks for `window.API` (not `window.parent.API`)

```javascript
useEffect(() => {
  const api = createSCORMAPI({
    /* options */
  })
  return () => destroySCORMAPI()
}, []) // Run once on mount
```

#### 2. Progress Not Saving

**Symptom:** Data lost on refresh or navigation

**Solution:**

- Check auto-sync timer is running
- Verify TanStack Query mutation is configured
- Check network tab for API errors
- Ensure localStorage is not disabled

```javascript
// Debug: Check if data is in localStorage
const storageKey = `scorm-${moduleId}`
const data = getEncryptedStorage(storageKey)
console.log('Saved SCORM data:', data)
```

#### 3. `LMSSetValue` Returns "false"

**Symptom:** Content cannot set values

**Solution:**

- Check error code: `window.API.LMSGetLastError()`
- Verify element path is correct (e.g., `cmi.core.lesson_status`)
- Ensure element is not read-only
- Check value format matches expected type

```javascript
// Debug SCORM errors
const result = window.API.LMSSetValue(element, value)
if (result === 'false') {
  const errorCode = window.API.LMSGetLastError()
  const errorMsg = window.API.LMSGetErrorString(errorCode)
  console.error(`SCORM Error ${errorCode}: ${errorMsg}`)
}
```

#### 4. Session Time Not Calculating

**Symptom:** `cmi.core.session_time` is always "0000:00:00.00"

**Solution:**

- Ensure `sessionStartTime` is set on LMSInitialize
- Verify `calculateSessionTime()` function is working
- Check time format: `HHHH:MM:SS.SS`

```javascript
// Debug session time
console.log('Session start:', sessionStartTime)
console.log('Current time:', new Date())
console.log('Calculated:', calculateSessionTime(sessionStartTime))
```

#### 5. Fullscreen Not Working

**Symptom:** Fullscreen button does nothing

**Solution:**

- Check browser support: `document.fullscreenEnabled`
- User gesture required (can't auto-fullscreen)
- Check for iframe restrictions

```javascript
// Debug fullscreen
if (!document.fullscreenEnabled) {
  console.error('Fullscreen not supported')
}
```

#### 6. CORS Errors

**Symptom:** Content fails to load in iframe

**Solution:**

- Ensure SCORM package is hosted on same domain or has CORS headers
- Check `Content-Security-Policy` headers
- Verify iframe `sandbox` attribute allows scripts

```javascript
// Adjust sandbox if needed
<iframe
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  src={contentUrl}
/>
```

### Debug Mode

Enable verbose logging:

```javascript
// In scormAPI.js, add debug flag
class SCORMAPI {
  constructor(options) {
    this.debug = options.debug || false
    // ...
  }

  LMSSetValue(element, value) {
    if (this.debug) {
      console.log(`[SCORM] LMSSetValue("${element}", "${value}")`)
    }
    // ...
  }
}

// Usage
createSCORMAPI({
  debug: true, // Enable debug logging
  // ...
})
```

### Performance Issues

**Problem:** Player is slow or unresponsive

**Solutions:**

1. **Large SCORM packages**: Use lazy loading for resources
2. **Memory leaks**: Ensure `destroySCORMAPI()` is called on unmount
3. **Too frequent sync**: Increase auto-sync interval from 30s to 60s
4. **Large suspend_data**: Compress data before storing

```javascript
// Increase sync interval
const SYNC_INTERVAL = 60000 // 60 seconds instead of 30

// Compress suspend_data (example)
import pako from 'pako'

const compressSuspendData = (data) => {
  const compressed = pako.deflate(data)
  return btoa(String.fromCharCode(...compressed))
}
```

---

## Browser Compatibility

### Supported Browsers

| Browser        | Version | Support               |
| -------------- | ------- | --------------------- |
| Chrome         | 90+     | ✅ Full               |
| Firefox        | 88+     | ✅ Full               |
| Safari         | 14+     | ✅ Full               |
| Edge           | 90+     | ✅ Full               |
| Mobile Safari  | 14+     | ⚠️ Limited fullscreen |
| Chrome Android | 90+     | ✅ Full               |

### Known Limitations

#### Safari

- Fullscreen API requires user gesture
- localStorage may be disabled in private browsing
- Autoplay restrictions affect video content

#### Mobile Browsers

- Limited screen real estate for fullscreen
- Virtual keyboard can interfere with content
- Background tab may pause JavaScript

### Polyfills

**Fullscreen API:**

```javascript
const requestFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen() // Safari
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen() // Firefox
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen() // IE/Edge
  }
}
```

**localStorage Fallback:**

```javascript
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Fallback to memory storage
let memoryStorage = {}
const storage = isLocalStorageAvailable()
  ? localStorage
  : {
      getItem: (key) => memoryStorage[key],
      setItem: (key, value) => {
        memoryStorage[key] = value
      },
      removeItem: (key) => {
        delete memoryStorage[key]
      },
    }
```

---

## Migration from Legacy

### Old Implementation (moleawiz_web)

**File:** `src/pages/main/contents/LearningJourney/SubPages/ScormPlayer.jsx`

**Issues:**

- ❌ Tightly coupled to class components
- ❌ No auto-sync mechanism
- ❌ Manual localStorage management
- ❌ Incomplete error handling
- ❌ No TypeScript support
- ❌ Mixed concerns (UI + API + state)

### New Implementation (moleawiz-web-refactor)

**Files:**

- `src/utils/scorm/scormAPI.js` - Pure SCORM API
- `src/features/journey/components/SCORMPlayer.jsx` - UI component
- `src/features/journey/hooks/useSCORMPlayer.js` - State hook
- `src/pages/journey/SCORMPlayerPage.jsx` - Page route

**Improvements:**

- ✅ Separation of concerns
- ✅ Auto-sync every 30 seconds
- ✅ TanStack Query for API calls
- ✅ Encrypted storage
- ✅ Comprehensive error handling
- ✅ Fullscreen support
- ✅ Exit confirmation
- ✅ React 19 hooks

### Migration Steps

**1. Update Route:**

```javascript
// Old
<Route path="/scorm/:moduleId" component={ScormPlayer} />

// New
<Route path="course/:courseId/module/:moduleId/play" element={<SCORMPlayerPage />} />
```

**2. Update Module Click Handler:**

```javascript
// Old
onClick={() => navigate(`/scorm/${module.id}`)}

// New
onClick={() => navigate(`course/${courseId}/module/${module.id}/play`)}
```

**3. Update API Service:**

```javascript
// Old
export const updateScormProgress = (moduleId, data) => {
  return axios.post(`/scorm/${moduleId}/progress`, data)
}

// New
export const updateModuleProgress = async (moduleId, progressData) => {
  const response = await apiClient.post(`/modules/${moduleId}/progress`, {
    scorm_data: progressData.scorm_data,
    lesson_status: progressData.lesson_status,
    score: progressData.score,
    session_time: progressData.session_time,
  })
  return response.data
}
```

**4. Data Structure Migration:**

Old format:

```javascript
{
  module_id: '123',
  cmi_data: { /* SCORM data */ },
  status: 'completed'
}
```

New format:

```javascript
{
  scorm_data: {
    cmi: { /* SCORM data */ }
  },
  lesson_status: 'completed',
  score: { raw: 100, min: 0, max: 100 },
  session_time: '0000:15:30.00',
  total_time: '0001:23:45.00'
}
```

**5. Component Replacement:**

Remove old files:

```bash
rm src/pages/main/contents/LearningJourney/SubPages/ScormPlayer.jsx
rm src/pages/main/contents/LearningJourney/hooks/useScormAPI.js
```

Import new components:

```javascript
import { SCORMPlayer } from '@components'
import { useSCORMPlayer } from '@hooks'
```

---

## Best Practices

### 1. Always Initialize Before Use

```javascript
// ❌ Bad
window.API.LMSSetValue('cmi.core.lesson_status', 'completed')

// ✅ Good
if (window.API.LMSInitialize('') === 'true') {
  window.API.LMSSetValue('cmi.core.lesson_status', 'completed')
  window.API.LMSCommit('')
}
```

### 2. Check Return Values

```javascript
// ❌ Bad
window.API.LMSSetValue(element, value)

// ✅ Good
const result = window.API.LMSSetValue(element, value)
if (result === 'false') {
  const errorCode = window.API.LMSGetLastError()
  console.error('Error:', window.API.LMSGetErrorString(errorCode))
}
```

### 3. Commit Frequently

```javascript
// ✅ Good - Commit after important changes
window.API.LMSSetValue('cmi.core.lesson_location', 'page5')
window.API.LMSCommit('') // Persist immediately
```

### 4. Handle Unmount Properly

```javascript
// ✅ Good
useEffect(() => {
  const api = createSCORMAPI({
    /* options */
  })

  return () => {
    // Save data before cleanup
    if (window.API) {
      window.API.LMSCommit('')
      window.API.LMSFinish('')
    }
    destroySCORMAPI()
  }
}, [])
```

### 5. Use Encrypted Storage for Sensitive Data

```javascript
// ✅ Good
setEncryptedStorage(storageKey, {
  key: 'data_scorm_web',
  value: JSON.stringify(scormData),
})
```

### 6. Validate Before Setting

```javascript
// ✅ Good
const setLessonStatus = (status) => {
  const validStatuses = [
    'not attempted',
    'incomplete',
    'completed',
    'passed',
    'failed',
    'browsed',
  ]
  if (!validStatuses.includes(status)) {
    console.error('Invalid lesson status:', status)
    return
  }
  window.API.LMSSetValue('cmi.core.lesson_status', status)
}
```

### 7. Monitor Performance

```javascript
// ✅ Good - Track sync performance
const syncData = () => {
  const startTime = performance.now()

  sendSCORMData(data, {
    onSuccess: () => {
      const duration = performance.now() - startTime
      console.log(`Sync completed in ${duration}ms`)
    },
  })
}
```

---

## Additional Resources

### Official SCORM Documentation

- [SCORM 1.2 Run-Time Environment](https://adlnet.gov/projects/scorm/)
- [SCORM Best Practices Guide](https://www.rusticisoftware.com/resources/scorm-best-practices/)

### Tools

- [SCORM Cloud](https://cloud.scorm.com/) - Test SCORM packages
- [SCORM Wrapper](https://github.com/pipwerks/scorm-api-wrapper) - Alternative implementation

### Related Docs

- [API_HOOKS_DOCUMENTATION.md](./API_HOOKS_DOCUMENTATION.md) - TanStack Query hooks
- [LEARNING_JOURNEY_REFACTOR.md](./LEARNING_JOURNEY_REFACTOR.md) - Full refactor guide
- [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - Migration steps

---

## License

This implementation follows SCORM 1.2 specifications as defined by ADL (Advanced Distributed Learning).

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [Common Issues](#common-issues)
3. Contact development team

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Maintainer:** Development Team
