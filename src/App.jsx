import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import StaffManager from './components/dashboard/StaffManager';
import './index.css';

// Safe lazy imports without debug logging
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Staff = lazy(() => import('./pages/Staff'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Billing = lazy(() => import('./pages/Billing'));
const Reports = lazy(() => import('./components/ReportsAnalytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const AddPatient = lazy(() => import('./pages/AddPatient'));
const PatientForm = lazy(() => import('./components/patients/PatientForm'));
const Laboratory = lazy(() => import('./components/Laboratory'));
const Pharmacy = lazy(() => import('./components/Pharmacy'));
const BedRoomManagement = lazy(() => import('./components/BedRoomManagement'));
const StaffDetails = lazy(() => import('./components/staff/StaffDetails'));
const EmergencyCases = lazy(() => import('./components/EmergencyCases'));
const BillingPayments = lazy(() => import('./components/BillingPayments'));
const ManagePatients = lazy(() => import('./pages/ManagePatients'));
const Register = lazy(() => import('./pages/register'));
const ForgotPassword = lazy(() => import('./pages/forgot-password'));
const DoctorDashboard = lazy(() => import('./components/DoctorsDashboard'));
const ManageDoctors = lazy(() => import('./pages/ManageDoctors'));

const Profile = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">User Profile</h1>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <p className="text-gray-700 dark:text-gray-300">Profile page will be implemented soon.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container p-4 text-center text-gray-600">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

const Layout = ({ children }) => {
  const { sidebarOpen } = useTheme();
  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300 p-4`}>
          {children}
        </main>
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="container p-4 text-center text-gray-600">Loading...</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/patients/add" element={<AddPatient />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/patients" element={<ProtectedRoute><Layout><Patients /></Layout></ProtectedRoute>} />
                <Route path="/patients/new" element={<ProtectedRoute><Layout><PatientForm /></Layout></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Layout><Appointments /></Layout></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><Layout><Staff /></Layout></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Layout><Billing /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/reports-analytics" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                {/* NEW: Add this route for /system-settings (using Settings component to avoid missing file error) */}
                <Route
                  path="/system-settings"
                  element={
                    <ProtectedRoute requiredRole="admin"> {/* Optional: Restrict to admin */}
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-patients"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ManagePatients />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-doctors"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <ManageDoctors />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/edit/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PatientForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff-management"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <StaffManager />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/billing-payment"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BillingPayments />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/laboratory"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Laboratory />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Pharmacy />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/DoctorsDashboard"
                  element={
                    <ProtectedRoute requiredRole="doctor">
                      <Layout>
                        <DoctorDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emergency-cases"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <EmergencyCases />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bed-room-management"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BedRoomManagement />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff-details/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <StaffDetails />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<div className="container p-4 text-red-600">404: Page Not Found</div>} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;