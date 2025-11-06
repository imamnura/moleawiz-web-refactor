# QUICK START GUIDE - Refactored Code

## 🚀 Getting Started

Panduan cepat untuk mulai menggunakan komponen dan hooks yang sudah di-refactor.

## 📦 Installation

1. **Copy folder refactor** ke root project Anda
2. **Update vite.config.js** untuk path aliases:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

3. **Install dependencies** (jika belum):
```bash
npm install prop-types
```

## 🎯 Usage Examples

### 1. Using Loader Component

```jsx
import { Loader } from '@/components/common'

// Full screen loader (default)
<Loader />

// Inline loader
<Loader fullScreen={false} />

// Custom size and color
<Loader size={32} color="#FF5733" />

// Small inline loader
<Loader fullScreen={false} size={24} />
```

### 2. Using PageTitle Component

```jsx
import PageTitle from '@/components/common/PageTitle'

// Basic usage
<PageTitle title="My Learning Journey" />

// With mobile responsive
const { isMobile } = useResponsive()
<PageTitle title="Dashboard" isMobile={isMobile} />

// Full width title
<PageTitle title="Profile" span={24} />

// Custom styling
<PageTitle 
  title="Custom Title" 
  style={{ color: '#FF0000', fontSize: '24px' }}
/>
```

### 3. Using ConfirmationModal

```jsx
import { ConfirmationModal } from '@/components/modals'
import { useToggle } from '@/hooks'

function MyComponent() {
  const [isOpen, toggle] = useToggle(false)

  const handleDelete = () => {
    // Delete logic here
    toggle() // Close modal
  }

  return (
    <>
      <button onClick={toggle}>Delete Item</button>
      
      <ConfirmationModal
        isOpen={isOpen}
        onClose={toggle}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}
```

### 4. Using Snackbar

```jsx
import Snackbar from '@/components/feedback/Snackbar'
import { useToggle, useResponsive } from '@/hooks'

function MyComponent() {
  const [showSnack, toggleSnack] = useToggle(false)
  const { isMobile } = useResponsive()

  const handleSuccess = () => {
    toggleSnack()
  }

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      
      <Snackbar
        message="Operation successful!"
        isOpen={showSnack}
        onClose={toggleSnack}
        isMobile={isMobile}
        duration={3000}
      />
    </>
  )
}
```

### 5. Using useResponsive Hook

```jsx
import { useResponsive } from '@/hooks'

function MyComponent() {
  const { 
    isMobile, 
    isTablet, 
    isDesktop,
    width,
    height 
  } = useResponsive()

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
      
      <p>Screen width: {width}px</p>
    </div>
  )
}
```

### 6. Using useForm Hook

