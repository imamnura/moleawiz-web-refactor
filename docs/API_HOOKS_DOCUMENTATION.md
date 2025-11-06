# API Hooks Documentation

Complete reference untuk semua API hooks menggunakan TanStack Query.

## 📚 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Available Hooks](#available-hooks)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Overview

API hooks menggunakan **TanStack Query** (React Query) untuk:
- ✅ Automatic caching
- ✅ Automatic retry on failure
- ✅ Loading & error states
- ✅ Optimistic updates
- ✅ Background refetching

## Setup

Pastikan `QueryClientProvider` sudah di-setup di `main.jsx`:

```javascript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## Available Hooks

| Hook | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| `useCheckUsername` | POST | `/check_username` | Check username & request OTP |
| `useVerifyOTP` | POST | `/otp_verification` | Verify OTP code |
| `useLogin` | POST | `/login` | Auth0 login |
| `useChangePassword` | POST | `/user/password` | Change password |
| `useResetPassword` | POST | `/recover_password_email` | Reset password |
| `useSendTempPassword` | POST | `/recover_password_email` | Send temporary password |
| `useAutoLogin` | POST | `/auth/login` | Auto login with token |
| `useLogout` | GET | `/user/logout` | Logout & clear cache |

---

## Usage Examples

### 1. useCheckUsername

Check username dan request OTP untuk forgot password flow.

**Import:**
```javascript
import { useCheckUsername } from '@/api/hooks'
```

**Usage:**
```javascript
const CheckUsernameComponent = () => {
  const checkUsernameMutation = useCheckUsername()

  const handleCheck = () => {
    checkUsernameMutation.mutate(
      {
        username: 'user@example.com',
        check_username_type: 'otp' // or 'password'
      },
      {
        onSuccess: (data) => {
          console.log('OTP sent!', data)
          // data.data.verification_code_expired_datetime
          // data.data.verification_code_send_datetime
        },
        onError: (error) => {
          console.error('Failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleCheck}
      disabled={checkUsernameMutation.isLoading}
    >
      {checkUsernameMutation.isLoading ? 'Checking...' : 'Check Username'}
    </button>
  )
}
```

**Response Structure:**
```javascript
{
  status: 200,
  data: {
    username: 'user@example.com',
    verification_code_expired_datetime: '2025-10-30T12:00:00',
    verification_code_send_datetime: '2025-10-30T11:55:00'
  }
}
```

---

### 2. useVerifyOTP

Verify OTP code yang diterima user.

**Import:**
```javascript
import { useVerifyOTP } from '@/api/hooks'
```

**Usage:**
```javascript
const VerifyOTPComponent = () => {
  const verifyOTPMutation = useVerifyOTP()
  const [otp, setOTP] = useState('')

  const handleVerify = () => {
    verifyOTPMutation.mutate(
      {
        username: 'user@example.com',
        otp: otp,
        firebase_token: '1',
        brand: '1',
        model: '1',
        serial_number: '1',
        platform: '1',
        version: '1'
      },
      {
        onSuccess: (data) => {
          const token = data.data.user.token
          const fullname = `${data.data.firstname} ${data.data.lastname}`
          console.log('Verified!', token, fullname)
        },
        onError: (error) => {
          console.error('Invalid OTP:', error.message)
        }
      }
    )
  }

  return (
    <>
      <input 
        value={otp} 
        onChange={(e) => setOTP(e.target.value)}
        placeholder="Enter OTP"
      />
      <button 
        onClick={handleVerify}
        disabled={verifyOTPMutation.isLoading}
      >
        {verifyOTPMutation.isLoading ? 'Verifying...' : 'Verify'}
      </button>
    </>
  )
}
```

**Response Structure:**
```javascript
{
  status: 200,
  data: {
    user: { token: 'xxx' },
    firstname: 'John',
    lastname: 'Doe'
  }
}
```

---

### 3. useLogin

Login dengan Auth0 atau credentials.

**Import:**
```javascript
import { useLogin } from '@/api/hooks'
```

**Usage:**
```javascript
const LoginComponent = () => {
  const loginMutation = useLogin()

  const handleLogin = () => {
    loginMutation.mutate(
      {
        username: 'user@example.com',
        password: 'password123',
        firebase_token: '',
        brand: '',
        model: '',
        serial_number: '',
        platform: 'Web',
        version: ''
      },
      {
        onSuccess: (data) => {
          const token = data.data.user.token
          const fullname = `${data.data.firstname} ${data.data.lastname}`
          
          // Save to localStorage
          setAccessToken(token)
          setFullname(fullname)
          
          // Navigate
          navigate('/home')
        },
        onError: (error) => {
          console.error('Login failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleLogin}
      disabled={loginMutation.isLoading}
    >
      {loginMutation.isLoading ? 'Logging in...' : 'Login'}
    </button>
  )
}
```

---

### 4. useChangePassword

Change user password.

**Import:**
```javascript
import { useChangePassword } from '@/api/hooks'
```

**Usage:**
```javascript
const ChangePasswordComponent = () => {
  const changePasswordMutation = useChangePassword()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange = () => {
    changePasswordMutation.mutate(
      {
        data: {
          password: password,
          password_confirmation: confirmPassword,
          change_password_type: 'temporary' // or 'manual'
        },
        token: getAccessToken()
      },
      {
        onSuccess: (data) => {
          console.log('Password changed!')
          navigate('/login')
        },
        onError: (error) => {
          console.error('Failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleChange}
      disabled={changePasswordMutation.isLoading}
    >
      {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
    </button>
  )
}
```

---

### 5. useResetPassword

Reset password (forgot password flow).

**Import:**
```javascript
import { useResetPassword } from '@/api/hooks'
```

**Usage:**
```javascript
const ResetPasswordComponent = () => {
  const resetPasswordMutation = useResetPassword()

  const handleReset = () => {
    resetPasswordMutation.mutate(
      {
        token: verificationToken,
        new_password: 'newpass123',
        confirm_password: 'newpass123'
      },
      {
        onSuccess: (data) => {
          console.log('Password reset!')
        },
        onError: (error) => {
          console.error('Failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleReset}
      disabled={resetPasswordMutation.isLoading}
    >
      {resetPasswordMutation.isLoading ? 'Resetting...' : 'Reset Password'}
    </button>
  )
}
```

---

### 6. useSendTempPassword

Send temporary password to user email.

**Import:**
```javascript
import { useSendTempPassword } from '@/api/hooks'
```

**Usage:**
```javascript
const TempPasswordComponent = () => {
  const sendTempPasswordMutation = useSendTempPassword()

  const handleSend = () => {
    sendTempPasswordMutation.mutate(
      {
        check_username_type: 'refreshTemporaryPassword',
        username: 'user@example.com'
      },
      {
        onSuccess: (data) => {
          const email = data.data.user.email
          console.log('Temporary password sent to:', email)
        },
        onError: (error) => {
          console.error('Failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleSend}
      disabled={sendTempPasswordMutation.isLoading}
    >
      {sendTempPasswordMutation.isLoading ? 'Sending...' : 'Send Password'}
    </button>
  )
}
```

---

### 7. useAutoLogin

Auto login dengan token dari URL.

**Import:**
```javascript
import { useAutoLogin } from '@/api/hooks'
```

**Usage:**
```javascript
const AutoLoginComponent = () => {
  const autoLoginMutation = useAutoLogin()

  useEffect(() => {
    const token = getTokenFromURL()
    
    if (token) {
      autoLoginMutation.mutate(
        {
          data: {
            firebase_token: '',
            brand: '',
            model: '',
            serial_number: '',
            platform: 'Web',
            version: ''
          },
          token: token
        },
        {
          onSuccess: (data) => {
            const accessToken = data.data.user.token
            setAccessToken(accessToken)
            navigate('/home')
          },
          onError: (error) => {
            console.error('Auto login failed:', error.message)
          }
        }
      )
    }
  }, [])

  return autoLoginMutation.isLoading ? <Loader /> : null
}
```

---

### 8. useLogout

Logout dan clear semua cache.

**Import:**
```javascript
import { useLogout } from '@/api/hooks'
```

**Usage:**
```javascript
const LogoutComponent = () => {
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(
      getAccessToken(),
      {
        onSuccess: () => {
          // Clear localStorage
          clearAccessToken()
          clearFullname()
          
          // Navigate to login
          navigate('/login')
        },
        onError: (error) => {
          console.error('Logout failed:', error.message)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={logoutMutation.isLoading}
    >
      {logoutMutation.isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
```

---

## Error Handling

Semua API hooks otomatis handle invalid token (401):

```javascript
// Automatic invalid token detection
if (error.response?.status === 401) {
  dispatch(setInvalidToken(401))
}
```

**Custom error handling:**

```javascript
mutation.mutate(payload, {
  onError: (error) => {
    // error.message - Error message
    // error.response - Response object (if available)
    // error.response?.status - HTTP status code
    
    if (error.response?.status === 401) {
      console.log('Unauthorized!')
    } else if (error.response?.status === 419) {
      console.log('Temporary password expired!')
    } else {
      console.log('Generic error:', error.message)
    }
  }
})
```

---

## Best Practices

### 1. Always handle loading state

```javascript
const mutation = useLogin()

<button disabled={mutation.isLoading}>
  {mutation.isLoading ? 'Loading...' : 'Submit'}
</button>
```

### 2. Handle both success and error

```javascript
mutation.mutate(payload, {
  onSuccess: (data) => { /* success */ },
  onError: (error) => { /* error */ }
})
```

### 3. Use mutation states

```javascript
const mutation = useLogin()

mutation.isIdle      // Initial state
mutation.isLoading   // Currently loading
mutation.isSuccess   // Successfully completed
mutation.isError     // Error occurred
mutation.data        // Response data (if success)
mutation.error       // Error object (if error)
```

### 4. Reset mutation state

```javascript
const mutation = useLogin()

// Reset to idle state
mutation.reset()
```

### 5. Invalidate queries after mutation

```javascript
import { queryClient, queryKeys } from '@/config/queryClient'

mutation.mutate(payload, {
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries(queryKeys.auth.user())
  }
})
```

### 6. Optimistic updates

```javascript
mutation.mutate(payload, {
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(queryKeys.user.profile())
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData(queryKeys.user.profile())
    
    // Optimistically update
    queryClient.setQueryData(queryKeys.user.profile(), newData)
    
    // Return context with previous data
    return { previousData }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(
      queryKeys.user.profile(),
      context.previousData
    )
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(queryKeys.user.profile())
  }
})
```

---

## Query Keys

Gunakan centralized query keys:

```javascript
import { queryKeys } from '@/config/queryClient'

// Auth queries
queryKeys.auth.all                          // ['auth']
queryKeys.auth.user()                       // ['auth', 'user']
queryKeys.auth.checkUsername('user@x.com')  // ['auth', 'check-username', 'user@x.com']

// User queries
queryKeys.user.all                          // ['user']
queryKeys.user.profile()                    // ['user', 'profile']
queryKeys.user.settings()                   // ['user', 'settings']

// Content queries
queryKeys.content.all                       // ['content']
queryKeys.content.list({ page: 1 })         // ['content', 'list', { page: 1 }]
queryKeys.content.detail(123)               // ['content', 'detail', 123]
```

---

## React Query Devtools

Enable devtools untuk debugging (development only):

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

{import.meta.env.DEV && (
  <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
)}
```

**Features:**
- 🔍 View all queries and mutations
- 📊 See cache status
- ⏱️ Check loading times
- 🔄 Manually refetch queries
- 🗑️ Clear cache
- 📈 Performance metrics

---

## TypeScript Support

Untuk TypeScript, tambahkan types:

```typescript
import { useMutation } from '@tanstack/react-query'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  status: number
  data: {
    user: { token: string }
    firstname: string
    lastname: string
  }
}

const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
  mutationFn: (payload) => api.post('/login', payload)
})
```

---

**Happy Coding! 🚀**
