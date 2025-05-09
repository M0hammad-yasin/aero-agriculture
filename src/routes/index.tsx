import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/Layout/DashboardLayout";
import DashboardContent from "../components/Dashboard/DashboardContent";

const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        } />
        {/* Add more protected routes here as the application grows */}
      </Route>
      
      {/* Redirect to login if not authenticated, otherwise to dashboard */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;