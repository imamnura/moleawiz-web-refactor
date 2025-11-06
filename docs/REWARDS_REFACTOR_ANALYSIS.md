# Rewards Feature - Refactor Analysis

## Old Implementation Overview

### File Structure

```
src/pages/main/contents/Rewards/
├── index.jsx                    # Main rewards page (370 lines)
├── constant.js                  # Constants
├── styles.js                    # Inline styles
├── hooks/
│   └── useActions.js           # Main hooks (160 lines)
├── page/
│   └── RewardHistory/
│       ├── index.jsx           # History page (370 lines)
│       └── hooks/
│           └── useActions.js   # History hooks (40 lines)
└── verification/
    ├── OtpVerification.jsx     # OTP modal (270 lines)
    ├── ModalRewardUnavailable.jsx  # Out of stock modal (60 lines)
    ├── styles.js               # OTP styles
    └── hooks/
        └── useActions.js       # OTP hooks (160 lines)

Total: ~1,200+ lines
```

### Features Analysis

#### 1. Main Rewards Page (index.jsx - 370 lines)

**Header Section:**

- Title: "Exciting Rewards"
- Current Balance display (desktop: right side, mobile: below title)
- Redeem History button (desktop: button, mobile: icon)

**Reward List:**

- Grid layout (desktop: flex start, mobile: flex center)
- Card per reward with:
  - Image thumbnail (228x156 desktop, 100%x115 mobile)
  - Title (2-line ellipsis)
  - Points needed (with tag icon)
  - Availability count (with package icon)
  - Redeem button (desktop only)
- Empty state: "Rewards not available" message
- Loader component

**Detail Modal:**

- Width: 809px desktop, 90% mobile
- Layout: 2-column (image left, details right) desktop, stacked mobile
- Image: 353x243 desktop, 100%x218 mobile
- Content:
  - Title
  - Description (pre-wrap text)
  - Calculation section:
    - Current balance
    - Redeem with (points deducted in red)
    - New balance OR "Not enough points" warning
  - Buttons:
    - Cancel (secondary)
    - Redeem (primary, disabled if not enough points)

**State Management:**

- isOpenModalDetailRewards
- isOpenModalVerif
- redeemRewardId
- loadingClickRedeem
- expiredDate, sendDate
- descReward

**Data Flow:**

```
fetchListRewards (on mount + refetch)
  → GET /rewards
  → setListDataRewards

clickListRedeem(reward_id)
  → fetchDetailRewards(reward_id)
    → GET /rewards/:id
    → setDetailRewards
    → setIsOpenModalDetailRewards(true)

redeemAction()
  → fetchUserProfileReward()
    → GET /profile
    → fetchUserDetailProfileDataReward(userid)
      → GET /profile/:userid/detail
      → handleCheckUsernameReward(username)
        → POST /check_username
        → setIsOpenModalVerif(true)
        → setExpiredDate, setSendDate
```

---

#### 2. OTP Verification (OtpVerification.jsx - 270 lines)

**Modal Content:**

- Title: "Verify your account"
- Message: "Please enter verification code sent to your email"
- Email display (with icon)
- Countdown timer (shows time remaining)
- OTP input field (6 digits, number only)
- Error alert (if wrong code or expired)
- Buttons:
  - Desktop: Verify button + Back link
  - Mobile: Back + Verify buttons (row)

**OTP Flow:**

```
handleVerifyOTP()
  → POST /verify-otp
    → Success:
      - fetchRedeemRewards()
        → POST /redeem/:rewardId
        → Response:
          - If success: Open ModalEarnRewards
          - If out of stock: Open ModalRewardUnavailable
    → Error (401):
      - "Too Many Validation Fails!" → Show request code button
      - Incorrect code → Show error message

handleVerifyRequest()
  → POST /check_username
  → Get new verification code
  → Reset timer
  → Show input field again
```

**Countdown Logic:**

- Calculate time: `expiredDate - sendDate`
- Renderer: Shows MM:SS format
- On complete: Hide input, show "Request code" button

---

#### 3. Reward History (RewardHistory/index.jsx - 370 lines)

**Desktop Layout:**

- Title: "Redeem History"
- Table with columns:
  - Date & Time (DD MMM YYYY HH:mm)
  - Product (title, 2-line ellipsis)
  - Points (negative, right-aligned, red color)
  - Redeem Code (with copy button)
- Empty state: "No rewards redeemed yet"

**Mobile Layout:**

- Card list with:
  - Title (2-line ellipsis)
  - Date + Time, Points (row)
  - Divider
  - Redeem code + copy button
- Empty state with icon

**Copy to Clipboard:**

- Uses `navigator.clipboard.writeText()`
- Fallback for older browsers
- Shows snackbar: "Redeem code copied"

**Data Flow:**

```
fetchListRewardsHistory (on mount)
  → GET /rewards/history
  → setListHistoryReward

manipulateDataTable()
  → Transform data for table
  → Add copy functionality per row
```

---

#### 4. Modals

**ModalEarnRewards (components/ModalEarnRewards.jsx):**

- Header image (EN/ID localized)
- Rotating light animation
- Product image (120x120, centered)
- Redeem code display (large, bold)
- Copy button
- Actions:
  - View History button (secondary)
  - Close button (primary)
- Uses Redux state: `isOpenModalEarnReward`, `objDataRedeemReward`

**ModalRewardUnavailable:**

- Out of stock icon
- Title: "Reward Out of Stock"
- Message: "You were late claiming this reward. Someone already claimed it."
- OK button
- Triggers refetch on close

