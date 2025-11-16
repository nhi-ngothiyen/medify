/**
 * API Service
 * Centralized API calls with authentication
 */
import { STORAGE_KEYS } from '../constants';
const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:8000';
/**
 * Make authenticated API request with timeout
 * @param path - API endpoint path
 * @param opts - Fetch options
 * @returns Promise with JSON response
 */
export async function api(path, opts = {}) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const url = `${API_BASE_URL}${path}`;
    console.log('🌐 API Request:', {
        method: opts.method || 'GET',
        url,
        hasToken: !!token
    });
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    try {
        const res = await fetch(url, {
            ...opts,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(opts.headers || {})
            }
        });
        clearTimeout(timeoutId);
        console.log('📥 API Response:', {
            status: res.status,
            statusText: res.statusText,
            ok: res.ok
        });
        if (!res.ok) {
            let errorText = 'API request failed';
            try {
                errorText = await res.text();
                console.error('❌ Error response body:', errorText);
            }
            catch (e) {
                // Ignore error reading response
            }
            throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
        }
        const jsonData = await res.json().catch(() => ({}));
        console.log('✅ API Success:', jsonData);
        return jsonData;
    }
    catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ API Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
        }
        if (error.message) {
            throw error;
        }
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
    }
}
/**
 * Authentication API endpoints
 */
export const authService = {
    login: async (email, password) => {
        return api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
    },
    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
};
/**
 * User management API endpoints
 */
export const userService = {
    getAll: async () => {
        return api('/admin/users');
    },
    getCurrentUser: async () => {
        return api('/auth/me');
    },
    toggleActive: async (id) => {
        return api(`/admin/users/${id}/toggle-active`, { method: 'POST' });
    },
    resetPassword: async (id) => {
        return api(`/admin/users/${id}/reset-password`, { method: 'POST' });
    }
};
/**
 * Dashboard API endpoints
 */
export const dashboardService = {
    getStats: async () => {
        return api('/admin/dashboard/stats');
    },
    getAppointmentsByStatus: async () => {
        return api('/admin/dashboard/appointments-by-status');
    },
    getUsersByRole: async () => {
        return api('/admin/dashboard/users-by-role');
    },
    getSpecialties: async () => {
        return api('/admin/dashboard/specialties');
    },
    getTopDoctors: async (limit = 5) => {
        return api(`/admin/dashboard/top-doctors?limit=${limit}`);
    },
    getAppointmentTrends: async (days = 7) => {
        return api(`/admin/dashboard/appointment-trends?days=${days}`);
    },
    getRecentActivities: async (limit = 10) => {
        return api(`/admin/dashboard/recent-activities?limit=${limit}`);
    },
    getAllDashboardData: async () => {
        return api('/admin/dashboard');
    }
};
/**
 * Appointment API endpoints
 */
export const appointmentService = {
    getAll: async () => {
        return api('/admin/appointments');
    },
    getById: async (id) => {
        // Try admin endpoint first, fallback to regular endpoint
        try {
            return api(`/admin/appointments/${id}`);
        }
        catch {
            return api(`/appointments/${id}`);
        }
    },
    delete: async (id) => {
        return api(`/admin/appointments/${id}`, { method: 'DELETE' });
    }
};
/**
 * Doctor management API endpoints
 */
export const doctorService = {
    getAll: async (params) => {
        const queryParams = new URLSearchParams();
        if (params?.specialty)
            queryParams.append('specialty', params.specialty);
        if (params?.search)
            queryParams.append('search', params.search);
        if (params?.search_field)
            queryParams.append('search_field', params.search_field);
        if (params?.sort_by)
            queryParams.append('sort_by', params.sort_by);
        if (params?.sort_order)
            queryParams.append('sort_order', params.sort_order);
        const queryString = queryParams.toString();
        return api(`/admin/doctors${queryString ? `?${queryString}` : ''}`);
    },
    getById: async (id) => {
        return api(`/admin/doctors/${id}`);
    },
    create: async (data) => {
        return api('/admin/doctors', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return api(`/admin/doctors/${id}`, { method: 'DELETE' });
    }
};
/**
 * Specialization management API endpoints
 */
export const specializationService = {
    getAll: async (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search)
            queryParams.append('search', params.search);
        if (params?.sort_by)
            queryParams.append('sort_by', params.sort_by);
        if (params?.sort_order)
            queryParams.append('sort_order', params.sort_order);
        const queryString = queryParams.toString();
        return api(`/admin/specializations${queryString ? `?${queryString}` : ''}`);
    },
    create: async (name) => {
        return api('/admin/specializations', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    },
    update: async (oldName, newName) => {
        return api(`/admin/specializations/${encodeURIComponent(oldName)}`, {
            method: 'PUT',
            body: JSON.stringify({ new_name: newName })
        });
    },
    delete: async (name, action = 'clear') => {
        return api(`/admin/specializations/${encodeURIComponent(name)}?action=${action}`, {
            method: 'DELETE'
        });
    }
};
