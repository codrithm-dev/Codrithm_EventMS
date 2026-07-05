export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: "guest" | "user" | "organizer" | "admin";
  is_verified: boolean;
  created_at: string;
}

export interface UserUpdate {
  full_name?: string;
  avatar_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface EventListItem {
  id: string;
  title: string;
  slug: string;
  banner_url: string | null;
  category: string;
  event_type: string;
  date_time: string;
  venue: string | null;
  capacity: number;
  status: string;
  registered_count: number | null;
}

export interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string | null;
  category: string;
  event_type: string;
  venue: string | null;
  date_time: string;
  capacity: number;
  registration_deadline: string;
  approval_mode: "auto" | "manual";
  organizer_id: string;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
  registered_count: number | null;
}

export interface EventCreate {
  title: string;
  description: string;
  category: string;
  event_type: string;
  venue?: string | null;
  date_time: string;
  capacity: number;
  registration_deadline: string;
  approval_mode?: string;
  banner_url?: string | null;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  category?: string;
  event_type?: string;
  venue?: string | null;
  date_time?: string;
  capacity?: number;
  registration_deadline?: string;
  approval_mode?: string;
  banner_url?: string | null;
}

export interface PaginatedEvents {
  items: EventListItem[];
  total: number;
  page: number;
  pages: number;
}

export interface RegistrationCreate {
  full_name: string;
  email: string;
  phone?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  university?: string | null;
  company?: string | null;
  job_title?: string | null;
  portfolio_url?: string | null;
  dynamic_responses?: Record<string, unknown> | null;
}

export interface RegistrationResponse {
  id: string;
  user_id: string;
  event_id: string;
  status: "pending" | "approved" | "rejected" | "waitlisted" | "cancelled";
  ticket_id: string | null;
  qr_code_url: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  university: string | null;
  company: string | null;
  job_title: string | null;
  portfolio_url: string | null;
  dynamic_responses: Record<string, unknown> | null;
  registered_at: string;
  updated_at: string;
}

export interface PaginatedRegistrations {
  items: RegistrationResponse[];
  total: number;
  page: number;
  pages: number;
}

export interface TicketResponse {
  registration_id: string;
  ticket_id: string;
  event_title: string;
  event_date: string;
  event_venue: string | null;
  attendee_name: string;
  qr_code_url: string;
  status: string;
}

export interface CheckinRequest {
  ticket_id: string;
}

export interface CheckinResponse {
  success: boolean;
  message: string;
  attendee_name: string | null;
  event_title: string | null;
}

export interface CheckinStats {
  total_registered: number;
  checked_in: number;
  not_checked_in: number;
  percentage: number;
}

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export interface PaginatedNotifications {
  items: NotificationResponse[];
  total: number;
  page: number;
  pages: number;
}

export interface PlatformAnalytics {
  total_users: number;
  total_events: number;
  total_registrations: number;
  events_by_category: Record<string, number>;
  registrations_over_time: Array<{ date: string; count: number }>;
}

export interface EventAnalytics {
  event_id: string;
  event_title: string;
  total_registrations: number;
  approved: number;
  pending: number;
  rejected: number;
  waitlisted: number;
  checked_in: number;
  registration_trend: Array<{ date: string; count: number }>;
}

export interface OrganizerDashboardSummary {
  total_events: number;
  total_registrations: number;
  pending_approvals: number;
  checkin_rate: number;
  recent_events: EventListItem[];
}

export interface UserDashboardSummary {
  upcoming_events: number;
  total_registrations: number;
  events_attended: number;
  upcoming_registrations: RegistrationResponse[];
}

export interface ApiError {
  detail: string;
}
