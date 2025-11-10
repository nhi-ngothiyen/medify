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

// ==================== Dashboard Types ====================

export interface DashboardStats {
  total_patients: number;
  total_doctors: number;
  total_appointments: number;
  pending_appointments: number;
  today_appointments: number;
  active_users: number;
  total_specializations: number;
}

export interface AppointmentStatusCount {
  status: string;
  count: number;
}

export interface UserRoleCount {
  role: string;
  count: number;
}

export interface SpecialtyStats {
  specialty: string;
  doctor_count: number;
  appointment_count: number;
}

export interface TopDoctor {
  doctor_id: number;
  doctor_name: string;
  specialty: string;
  appointment_count: number;
  avg_rating: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  created_at: string;
}

export interface AppointmentTrend {
  date: string;
  count: number;
}

export interface DashboardData {
  overview: DashboardStats;
  appointments_by_status: AppointmentStatusCount[];
  users_by_role: UserRoleCount[];
  specialties: SpecialtyStats[];
  top_doctors: TopDoctor[];
  recent_activities: RecentActivity[];
  appointment_trends: AppointmentTrend[];
}

// ==================== Appointment Types ====================

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;  // Backend uses doctor_id (not doctor_user_id)
  start_at: string;
  end_at: string;
  status: 'BOOKED' | 'CANCELED' | 'DONE' | 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW';
  note?: string;  // Backend uses "note" not "notes"
  patient?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    gender?: string;
  };
  doctor?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    gender?: string;
    specialty?: string;  // From doctor_profile
  };
  review?: {
    id: number;
    rating: number;
    comment?: string;
  };
}

// Mock data types for appointment details
export interface MedicalRecord {
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface Prescription {
  medicineDetails?: string;
}

export interface Payment {
  amount?: number;
  status?: 'PAID' | 'UNPAID' | 'PENDING';
  paymentMethod?: string;
}

export interface AppointmentDetail extends Appointment {
  medicalRecord?: MedicalRecord;
  prescription?: Prescription;
  payment?: Payment;
}

