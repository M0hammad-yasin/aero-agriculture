export { default as authService } from './services';

// Hooks
export { useAuth } from './hooks/auth.hook';

// Store
export { 
  useAuthStore,
  useAuthUser,
  useAuthLoading,
  useAuthError,
  useAuthStatus
} from './store/useAuthStore';

// Context
export { 
  AuthProvider, 
  useAuthContext, 
  withAuth, 
//   usePermissions 
} from './context/AuthContext';

// Utils
export {
  TokenManager,
  ValidationUtils,
  SecurityUtils,
  UserUtils,
  StorageUtils,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTH_STORAGE as USER_KEY
} from './utils/auth.utils';

// Components
export {
  LoginForm,
  LoginHeader,
  LoginLayout,
  PasswordInput,
} from './components';

// Types (re-export from models)
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProfileUpdateRequest
} from '../../models/auth-model';