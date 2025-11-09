/**
 * useAuth Hook
 * Custom hook for authentication logic
 */
import { useState, useEffect } from 'react';
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };
    return {
        isAuthenticated,
        loading,
        login,
        logout
    };
}
