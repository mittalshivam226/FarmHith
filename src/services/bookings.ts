import { backendPost } from './backendApi';

export interface CreateBookingRequest {
  package_id: string;
  tracking_id: string;
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
}

export interface CreateBookingResponse {
  id: string;
  tracking_id: string;
  status: string;
  payment_status: string;
}

export const createBooking = (payload: CreateBookingRequest) =>
  backendPost<CreateBookingRequest, CreateBookingResponse>('/bookings', payload);

