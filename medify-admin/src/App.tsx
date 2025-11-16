import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Specializations from './pages/Specializations';
import Availabilities from './pages/Availabilities';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './constants';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path={ROUTES.LOGIN}
            element={<Login />}
          />
          <Route
            path={ROUTES.HOME}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.USERS}
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.APPOINTMENTS}
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.DOCTORS}
            element={
              <PrivateRoute>
                <Doctors />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.SPECIALIZATIONS}
            element={
              <PrivateRoute>
                <Specializations />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.AVAILABILITIES}
            element={
              <PrivateRoute>
                <Availabilities />
              </PrivateRoute>
            }
          />
          {/* Catch-all route - redirect to home (which will redirect to login if not authenticated) */}
          <Route
            path="*"
            element={<Navigate to={ROUTES.HOME} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}