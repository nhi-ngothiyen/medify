/**
 * TypeScript Type Definitions
 */

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'doctor';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface ApiError {
  message: string;
  status?: number;
}

