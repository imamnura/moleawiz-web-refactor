# Review Feature - Refactor Summary

## Analysis Complete ✅

Analisis lengkap dari implementasi lama Review feature (Anchor Review System).

---

## Old Implementation Overview

### Structure

```
Reviews/
├── index.jsx (120 lines)          # Main wrapper
├── section/
│   ├── ListModuleReviewed/        # Module list (need review)
│   │   ├── index.jsx (400 lines)
│   │   ├── hooks/useActions.js
│   │   └── styles.js
│   └── ListUserReviewed/          # User submission list + Review form
│       ├── index.jsx (1400 lines!) # MASSIVE COMPONENT
│       ├── hooks/useActions.js
│       ├── constant.js
│       └── styles.js
├── hooks/useActions.js (empty)
└── styles.js
```

### Key Features Identified

**1. Module List (Left Panel - Desktop / First Screen - Mobile)**

- Display modules that need review (anchor only)
- Show: Thumbnail, Module name, Program name, Deadline, Need review count
- Delete module functionality (after deadline + all submitted)
- Auto-click first module on load
- Click module → Load user submissions

**2. User List (Right Panel - Desktop / Second Screen - Mobile)**

- Filter: Need Review, Declined, Approved, All
- Sorting:
  - Need Review: FIFO (oldest first)
  - Approved/Declined: LIFO (newest first)
  - All: Not submitted (alphabetical) → Need Review (FIFO) → Declined/Approved (LIFO)
- Display: Avatar, Name, Username, Role, Submission #, Submitted date, Status
- Click user → Open review form modal

**3. Review Form Modal (Complex!)**

- Header: Module title, User info, Submission number, Submitted date
- Body: Scrollable review form
  - **Per Stage Answer:**
    - Question text (HTML dangerouslySetInnerHTML)
    - Answer (text/HTML/image)
    - "See previous answer" popover (if exists)
    - Accept/Reject radio buttons
    - Comment textarea (required if reject, optional if accept)
    - Character limit: 200 chars
  - **Overall Feedback:**
    - Textarea (required)
    - Character limit: 200 chars
- Form validation
- localStorage persistence (save progress per user/submission/module)
- Submit button → Confirmation modal

**4. Review Preview Modal**

- Header: Module title, User info
- Status badge: Approved/Declined with accept/reject count
- Overall feedback display
- Per stage review:
  - Question + Answer
  - Comment (if any)
  - Accept/Reject icon overlay
- Close button

**5. Supporting Modals**

- **ModalCloseFormReview**: Confirm quit (lose unsaved data)
- **ModalIncompleteReview**: Validation failed (incomplete required fields)
- **ModalConfirmSubmitReview**: Confirm submit with accept/reject summary
- **Delete Module Confirmation**: Confirm delete module

**6. Mobile-Specific Features**

- Routing: `/reviews` → module list, `/reviews/module/:id/:journeyId` → user list
- Collapse for "See previous answer" (instead of Popover)
- Image zoom modal
- Different layouts

**7. Data Flow**

```
1. Load modules need review
   ↓
2. Auto-click first module
   ↓
3. Load user submissions (has_submitted + not_submitted)
   ↓
4. Filter by status (default: need_review)
   ↓
5. Click user → Fetch submission detail (flag=0) + previous (flag=1)
   ↓
6. Load localStorage if exists
   ↓
7. Fill form → Save to localStorage on change
   ↓
8. Submit → POST review → Clear localStorage → Refetch
```

**8. Complex Logic**

- **Form field names:**
  - `overall-feedback-{cmid}-{userId}`
  - `feedback-status-{reviewId}-{index}`
  - `feedback-comment-{reviewId}-{index}`
- **localStorage key:** `form_{userId}-{submissionNumber}-{moduleId}`
- **Radio onChange:** Update placeholder & required state per row
- **Popover state:** Array of open/close per answer (incrementNumber)
- **Character count:** Red color when >= 200
- **Image zoom:** Mouse move event for CSS zoom effect
- **Link conversion:** Detect URLs and convert to <a> tags
- **Enter conversion:** Replace \n with <br>

---

## Refactored Architecture (Planned)

### Folder Structure

