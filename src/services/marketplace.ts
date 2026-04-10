import { backendGet, backendPatch, backendPost } from './backendApi';
import { getAccessToken } from './auth';

export interface ResidueListing {
  id: string;
  farmer_id: string;
  residue_type: string;
  quantity_tons: number;
  price_per_ton: number;
  location_text: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateListingPayload {
  residue_type: string;
  quantity_tons: number;
  price_per_ton: number;
  location_text: string;
  description?: string;
}

export interface ResidueOrder {
  id: string;
  listing_id: string;
  buyer_id: string;
  ordered_quantity_tons: number;
  total_amount_inr: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  listing_id: string;
  ordered_quantity_tons: number;
}

function token() {
  return getAccessToken();
}

export const listListings = (statusFilter = 'active'): Promise<ResidueListing[]> =>
  backendGet<ResidueListing[]>(`/marketplace/listings?status=${encodeURIComponent(statusFilter)}`, token());

export const createListing = (payload: CreateListingPayload): Promise<ResidueListing> =>
  backendPost<CreateListingPayload, ResidueListing>('/marketplace/listings', payload, token());

export const updateListingStatus = (id: string, status: string): Promise<ResidueListing> =>
  backendPatch<{ status: string }, ResidueListing>(`/marketplace/listings/${id}/status`, { status }, token());

export const createOrder = (payload: CreateOrderPayload): Promise<ResidueOrder> =>
  backendPost<CreateOrderPayload, ResidueOrder>('/marketplace/orders', payload, token());

export const listMyOrders = (): Promise<ResidueOrder[]> =>
  backendGet<ResidueOrder[]>('/marketplace/orders/my', token());

export const updateOrderStatus = (id: string, status: string): Promise<ResidueOrder> =>
  backendPatch<{ status: string }, ResidueOrder>(`/marketplace/orders/${id}/status`, { status }, token());
