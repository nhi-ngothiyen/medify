/**
 * Application Constants
 */

export const APP_NAME = 'Medify Admin';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DOCTOR: 'doctor'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user_data'
} as const;