```
src/pages/review/
├── components/
│   ├── ModuleCard.jsx           # Single module card
│   ├── ModuleList.jsx            # List of modules need review
│   ├── UserCard.jsx              # Single user submission card
│   ├── UserList.jsx              # List with filter tabs
│   ├── ReviewForm.jsx            # Main review form modal
│   ├── ReviewFormStage.jsx       # Single stage answer + feedback
│   ├── ReviewPreview.jsx         # Preview reviewed submission
│   ├── PreviousAnswerPopover.jsx # Popover for previous answer
│   ├── DeleteModuleModal.jsx     # Delete confirmation
│   └── ReviewModals.jsx          # Quit, Incomplete, Confirm modals
├── hooks/
│   ├── useModulesData.js         # Fetch modules need review
│   ├── useUserSubmissions.js     # Fetch & filter user submissions
│   ├── useSubmissionReview.js    # Fetch current + previous submission
│   ├── useReviewSubmission.js    # Handle form submission
│   └── useImageZoom.js           # Handle image zoom effect
├── utils/
│   ├── formatters.js             # Date, link, enter converters
│   ├── dataProcessing.js         # FIFO/LIFO sorting, filtering
│   └── localStorage.js           # Form persistence helpers
├── ReviewPage.jsx                # Main page (desktop 2-column)
└── ReviewMobilePage.jsx          # Mobile routing wrapper
```

### API Layer (RTK Query)

```javascript
// reviewApi.js
- getModulesNeedReview()          # GET /anchor/modules
- getUserSubmissions(moduleId, journeyId) # GET /anchor/modules/{id}/journey/{id}/users
- getSubmissionDetail(moduleId, userId, flag) # GET /anchor/modules/{id}/users/{id}/submission?flag={0|1}
- submitReview(data)              # POST /anchor/review/submit
- deleteModuleSubmission(cmid)    # POST /anchor/modules/delete
```

### Component Breakdown

**ModuleList** (replace ListModuleReviewed)

- Props: modules, loading, onModuleClick, onDeleteModule
- Features: Grid layout, auto-click first, delete button (conditional)
- Responsive: Desktop grid, Mobile cards

**UserList** (replace ListUserReviewed listing part)

- Props: users, statusCounts, filterStatus, onFilterChange, onUserClick
- Features: Filter tabs (Radio.Group), user cards, empty states
- Responsive: Desktop list, Mobile cards

**ReviewForm** (replace ListUserReviewed modal form)

- Props: open, user, module, onClose, onSubmit
- Features:
  - Header: Module + User info
  - Body: ReviewFormStage components (loop)
  - Overall feedback textarea
  - localStorage auto-save
  - Form validation
- Hooks: useReviewSubmission, useSubmissionReview

**ReviewFormStage** (new component, extracted from form loop)

- Props: stage, answer, index, previousAnswer, form, onValuesChange
- Features:
  - Question display (dangerouslySetInnerHTML)
  - Answer display (text/HTML/image)
  - PreviousAnswerPopover
  - Accept/Reject Radio
  - Comment TextArea (conditional required)
  - Character count

**ReviewPreview** (replace preview modal)

- Props: open, review, overallFeedback, reviewCounts, onClose
- Features:
  - Status badge
  - Overall feedback
  - Stage answers with accept/reject icons

**ReviewModals** (combine 4 modal components)

- ModalCloseFormReview
- ModalIncompleteReview
- ModalConfirmSubmitReview
- DeleteModuleModal

---

## Current Status

✅ **Completed:**

1. Folder structure created
2. API layer (reviewApi.js) created
3. Utilities created:
   - formatters.js (date, link, enter converters, canDeleteModule)
   - dataProcessing.js (FIFO/LIFO sorting, filtering, counting, processReviewData)
   - localStorage.js (getFormData, setFormData, clearFormData, generateFormKey)
4. Hooks created:
   - useModulesData.js (fetch modules)
   - useUserSubmissions.js (fetch & filter users)
   - useSubmissionReview.js (fetch current + previous submission)
   - useReviewSubmission.js (handle form submission + localStorage)

⏳ **In Progress:**

- Creating components (0/9)

❌ **Not Started:**

- Main ReviewPage
- Router configuration
- Documentation
- Testing

---

## Implementation Complexity

**Why This Is Complex:**

1. **Form State Management**
   - Dynamic field names based on reviewId and index
   - Conditional validation (required if reject)
   - Character count tracking per field
   - localStorage persistence on every change

