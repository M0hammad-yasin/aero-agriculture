# Authentication Feature

A comprehensive authentication system for the AeroAgriculture application built with React, TypeScript, Zustand, and Axios.

## Features

- ✅ User login and registration
- ✅ JWT token management with automatic refresh
- ✅ Persistent authentication state
- ✅ Profile management
- ✅ Secure token storage
- ✅ Error handling and validation
- ✅ TypeScript support
- ✅ Context API integration
- ✅ Route protection
- ✅ Automatic token refresh
- ✅ Security utilities

## Architecture

```
src/features/authentication/
├── hooks/
│   └── auth.hook.ts          # Main authentication hook
├── services/
│   └── auth.service.ts       # API service for auth operations
├── store/
│   └── useAuthStore.ts       # Zustand store for state management
├── context/
│   └── AuthContext.tsx       # React context provider
├── utils/
│   └── auth.utils.ts         # Utility functions
├── index.ts                  # Main exports
└── README.md                 # This file
```

## Quick Start

### 1. Setup Authentication Provider

Wrap your app with the `AuthProvider`:

```tsx
import { AuthProvider } from './features/authentication';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Using the Authentication Hook

```tsx
import { useAuthContext } from './features/authentication';

function LoginComponent() {
  const { login, isLoading, error } = useAuthContext();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Handle successful login
      console.log('Logged in:', result.user);
    } else {
      // Handle login error
      console.error('Login failed:', result.error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Your login form */}
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>Login</button>
    </form>
  );
}
```

### 3. Protecting Routes

Use the `withAuth` HOC to protect routes:

```tsx
import { withAuth } from './features/authentication';

const ProtectedComponent = () => {
  return <div>This is a protected route</div>;
};

export default withAuth(ProtectedComponent);
```

## API Reference

### useAuthContext Hook

```tsx
const {
  // State
  user,              // Current user object or null
  isAuthenticated,   // Boolean authentication status
  isLoading,         // Loading state for auth operations
  error,             // Current error message
  isInitialized,     // Whether auth has been initialized
  
  // Actions
  login,             // Login function
  register,          // Registration function
  logout,            // Logout function
  fetchUserProfile,  // Fetch current user profile
  updateProfile,     // Update user profile
  refreshToken,      // Manually refresh token
  clearError,        // Clear current error
  resetAuth,         // Reset auth state
} = useAuthContext();
```

### AuthService Methods

```tsx
const authService = new AuthService();

// Login user
const response = await authService.login({ email, password });

// Register user
const response = await authService.register({ name, email, password, confirmPassword });

// Logout user
await authService.logout();

// Get user profile
const user = await authService.getProfile();

// Update user profile
const updatedUser = await authService.updateProfile({ name: 'New Name' });

// Check if user is authenticated
const isAuth = await authService.isAuthenticated();

// Refresh token
const success = await authService.refreshToken();
```

### Token Management

```tsx
import { TokenManager } from './features/authentication';

// Store tokens
TokenManager.setToken('jwt-token');
TokenManager.setRefreshToken('refresh-token');

// Get tokens
const token = TokenManager.getToken();
const refreshToken = TokenManager.getRefreshToken();

// Check token status
const hasToken = TokenManager.hasToken();
const isExpired = TokenManager.isTokenExpired(token);
const willExpireSoon = TokenManager.willTokenExpireSoon(token);

// Clear all tokens
TokenManager.clearTokens();
```

### Validation Utilities

```tsx
import { ValidationUtils } from './features/authentication';

// Email validation
const isValidEmail = ValidationUtils.isValidEmail('user@example.com');

// Password validation
const { isValid, errors } = ValidationUtils.isValidPassword('password123');

// Name validation
const isValidName = ValidationUtils.isValidName('John Doe');

// Input sanitization
const sanitized = ValidationUtils.sanitizeInput('<script>alert("xss")</script>');
```

### User Utilities

```tsx
import { UserUtils } from './features/authentication';

// Get user initials
const initials = UserUtils.getUserInitials(user);

// Get display name
const displayName = UserUtils.getDisplayName(user);

