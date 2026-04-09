import { backendGet } from './backendApi';

export interface BookingByTrackingResponse {
  id: string;
  tracking_id: string;
  package_id: string;
  farmer_name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  crop_type: string;
  pickup_type: string;
  address?: string | null;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SoilReportByTrackingResponse {
  id: string;
  booking_id?: string | null;
  tracking_id: string;
  status: string;
  submitted_date?: string | null;
  completed_date?: string | null;
  ph_level?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  organic_carbon?: number | null;
  pdf_url?: string | null;
  recommendations?: string | null;
  created_at: string;
  updated_at: string;
}

export const getBookingByTracking = (trackingId: string, mobile: string) =>
  backendGet<BookingByTrackingResponse>(
    `/bookings/by-tracking?tracking_id=${encodeURIComponent(trackingId)}&mobile=${encodeURIComponent(mobile)}`
  );

export const getReportByTracking = (trackingId: string) =>
  backendGet<SoilReportByTrackingResponse>(
    `/reports/by-tracking?tracking_id=${encodeURIComponent(trackingId)}`
  );
