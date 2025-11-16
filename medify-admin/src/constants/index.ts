/**
 * Application Constants
 */

export const APP_NAME = 'Medify Admin';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  USERS: '/users',
  APPOINTMENTS: '/appointments',
  DOCTORS: '/doctors',
  SPECIALIZATIONS: '/specializations',
  AVAILABILITIES: '/availabilities'
} as const;

export const WEEKDAY_NAMES = {
  0: 'Chủ nhật',
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7'
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

// Search field labels
export const SEARCH_FIELD_LABELS = {
  ALL: 'All',
  NAME: 'Name',
  EMAIL: 'Email',
  SPECIALTY: 'Specialty'
} as const;

// Table header labels
export const TABLE_HEADER_LABELS = {
  NAME: 'Name',
  EMAIL: 'Email',
  SPECIALIZATION: 'Specialization',
  DEGREE: 'Degree',
  EXPERIENCE: 'Experience',
  RATING: 'Rating',
  ACTION: 'Action',
  AVATAR: 'Avatar'
} as const;

// Search placeholders
export const SEARCH_PLACEHOLDERS = {
  ALL: 'Search by name, email, or specialty',
  NAME: 'Search by name',
  EMAIL: 'Search by email',
  SPECIALTY: 'Search by specialty'
} as const;

