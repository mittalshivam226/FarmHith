export interface ServicePackage {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
  parameters: string[];
  turnaroundDays: number;
  description: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  image?: string;
  rating: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'lab' | 'ngo' | 'institution' | 'energy';
}

export interface BookingFormData {
  packageId: string;
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  cropType: string;
  pickupType: 'pickup' | 'drop';
  address?: string;
  paymentMethod: string;
}

export interface Report {
  id: string;
  trackingId: string;
  farmerName: string;
  status: 'pending' | 'in_process' | 'completed';
  submittedDate: string;
  completedDate?: string;
  packageName: string;
  pdfUrl?: string;
  results?: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicCarbon: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'smart_farming' | 'sustainability' | 'energy' | 'policy';
  date: string;
  readTime: number;
  image: string;
  tags: string[];
}

// Database types matching Supabase schema
export interface Booking {
  id: string;
  tracking_id: string;
  package_id: string;
  farmer_name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  crop_type: string;
  pickup_type: 'pickup' | 'drop';
  address?: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SoilReport {
  id: string;
  booking_id: string;
  tracking_id: string;
  status: 'pending' | 'in_process' | 'completed';
  submitted_date: string;
  completed_date?: string;
  ph_level?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organic_carbon?: number;
  pdf_url?: string;
  recommendations?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

// User Profile types
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone: string;
  village?: string;
  district?: string;
  state?: string;
  address?: string;
  farm_details?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileFormData {
  name: string;
  email?: string;
  village?: string;
  district?: string;
  state?: string;
  address?: string;
  farm_details?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}
