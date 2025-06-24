import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/authentication/store/useAuthStore";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../pages/Dashboard/DashboardPage";

const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add more protected routes here as the application grows */}
      </Route>
      
      {/* Redirect to login if not authenticated, otherwise to dashboard */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;