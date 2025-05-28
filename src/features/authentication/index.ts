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
  USER_KEY
} from './utils/auth.utils';

// Types (re-export from models)
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProfileUpdateRequest
} from '../../models/auth-model';