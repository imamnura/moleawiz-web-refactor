# REFACTOR DOCUMENTATION - MoleaWiz Web

## 📋 Overview

Dokumentasi ini menjelaskan refactoring yang dilakukan pada project MoleaWiz Web untuk meningkatkan code quality, reusability, dan maintainability tanpa mengubah fungsionalitas atau styling yang ada.

## 🎯 Tujuan Refactor

1. **Clean Code**: Menerapkan prinsip SOLID, DRY, dan KISS
2. **Reusability**: Membuat komponen yang dapat digunakan kembali
3. **Maintainability**: Struktur kode yang mudah dipahami dan dimodifikasi
4. **Performance**: Optimasi tanpa mengubah UI/UX
5. **Type Safety**: Menambahkan PropTypes untuk validation

## 📁 Struktur Folder Refactor

```
refactor/
├── src/
│   ├── components/
│   │   ├── common/              # Komponen umum yang sering dipakai
│   │   │   ├── Loader.jsx
│   │   │   ├── PageTitle.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── modals/              # Semua modal components
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── RatingModal/
│   │   │   ├── OnboardingModal/
│   │   │   └── index.js
│   │   ├── feedback/            # Feedback components (Snackbar, Toast, dll)
│   │   │   ├── Snackbar.jsx
│   │   │   └── Alert.jsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── Footer/
│   │   └── forms/               # Form components
│   │       ├── LoginForm.jsx
│   │       └── SearchForm.jsx
│   ├── pages/
│   │   ├── auth/                # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── main/                # Main application pages
│   │   │   ├── Home/
│   │   │   ├── LearningJourney/
│   │   │   ├── ContentLibrary/
│   │   │   └── Profile/
│   │   └── filter/              # Filter/Search pages
│   ├── hooks/                   # Custom React hooks
│   │   ├── useResponsive.js
│   │   ├── useAuth.js
│   │   ├── useLocalization.js
│   │   └── useForm.js
│   ├── utils/                   # Utility functions
│   │   ├── storage.js
│   │   ├── helpers.js
│   │   └── validators.js
│   └── services/                # API services
│       └── api/
│           ├── authApi.js
│           ├── learningApi.js
│           └── rewardsApi.js
```

## 🔄 Perubahan Utama

### 1. Components

#### Before: Loader.jsx
```jsx
// Inline styles, tidak reusable
export const Loader = () => {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        // ... banyak inline styles
      }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
};
```

#### After: Loader.jsx
```jsx
// Reusable, configurable, dengan PropTypes
export const Loader = ({ 
  fullScreen = true, 
  size = 48, 
  color = ColorPrimary 
}) => {
  const loaderStyle = fullScreen ? {...} : {...}
  
  return <div style={loaderStyle}>...</div>
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
}
```

**Keuntungan:**
- ✅ Dapat digunakan di berbagai tempat dengan konfigurasi berbeda
- ✅ PropTypes untuk type checking
- ✅ Default values yang sensible
- ✅ Lebih mudah di-test

### 2. Custom Hooks

#### Before: Responsive Logic di setiap component
```jsx
// Duplikasi di banyak file
const screens = useBreakpoint();
const isScallingVersion = 
  (window.innerWidth <= 991 && window.innerWidth >= 768) || 
  window.innerWidth === 581;
const isMobileVersion = screens.xs || isScallingVersion;
```

#### After: useResponsive Hook
```jsx
// Satu hook, dipakai di mana-mana
const { isMobile, isTablet, isDesktop, width } = useResponsive()
```

**Keuntungan:**
- ✅ DRY - Logic hanya di satu tempat
- ✅ Consistent behavior di semua komponen
- ✅ Mudah di-test dan di-maintain
- ✅ Auto cleanup dengan useEffect

### 3. Modal Components

#### Before: ModalConfirm.jsx
```jsx
// Banyak inline logic dan style
const ModalConfirm = ({ isOpen, setIsOpen, handleModal, message }) => {
  const screens = useBreakpoint();
  // ... logic responsive di dalam component
  
  return (
    <Modal>
      <Button onClick={() => setIsOpen(!isOpen)}>No</Button>
      <Button onClick={() => handleModal()}>Yes</Button>
    </Modal>
  )
}
```

#### After: ConfirmationModal.jsx
```jsx
// Clean, reusable, menggunakan hooks
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message,
  confirmText,
  cancelText 
}) => {
  const { isMobile } = useResponsive()
  
  return (
    <Modal>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button onClick={onConfirm}>{confirmText}</Button>
    </Modal>
  )
}
```

**Keuntungan:**
- ✅ Consistent naming (onClose, onConfirm)
- ✅ Customizable text
- ✅ Menggunakan custom hooks
- ✅ Better separation of concerns

## 🎨 Pattern & Best Practices

### 1. Component Structure

```jsx
// 1. Imports
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

// 2. Constants
const DURATION = 3000
const DEFAULT_SIZE = 48

// 3. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3.1 Hooks
  const { t } = useTranslation()
  const [state, setState] = useState(null)
  
  // 3.2 Computed values
  const computedValue = useMemo(() => {...}, [dependency])
  
  // 3.3 Callbacks
  const handleClick = useCallback(() => {...}, [])
  
  // 3.4 Effects
  useEffect(() => {...}, [])
  
  // 3.5 Render
  return <div>...</div>
}

// 4. PropTypes
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

// 5. Default Props (if needed)
MyComponent.defaultProps = {
  prop2: 100,
}

// 6. Export
export default MyComponent
```

### 2. Naming Conventions

