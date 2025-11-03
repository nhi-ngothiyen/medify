import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import { ROUTES, STORAGE_KEYS } from './constants';

export default function App() {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;

  return (
    <BrowserRouter>
      {token && <Header />}
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <PrivateRoute>
              <Users />
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
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}