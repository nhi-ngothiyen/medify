import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../constants';
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
        return _jsx(Navigate, { to: ROUTES.LOGIN, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
