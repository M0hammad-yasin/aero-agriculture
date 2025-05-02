import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme";
import DashboardLayout from "./components/Layout/DashboardLayout";
import DashboardContent from "./components/Dashboard/DashboardContent";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} storageKey="chakra-ui-color-mode" />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
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
          </Route>
          
          {/* Redirect to login if not authenticated, otherwise to dashboard */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App;
