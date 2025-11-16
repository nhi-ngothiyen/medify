import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: ROUTES.LOGIN, element: _jsx(Login, {}) }), _jsx(Route, { path: ROUTES.HOME, element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: ROUTES.DASHBOARD, element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: ROUTES.USERS, element: _jsx(PrivateRoute, { children: _jsx(Users, {}) }) }), _jsx(Route, { path: ROUTES.APPOINTMENTS, element: _jsx(PrivateRoute, { children: _jsx(Appointments, {}) }) }), _jsx(Route, { path: ROUTES.DOCTORS, element: _jsx(PrivateRoute, { children: _jsx(Doctors, {}) }) }), _jsx(Route, { path: ROUTES.SPECIALIZATIONS, element: _jsx(PrivateRoute, { children: _jsx(Specializations, {}) }) }), _jsx(Route, { path: ROUTES.AVAILABILITIES, element: _jsx(PrivateRoute, { children: _jsx(Availabilities, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: ROUTES.HOME, replace: true }) })] }) }) }));
}
