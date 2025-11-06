# 🚀 Migration Checklist - Auth Pages

Quick guide untuk migrate dari old code ke refactored code.

## 📋 Prerequisites

- [x] `@tanstack/react-query` installed
- [x] `@tanstack/react-query-devtools` installed (dev)
- [x] QueryClientProvider setup di main.jsx
- [x] API hooks created
- [x] All auth pages refactored

## 🔄 Migration Steps

### 1. Update main.jsx atau App.jsx

**Replace:**
```javascript
// OLD
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './pages/App'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
```

**With:**
```javascript
// NEW
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './pages/App'
import { store } from './redux/store'
import { queryClient } from './config/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  </Provider>
)
```

### 2. Copy Refactored Files

```bash
# Copy dari folder refactor ke src
cp -r refactor/src/config/queryClient.js src/config/
cp -r refactor/src/api/hooks.js src/api/
cp -r refactor/src/hooks/useCountdown.js src/hooks/
cp -r refactor/src/hooks/useOTPVerification.js src/hooks/
cp -r refactor/src/pages/auth/* src/pages/auth/
cp -r refactor/src/main.jsx src/
```

### 3. Update Imports in App Routes

**OLD:**
```javascript
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
// ... etc
```

**NEW:**
```javascript
import {
  Login,
  ForgotPassword,
  ChangePassword,
  TemporaryPassword,
  AutoLogin,
  CallbackLogin,
  RequireAuth,
  NotFound
} from './pages/auth'
```

### 4. Test Each Page

- [ ] Login page works
- [ ] Microsoft SSO works
- [ ] Forgot Password flow works
- [ ] OTP verification works
- [ ] Change Password works
- [ ] Temporary Password flow works
- [ ] Auto Login works
- [ ] Callback Login works
- [ ] 404 page works
- [ ] Protected routes work

### 5. Check React Query Devtools

1. Open app in development mode
2. Look for floating React Query icon (bottom-right)
3. Click to open devtools
4. Verify queries are running
5. Check cache status

### 6. Common Issues & Solutions

#### Issue: "queryClient is not defined"

**Solution:**
```javascript
// Make sure you imported queryClient
import { queryClient } from '@/config/queryClient'
```

#### Issue: "useXXX is not a function"

**Solution:**
```javascript
// Check import path
import { useLogin } from '@/api/hooks' // ✅ Correct
import { useLogin } from '@/api/repositories' // ❌ Wrong
```

#### Issue: "mutations not working"

**Solution:**
```javascript
// Make sure QueryClientProvider wraps your app
<QueryClientProvider client={queryClient}>
  <YourApp />
</QueryClientProvider>
```

#### Issue: "Invalid token not detected"

**Solution:**
```javascript
// Check if setInvalidToken is dispatched in API hooks
dispatch(setInvalidToken(response.status))
```

## 📝 Code Comparison Examples

### Login

**OLD:**
```javascript
const [loading, setLoading] = useState(false)

const handleLogin = async () => {
  setLoading(true)
  try {
    const { data, status } = await LoginApp({ data: payload })
    if (status === 200) {
      // success
    }
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}
```

**NEW:**
```javascript
const loginMutation = useLogin()

const handleLogin = () => {
  loginMutation.mutate(payload, {
    onSuccess: (data) => { /* success */ },
    onError: (error) => setError(error.message)
  })
}

const loading = loginMutation.isLoading
```

### Check Username

**OLD:**
```javascript
const handleCheck = async () => {
  setLoading(true)
  try {
    const { data, status } = await checkUsername({
      data: { username, check_username_type: 'otp' }
    })
    dispatch(setInvalidToken(status))
    if (status === 200) {
      // success
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

**NEW:**
```javascript
const checkUsernameMutation = useCheckUsername()

const handleCheck = () => {
  checkUsernameMutation.mutate(
    { username, check_username_type: 'otp' },
    {
      onSuccess: (data) => { /* success */ },
      onError: (err) => setError(err.message)
    }
  )
}

const loading = checkUsernameMutation.isLoading
```

## ✅ Verification Checklist

After migration, verify:

- [ ] No console errors
- [ ] Login works correctly
- [ ] Forgot password sends OTP
- [ ] OTP verification works
- [ ] Change password works
- [ ] Temporary password works
- [ ] Auto login works
- [ ] Protected routes redirect to login when unauthenticated
- [ ] React Query Devtools shows queries
- [ ] No memory leaks (check Network tab)
- [ ] Loading states work properly
- [ ] Error messages display correctly

## 🎯 Performance Checks

- [ ] First page load < 3s
- [ ] API calls are cached (check React Query Devtools)
- [ ] No unnecessary re-renders
- [ ] Network tab shows proper caching
- [ ] No duplicate API calls

## 📚 Documentation

- [x] AUTH_REFACTOR_COMPLETE.md - Complete auth refactor docs
- [x] REFACTOR_GUIDE.md - General refactor patterns
- [x] QUICK_START.md - Quick usage examples
- [x] COMPARISON.md - Before/after examples
- [x] This file - Migration checklist

## 🆘 Need Help?

Check these files:
1. `AUTH_REFACTOR_COMPLETE.md` - Comprehensive auth docs
2. `QUICK_START.md` - Usage examples
3. `COMPARISON.md` - Before/after code
4. API hooks JSDoc comments

## 🎉 Success Criteria

Migration is successful when:
- ✅ All auth pages work without errors
- ✅ React Query Devtools shows cached queries
- ✅ No console errors or warnings
- ✅ Loading states work properly
- ✅ Error handling works correctly
- ✅ Performance is same or better
- ✅ Code is cleaner and more maintainable

---

**Happy Migrating! 🚀**
