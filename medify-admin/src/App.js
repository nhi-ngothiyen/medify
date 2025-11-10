import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES, STORAGE_KEYS } from './constants';
export default function App() {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: ROUTES.HOME, element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: ROUTES.DASHBOARD, element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: ROUTES.USERS, element: _jsx(PrivateRoute, { children: _jsx(Users, {}) }) }), _jsx(Route, { path: ROUTES.APPOINTMENTS, element: _jsx(PrivateRoute, { children: _jsx(Appointments, {}) }) }), _jsx(Route, { path: ROUTES.LOGIN, element: _jsx(Login, {}) })] }) }));
}
