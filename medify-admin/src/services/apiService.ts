/**
 * API Service
 * Centralized API calls with authentication
 */

const API_BASE_URL = import.meta.env.VITE_API;

/**
 * Make authenticated API request
 * @param path - API endpoint path
 * @param opts - Fetch options
 * @returns Promise with JSON response
 */
export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    }
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'API request failed');
  }
  
  return res.json().catch(() => ({}));
}

/**
 * Authentication API endpoints
 */
export const authService = {
  login: async (email: string, password: string) => {
    return api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

/**
 * User management API endpoints
 */
export const userService = {
  getAll: async () => {
    return api('/admin/users');
  },
  
  toggleActive: async (id: number) => {
    return api(`/admin/users/${id}/toggle-active`, { method: 'POST' });
  },
  
  resetPassword: async (id: number) => {
    return api(`/admin/users/${id}/reset-password`, { method: 'POST' });
  }
};