#### Components
- **PascalCase**: `UserProfile.jsx`, `LoginForm.jsx`
- **Descriptive**: `ConfirmationModal.jsx` bukan `Modal1.jsx`

#### Functions
- **camelCase**: `handleSubmit`, `getUserData`
- **Verbs first**: `fetchUser`, `validateForm`, `calculateTotal`

#### Event Handlers
- **on-prefix for props**: `onClick`, `onClose`, `onSubmit`
- **handle-prefix for methods**: `handleClick`, `handleClose`, `handleSubmit`

#### Boolean Props
- **is/has prefix**: `isLoading`, `hasError`, `isDisabled`

#### Hooks
- **use-prefix**: `useAuth`, `useResponsive`, `useForm`

### 3. File Organization

#### Group by Feature
```
pages/
├── LearningJourney/
│   ├── index.jsx              # Main component
│   ├── styles.js              # Styled components (if any)
│   ├── hooks/                 # Feature-specific hooks
│   │   ├── useLearningData.js
│   │   └── useProgress.js
│   ├── components/            # Feature-specific components
│   │   ├── CourseCard.jsx
│   │   └── ModuleList.jsx
│   └── utils/                 # Feature-specific utils
│       └── helpers.js
```

### 4. Props Destructuring

#### Before
```jsx
const Component = (props) => {
  return <div>{props.title} - {props.description}</div>
}
```

#### After
```jsx
const Component = ({ title, description }) => {
  return <div>{title} - {description}</div>
}
```

### 5. Conditional Rendering

#### Before
```jsx
{condition === true ? <Component /> : null}
{condition === false ? null : <Component />}
```

#### After
```jsx
{condition && <Component />}
{!condition && <Component />}
```

### 6. State Management

#### Before (Multiple useState)
```jsx
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')
```

#### After (Object State)
```jsx
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Update
setFormData(prev => ({ ...prev, email: 'new@email.com' }))
```

### 7. useEffect Cleanup

#### Before
```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])
```

#### After
```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## 📝 Checklist Refactor

### Component Refactor
- [ ] Hapus kode duplikat
- [ ] Extract inline styles ke constants/objects
- [ ] Pisahkan business logic ke custom hooks
- [ ] Tambahkan PropTypes
- [ ] Tambahkan default props jika perlu
- [ ] Gunakan useCallback untuk event handlers
- [ ] Gunakan useMemo untuk computed values
- [ ] Cleanup useEffect
- [ ] Consistent naming conventions

### Page Refactor
- [ ] Break down ke smaller components
- [ ] Extract data fetching ke custom hooks/services
- [ ] Consistent error handling
- [ ] Loading states
- [ ] Accessibility (a11y)
- [ ] SEO optimization (if applicable)

### Hook Refactor
- [ ] Single responsibility
- [ ] Reusable across components
- [ ] Proper cleanup
- [ ] Documented parameters and return values

## 🧪 Testing Guidelines

### Component Testing
```jsx
// Component
export const Button = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// Test
describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 🚀 Performance Optimization

### 1. React.memo for Expensive Components
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{data}</div>
}, (prevProps, nextProps) => {
  // Return true if passing nextProps to render would return
  // the same result as passing prevProps to render
  return prevProps.data === nextProps.data
})
```

### 2. useCallback for Callbacks
```jsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency])
```

### 3. useMemo for Expensive Calculations
```jsx
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])
```

### 4. Code Splitting
```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## 📖 Migration Guide

### Step 1: Backup
```bash
git checkout -b refactor-backup
git add .
git commit -m "Backup before refactor"
```

### Step 2: Update Imports
```jsx
// Old
import { Loader } from '../../components/Loader'
import HomeTitle from '../../components/HomeTitle/index'

// New
import { Loader } from '@/components/common/Loader'
import PageTitle from '@/components/common/PageTitle'
```

### Step 3: Update Component Usage
```jsx
// Old
<HomeTitle 
  textTitle="My Title" 
  isMobileVersion={isMobileVersion}
/>

// New
<PageTitle 
  title="My Title" 
  isMobile={isMobile}
/>
```

### Step 4: Update Custom Hooks
```jsx
// Old
const screens = useBreakpoint()
const isMobileVersion = screens.xs || ...

// New
const { isMobile } = useResponsive()
```

## 🎯 Next Steps

1. **Refactor Auth Pages**
   - Login.jsx ✅
   - ForgotPassword.jsx
   - ChangePassword.jsx
   - TemporaryPassword.jsx

2. **Refactor Common Components**
   - Loader.jsx ✅
   - PageTitle.jsx ✅
   - ConfirmationModal.jsx ✅
   - Snackbar.jsx ✅
   - Header
   - Sidebar
   - Footer

3. **Refactor Main Pages**
   - Home
   - LearningJourney
   - ContentLibrary
   - Profile
   - Rewards
   - Reviews

4. **Create Custom Hooks**
   - useResponsive.js ✅
   - useAuth.js
   - useForm.js
   - usePagination.js
   - useDebounce.js

5. **Documentation**
   - Component documentation
   - Hook documentation
   - API documentation
   - Storybook (optional)

## 📚 Resources

- [React Best Practices](https://react.dev/learn)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Patterns](https://reactpatterns.com/)
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)

## 🤝 Contributing

Saat melakukan refactor baru:

1. Follow structure dan pattern yang sudah ada
2. Tambahkan PropTypes
3. Dokumentasikan complex logic
4. Test di mobile dan desktop
5. Pastikan tidak ada breaking changes
6. Update dokumentasi ini jika ada pattern baru

---

**Last Updated**: 30 October 2025
**Version**: 1.0.0
**Maintainer**: Development Team