```jsx
import { useForm } from '@/hooks'

function LoginForm() {
  const validate = (values) => {
    const errors = {}
    
    if (!values.username) {
      errors.username = 'Username is required'
    }
    
    if (!values.password) {
      errors.password = 'Password is required'
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    return errors
  }

  const handleLogin = async (values) => {
    console.log('Login with:', values)
    // API call here
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    { username: '', password: '' },
    handleLogin,
    validate
  )

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### 7. Using useDebounce Hook

```jsx
import { useState } from 'react'
import { useDebounce } from '@/hooks'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  // This effect runs only when debouncedSearch changes
  useEffect(() => {
    if (debouncedSearch) {
      // API call here
      console.log('Searching for:', debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### 8. Using usePagination Hook

```jsx
import { usePagination } from '@/hooks'

function DataTable({ data }) {
  const {
    currentData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(data, 10) // 10 items per page

  return (
    <div>
      {/* Data */}
      <table>
        <tbody>
          {currentData.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={!hasPrevPage}>
          Previous
        </button>
        
        <span>
          Page {currentPage} of {totalPages}
        </span>
        
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}
```

### 9. Using useToggle Hook

```jsx
import { useToggle } from '@/hooks'

function MyComponent() {
  const [isOpen, toggle, setIsOpen] = useToggle(false)

  return (
    <div>
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <button onClick={() => setIsOpen(false)}>Close Modal</button>
      
      {isOpen && <Modal onClose={toggle} />}
    </div>
  )
}
```

### 10. Using useLocalStorage Hook

```jsx
import { useLocalStorage } from '@/hooks'

function ThemeSelector() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  return (
    <div>
      <p>Current theme: {theme}</p>
      
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  )
}
```

## 🎨 Import Patterns

### Single Import
```jsx
import { Loader } from '@/components/common'
import { useResponsive } from '@/hooks'
```

### Multiple Imports
```jsx
import { Loader, PageTitle } from '@/components/common'
import { ConfirmationModal, RatingModal } from '@/components/modals'
import { useResponsive, useToggle, useForm } from '@/hooks'
```

### Default Import
```jsx
import PageTitle from '@/components/common/PageTitle'
import Snackbar from '@/components/feedback/Snackbar'
```

## 🛠️ Common Patterns

### Pattern 1: Modal with Toggle

```jsx
import { ConfirmationModal } from '@/components/modals'
import { useToggle } from '@/hooks'

function DeleteButton({ onDelete }) {
  const [showConfirm, toggle] = useToggle(false)

  const handleConfirm = () => {
    onDelete()
    toggle()
  }

  return (
    <>
      <button onClick={toggle}>Delete</button>
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={toggle}
        onConfirm={handleConfirm}
        message="Delete this item?"
      />
    </>
  )
}
```

### Pattern 2: Responsive Component

```jsx
import { useResponsive } from '@/hooks'

function ResponsiveCard() {
  const { isMobile } = useResponsive()

  return (
    <div className={isMobile ? 'card-mobile' : 'card-desktop'}>
      {isMobile ? <MobileContent /> : <DesktopContent />}
    </div>
  )
}
```

### Pattern 3: Form with Validation

```jsx
import { useForm } from '@/hooks'
import { Loader } from '@/components/common'

function MyForm() {
  const validate = (values) => {
    // Validation logic
  }

  const handleSubmit = async (values) => {
    // Submit logic
  }

  const form = useForm({ name: '', email: '' }, handleSubmit, validate)

  if (form.isSubmitting) return <Loader fullScreen={false} />

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Pattern 4: Search with Debounce

```jsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks'
import { Loader } from '@/components/common'

function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true)
      fetchResults(debouncedQuery).then(data => {
        setResults(data)
        setLoading(false)
      })
    }
  }, [debouncedQuery])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <Loader fullScreen={false} size={24} />}
      {results.map(result => <div key={result.id}>{result.name}</div>)}
    </div>
  )
}
```

## 📚 Best Practices

### 1. Always Use Hooks at Top Level
```jsx
// ✅ Good
function MyComponent() {
  const { isMobile } = useResponsive()
  const [isOpen, toggle] = useToggle()
  
  return <div>...</div>
}

// ❌ Bad
function MyComponent() {
  if (condition) {
    const { isMobile } = useResponsive() // ❌ Don't do this
  }
  
  return <div>...</div>
}
```

### 2. Destructure What You Need
```jsx
// ✅ Good - only take what you need
const { isMobile, width } = useResponsive()

// ❌ Not ideal - taking everything
const responsive = useResponsive()
// Then: responsive.isMobile, responsive.width, etc.
```

### 3. Use PropTypes
```jsx
import PropTypes from 'prop-types'

function MyComponent({ title, count }) {
  return <div>{title}: {count}</div>
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
}
```

### 4. Provide Default Props
```jsx
function MyComponent({ size = 48, color = '#000000' }) {
  return <div style={{ fontSize: size, color }}>...</div>
}
```

## 🐛 Troubleshooting

### Issue: "Cannot resolve module '@/components'"
**Solution**: Make sure vite.config.js has path aliases configured

### Issue: "Hook called outside component"
**Solution**: Only call hooks at the top level of functional components

### Issue: "PropTypes warning"
**Solution**: Install prop-types: `npm install prop-types`

### Issue: "Window is not defined"
**Solution**: Check for SSR. Use `typeof window !== 'undefined'`

## 🎓 Learning Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [PropTypes Documentation](https://github.com/facebook/prop-types)

## 💡 Tips

1. **Start Small**: Begin with one component/hook at a time
2. **Test Thoroughly**: Test on mobile and desktop
3. **Read Documentation**: Check REFACTOR_GUIDE.md for details
4. **Use DevTools**: React DevTools shows prop types
5. **Stay Consistent**: Follow established patterns

---

**Need Help?** Check REFACTOR_GUIDE.md or COMPARISON.md for more examples.

**Last Updated**: 30 October 2025
