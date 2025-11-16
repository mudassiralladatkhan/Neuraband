import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NeuraBandProvider } from './contexts/NeuraBandContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import RealTimeSignals from './pages/RealTimeSignals';
import SensorStatusPage from './pages/SensorStatusPage';
import DeviceSettings from './pages/DeviceSettings';
import DataLogs from './pages/DataLogs';

const AppRoutes: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading Application...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/" />} />
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <NeuraBandProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/signals" element={<RealTimeSignals />} />
                  <Route path="/status" element={<SensorStatusPage />} />
                  <Route path="/settings" element={<DeviceSettings />} />
                  <Route path="/logs" element={<DataLogs />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            </NeuraBandProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