2. **Multiple Modals**
   - Review Form (main)
   - Review Preview
   - Quit Confirmation
   - Incomplete Validation
   - Submit Confirmation
   - Delete Module Confirmation
   - Image Zoom (mobile)

3. **Previous Answer Comparison**
   - Fetch flag=0 (current) and flag=1 (previous)
   - Display in Popover (desktop) or Collapse (mobile)
   - Per answer (not per stage)

4. **Mobile vs Desktop**
   - Different routing (/reviews vs /reviews/module/:id/:journeyId)
   - Different layouts (2-column vs routing)
   - Different UI components (Popover vs Collapse)
   - Image zoom functionality

5. **Complex Filtering & Sorting**
   - 4 filter modes with different sort logic
   - FIFO for need review (fair review queue)
   - LIFO for approved/declined (recent first)
   - Mixed sorting for "All" mode

6. **Auto-behaviors**
   - Auto-click first module
   - Auto-load localStorage
   - Auto-scroll to top on modal open/close
   - Auto-update placeholder on radio change

---

## Estimated Lines of Code

**Old:** ~2,000 lines total (monolithic)
**New:** ~1,200 lines total (modular)

- reviewApi.js: 50 lines
- formatters.js: 80 lines
- dataProcessing.js: 150 lines
- localStorage.js: 50 lines
- useModulesData.js: 30 lines
- useUserSubmissions.js: 80 lines
- useSubmissionReview.js: 100 lines
- useReviewSubmission.js: 120 lines
- ModuleCard.jsx: 50 lines
- ModuleList.jsx: 100 lines
- UserCard.jsx: 40 lines
- UserList.jsx: 120 lines
- ReviewFormStage.jsx: 150 lines
- ReviewForm.jsx: 200 lines
- ReviewPreview.jsx: 150 lines
- PreviousAnswerPopover.jsx: 40 lines
- ReviewModals.jsx: 200 lines (4 modals combined)
- ReviewPage.jsx: 100 lines
- Documentation: 500 lines

**Total:** ~1,790 lines (estimated)

---

## Next Steps

**Immediate:**

1. Create ModuleCard component
2. Create ModuleList component
3. Create UserCard component
4. Create UserList component
5. Create ReviewFormStage component
6. Create ReviewForm component (most complex!)
7. Create ReviewPreview component
8. Create ReviewModals component
9. Create main ReviewPage
10. Configure routes
11. Test functionality
12. Create documentation

**Priority:** HIGH
**Complexity:** VERY HIGH (most complex feature after Leaderboards)
**Time Estimate:** 6-8 hours

---

## Key Decisions

**1. Component Splitting:**

- Split massive 1400-line component into 9 focused components
- Extract ReviewFormStage for reusability
- Combine 4 simple modals into ReviewModals

**2. State Management:**

- RTK Query for API calls & caching
- Form.useForm() for form state
- localStorage for persistence
- Local useState for UI state (modals, popovers)

**3. Mobile Strategy:**

- Same components, different layouts via props
- Routing for navigation (mobile)
- Tailwind responsive classes

**4. Performance:**

- Memoize filtered/sorted data (useMemo)
- Lazy load submission details (only when modal opens)
- Clear localStorage after submit

---

## Risk Assessment

**Risks:**

1. Form validation complexity (dynamic required fields)
2. localStorage synchronization issues
3. Previous answer fetching timing
4. Image zoom effect implementation
5. Mobile responsive layout challenges

**Mitigation:**

1. Thorough testing of validation rules
2. Clear localStorage on submit success
3. Use lazy queries for previous submissions
4. Use CSS-based zoom (existing pattern)
5. Test on multiple mobile devices

---

## Status: ⚠️ **PAUSED - AWAITING COMPONENT IMPLEMENTATION**

**Reason:** Review feature is significantly more complex than Profile/Leaderboards due to:

- Massive form with dynamic validation
- Multiple modals and states
- localStorage persistence
- Previous answer comparison
- Mobile routing complexity

**Recommendation:**
Prioritas tinggi karena Review adalah feature critical untuk Anchor role. Namun membutuhkan waktu dedicated 6-8 jam untuk implementasi lengkap mengingat kompleksitas form handling dan state management.

---

**Created:** 31 Oktober 2025  
**Status:** Architecture Complete, Components Pending  
**Completion:** 40% (API + Utilities + Hooks done, Components pending)
