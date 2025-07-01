import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

import './index.css';
import StaffManager from './components/dashboard/StaffManager';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Staff = lazy(() => import('./pages/Staff'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Billing = lazy(() => import('./pages/Billing'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/register'));
const AddPatient = lazy(() => import('./pages/AddPatient'));
const ForgotPassword = lazy(() => import('./pages/forgot-password'));
const PatientForm = lazy(() => import('./components/patients/PatientForm'));
const Laboratory = lazy(() => import('./components/Laboratory'));
const Pharmacy = lazy(() => import('./components/Pharmacy'));
const ManageDoctors = lazy(() => import('./components/ManageDoctors'));
const StaffDetails = lazy(() => import('./components/staff/StaffDetails'));
const EmergencyCases = lazy(() => import('./components/EmergencyCases'));
const BedRoomManagement = lazy(() => import('./components/BedRoomManagement'));
const BillingPayments = lazy(() => import('./components/BillingPayments'));

// ✅ Newly added pages (previously missing)
const ManagePatients = lazy(() => import('./pages/ManagePatients'));

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container p-4 text-center text-gray-600">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

// ✅ Layout wrapper
const Layout = ({ children }) => (
  <>
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300 p-4">
        {children}
      </main>
    </div>
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="container p-4 text-center text-gray-600">Loading...</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/patients/add" element={<AddPatient />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard */}
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

                {/* Core routes */}
                <Route path="/patients" element={<ProtectedRoute><Layout><Patients /></Layout></ProtectedRoute>} />
                <Route path="/patients/new" element={<ProtectedRoute><Layout><PatientForm /></Layout></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Layout><Appointments /></Layout></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><Layout><Staff /></Layout></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Layout><Billing /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

                {/* ✅ Previously missing routes (corrected) */}
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

                {/* Extended routes */}
                <Route path="/laboratory" element={<ProtectedRoute><Layout><Laboratory /></Layout></ProtectedRoute>} />
                <Route path="/pharmacy" element={<ProtectedRoute><Layout><Pharmacy /></Layout></ProtectedRoute>} />
                <Route path="/manage-doctors" element={<ProtectedRoute><Layout><ManageDoctors /></Layout></ProtectedRoute>} />
                <Route path="/emergency-cases" element={<ProtectedRoute><Layout><EmergencyCases /></Layout></ProtectedRoute>} />
                <Route path="/bed-room-management" element={<ProtectedRoute><Layout><BedRoomManagement /></Layout></ProtectedRoute>} />
                <Route path="/staff-details/:id" element={<ProtectedRoute><Layout><StaffDetails /></Layout></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;