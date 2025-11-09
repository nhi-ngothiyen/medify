import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { authService, userService } from '../../services/apiService';
import { STORAGE_KEYS } from '../../constants';
import './Navbar.css';
export default function Navbar() {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        loadCurrentUser();
    }, []);
    const loadCurrentUser = async () => {
        try {
            // Try to get user from localStorage first
            const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            else {
                // If not in localStorage, fetch from API
                const user = await userService.getCurrentUser();
                setCurrentUser(user);
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            }
        }
        catch (e) {
            console.error('Failed to load current user:', e);
        }
    };
    const logout = () => {
        authService.logout();
    };
    // Helper function to get user initials
    const getInitials = (name) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    return (_jsxs("header", { className: "navbar", children: [_jsxs("div", { className: "navbar-search", children: [_jsx("span", { className: "search-icon", "aria-hidden": "true", children: _jsx("svg", { viewBox: "0 0 24 24", focusable: "false", role: "presentation", children: _jsx("path", { d: "M11 4a7 7 0 0 1 5.6 11.2l3.1 3.1a1 1 0 0 1-1.4 1.4l-3.1-3.1A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" }) }) }), _jsx("input", { type: "search", placeholder: "Search for Files, Patient or Files", className: "navbar-search-input" })] }), _jsxs("div", { className: "navbar-actions", children: [_jsxs("div", { className: "navbar-profile", children: [_jsx("div", { className: "navbar-avatar", children: currentUser ? getInitials(currentUser.full_name) : 'U' }), _jsxs("div", { className: "navbar-profile-info", children: [_jsx("span", { className: "profile-name", children: currentUser?.full_name || 'User' }), _jsx("span", { className: "profile-role", children: currentUser?.role?.toUpperCase() || 'LOADING' })] })] }), _jsx("button", { onClick: logout, className: "logout-button", children: "\u0110\u0103ng xu\u1EA5t" })] })] }));
}
