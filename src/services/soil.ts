import { backendGet, backendPatch, backendPost } from './backendApi';
import { getAccessToken } from './auth';

export interface SoilRequestPayload {
  crop_type: string;
  pickup_type: string;
  notes?: string;
}

export interface SoilRequest {
  id: string;
  tracking_id: string;
  farmer_id: string;
  assigned_lab_id: string | null;
  crop_type: string;
  pickup_type: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SoilReport {
  id: string;
  soil_request_id: string;
  submitted_date: string;
  completed_date: string | null;
  ph_level: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  moisture: number | null;
  recommendations: string | null;
  report_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertSoilReportPayload {
  soil_request_id: string;
  submitted_date?: string;
  completed_date?: string;
  ph_level?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  recommendations?: string;
  report_pdf_url?: string;
}

export interface AssignLabPayload {
  assigned_lab_id: string;
}

export interface UpdateStatusPayload {
  status: string;
}

function token() {
  return getAccessToken();
}

export const createSoilRequest = (payload: SoilRequestPayload): Promise<SoilRequest> =>
  backendPost<SoilRequestPayload, SoilRequest>('/soil/requests', payload, token());

export const listSoilRequests = (statusFilter?: string): Promise<SoilRequest[]> => {
  const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
  return backendGet<SoilRequest[]>(`/soil/requests${qs}`, token());
};

export const getSoilRequest = (id: string): Promise<SoilRequest> =>
  backendGet<SoilRequest>(`/soil/requests/${id}`, token());

export const getSoilReportByTracking = (trackingId: string): Promise<SoilReport> =>
  backendGet<SoilReport>(`/soil/reports/by-tracking?tracking_id=${encodeURIComponent(trackingId)}`, token());

export const upsertSoilReport = (payload: UpsertSoilReportPayload): Promise<SoilReport> =>
  backendPost<UpsertSoilReportPayload, SoilReport>('/soil/reports', payload, token());

export const updateSoilRequestStatus = (id: string, status: string): Promise<SoilRequest> =>
  backendPatch<UpdateStatusPayload, SoilRequest>(`/soil/requests/${id}/status`, { status }, token());

export const assignLab = (requestId: string, labId: string): Promise<SoilRequest> =>
  backendPatch<AssignLabPayload, SoilRequest>(`/soil/requests/${requestId}/assign-lab`, { assigned_lab_id: labId }, token());