// Get avatar URL
const avatarUrl = UserUtils.getAvatarUrl(user);

// Check if user has profile image
const hasImage = UserUtils.hasProfileImage(user);
```

## Configuration

### Environment Variables

Set the following environment variables:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Token Storage

Tokens are stored in localStorage with the following keys:
- `auth_token` - JWT access token
- `refresh_token` - Refresh token
- `auth-storage` - Zustand persisted state

## Security Features

### Token Management
- Automatic token refresh before expiration
- Secure token storage with error handling
- Token validation and expiration checking
- Automatic logout on token expiration

### Input Validation
- Email format validation
- Password strength requirements
- Input sanitization
- XSS protection

### Error Handling
- Comprehensive error messages
- Network error handling
- Validation error display
- Graceful fallbacks

## Best Practices

### 1. Always Use the Context
```tsx
// ✅ Good
const { user, login } = useAuthContext();

// ❌ Avoid direct store access in components
const user = useAuthStore(state => state.user);
```

### 2. Handle Loading States
```tsx
const { isLoading, login } = useAuthContext();

const handleLogin = async (credentials) => {
  if (isLoading) return; // Prevent multiple requests
  
  const result = await login(credentials);
  // Handle result
};
```

### 3. Clear Errors Appropriately
```tsx
const { error, clearError } = useAuthContext();

useEffect(() => {
  // Clear errors when component unmounts
  return () => clearError();
}, [clearError]);
```

### 4. Validate Input Before Submission
```tsx
import { ValidationUtils } from './features/authentication';

const handleSubmit = async (formData) => {
  if (!ValidationUtils.isValidEmail(formData.email)) {
    setError('Invalid email format');
    return;
  }
  
  const passwordValidation = ValidationUtils.isValidPassword(formData.password);
  if (!passwordValidation.isValid) {
    setError(passwordValidation.errors.join(', '));
    return;
  }
  
  // Proceed with submission
};
```

## Error Handling

The authentication system provides comprehensive error handling:

### HTTP Status Codes
- `401` - Invalid credentials or expired token
- `403` - Insufficient permissions
- `404` - Resource not found
- `422` - Validation errors
- `500+` - Server errors

### Error Types
- Network errors (no internet connection)
- Validation errors (invalid input)
- Authentication errors (invalid credentials)
- Authorization errors (insufficient permissions)
- Server errors (internal server error)

## Testing

### Unit Testing
```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './features/authentication';

test('should login user successfully', async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    const response = await result.current.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(response.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Integration Testing
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from './features/authentication';
import LoginComponent from './LoginComponent';

test('should display error on invalid login', async () => {
  render(
    <AuthProvider>
      <LoginComponent />
    </AuthProvider>
  );
  
  fireEvent.click(screen.getByText('Login'));
  
  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
```

## Migration Guide

If you're migrating from the old authentication system:

### 1. Update Imports
```tsx
// Old
import { useAuth } from './hooks/auth.hook';
import { useAuthStore } from './store/useAuthStore';

// New
import { useAuthContext, AuthProvider } from './features/authentication';
```

### 2. Wrap App with Provider
```tsx
// Add AuthProvider to your app root
<AuthProvider>
  <App />
</AuthProvider>
```

### 3. Update Hook Usage
```tsx
// Old
const { login, user, isLoading } = useAuth();

// New
const { login, user, isLoading } = useAuthContext();
```

## Troubleshooting

### Common Issues

1. **Token not persisting**: Check localStorage permissions and quotas
2. **Infinite refresh loops**: Ensure refresh token is valid and not expired
3. **CORS errors**: Configure your API server to allow requests from your domain
4. **Context not found**: Ensure components are wrapped with `AuthProvider`

### Debug Mode

Enable debug logging by setting:
```tsx
localStorage.setItem('auth_debug', 'true');
```

## Contributing

When contributing to the authentication feature:

1. Follow TypeScript best practices
2. Add comprehensive error handling
3. Include unit tests for new functionality
4. Update this documentation
5. Ensure security best practices are followed

## License

This authentication feature is part of the AeroAgriculture project.