---

### API Endpoints (Inferred)

1. **GET /rewards** - List all available rewards
2. **GET /rewards/:id** - Get reward detail
3. **POST /check_username** - Verify username and send OTP
4. **POST /verify-otp** - Verify OTP code
5. **POST /redeem/:rewardId** - Redeem reward
6. **GET /rewards/history** - Get redeem history
7. **GET /profile** - Get user profile
8. **GET /profile/:userid/detail** - Get user detail

---

### Redux State (rewards slice)

```javascript
{
  currBalance: number,              // Current learning points
  isOpenModalEarnReward: boolean,   // Show success modal
  objDataRedeemReward: {            // Redeemed reward data
    id: number,
    title: string,
    image: string,
    redeem_code: string
  },
  isCopy: boolean,                  // Copy success flag
  snackMessage: string,             // Snackbar message
  isOpenSnack: boolean,             // Show snackbar
  snackBarTime: number,             // Snackbar duration
  refetchBalanceProfile: boolean    // Trigger balance refetch
}
```

---

### Styling Patterns

**Desktop:**

- Top section: 136px height, blue background gradient
- Current balance: 304px width, rounded-16
- History button: 205px width
- Card width: 228px
- Modal: 809px width (detail), 422px (earn), 420px (unavailable), 432px (OTP)

**Mobile:**

- Padding: 18px
- Card width: 47%
- Modal width: 90%
- Flex column layouts
- Bottom buttons full width

**Colors:**

- Primary: #0066CC
- Secondary: #E6F2FF
- Red (points): #D32F2F
- Text desc: #757575
- Card shadow: 3px 0 16px rgba(0, 0, 0, 0.1)

---

### Complex Features

1. **Image Zoom on Hover (Desktop Detail Modal):**
   - Uses CSS custom properties --x and --y
   - onmousemove event tracking
   - Background image positioning

2. **OTP Countdown Timer:**
   - Uses `react-countdown` library
   - Dynamic time calculation
   - Auto-disable on expire

3. **Copy to Clipboard:**
   - Modern API + fallback
   - Hidden input element technique
   - Selection range for mobile

4. **Dynamic Validation:**
   - Disable redeem if insufficient points
   - OTP input: number only, no e/+/-/./`,`
   - Auto-refetch on modal close

5. **Nested Modal Flow:**
   - Detail → OTP → Earn/Unavailable
   - Back button navigation
   - State cleanup on close

---

### Dependencies

**External:**

- antd (ConfigProvider, Row, Col, Image, Card, Button, Flex, Modal, Divider, Table, Form, Input, Alert, Rate)
- react-router-dom (Link, useNavigate, useOutletContext)
- react-redux (useDispatch, useSelector)
- react-countdown
- moment (date formatting)
- @ant-design/icons (RightOutlined, WarningFilled, CloseOutlined, SearchOutlined, DownOutlined, UpOutlined)

**Internal:**

- Loader component
- HomeTitle component
- ModalEarnRewards component
- Redux slices (rewards, invalidToken)
- API repositories
- Assets (SVG icons, images)

---

### Refactor Goals

1. **Modularity:**
   - Extract RewardCard component
   - Extract RewardDetailModal component
   - Extract OTPModal component
   - Extract HistoryTable/List components

2. **RTK Query:**
   - Replace manual API calls
   - Auto-caching
   - Optimistic updates
   - Tag invalidation

3. **Tailwind CSS:**
   - Replace inline styles
   - Responsive utilities
   - Consistent spacing

4. **Hooks:**
   - useRewards (list + detail)
   - useRewardHistory
   - useRedeemFlow (OTP + submit)
   - Custom countdown hook

5. **State Management:**
   - Remove unnecessary Redux state
   - Local state for modals
   - Form state management

6. **Utilities:**
   - formatPoints (number with dots)
   - formatDate (moment wrapper)
   - copyToClipboard (with fallback)
   - convertEnter (text formatting)

7. **Testing:**
   - Component tests
   - Hook tests
   - API integration tests

---

### Estimated Complexity

**High Complexity:**

- OTP verification flow (3 API calls + timer)
- Copy to clipboard (browser compatibility)
- Nested modal navigation

**Medium Complexity:**

- Reward detail modal
- History table/list
- Image zoom hover effect

**Low Complexity:**

- Reward card list
- Success modals
- Point balance display

---

### Migration Checklist

- [ ] Create API layer (rewardsApi.js - 6 endpoints)
- [ ] Create utilities (formatters, clipboard, timer)
- [ ] Create hooks (useRewards, useRewardHistory, useRedeemFlow)
- [ ] Create components:
  - [ ] RewardCard.jsx
  - [ ] RewardList.jsx
  - [ ] RewardDetailModal.jsx
  - [ ] OTPVerificationModal.jsx
  - [ ] RewardSuccessModal.jsx
  - [ ] RewardUnavailableModal.jsx
  - [ ] HistoryTable.jsx (desktop)
  - [ ] HistoryList.jsx (mobile)
- [ ] Create main pages:
  - [ ] RewardsPage.jsx
  - [ ] RewardHistoryPage.jsx
- [ ] Configure routes
- [ ] Test all flows
- [ ] Documentation

---

## Next Steps

1. Create comprehensive architecture plan
2. Build API layer with RTK Query
3. Create utility functions
4. Build custom hooks
5. Create all components
6. Integrate into main pages
7. Configure routes
8. Test and verify
