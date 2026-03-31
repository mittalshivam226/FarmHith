import { backendPost } from './backendApi';

export interface CreatePaymentOrderRequest {
  user_id?: string | null;
  purpose: string;
  purpose_ref_id: string;
  amount_inr: number;
  currency: string;
}

export interface CreatePaymentOrderResponse {
  payment_id: string;
  razorpay_order_id: string;
  amount_paise: number;
  currency: string;
  key_id: string;
}

export interface VerifyPaymentSignatureRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createPaymentOrder = (payload: CreatePaymentOrderRequest) =>
  backendPost<CreatePaymentOrderRequest, CreatePaymentOrderResponse>('/payments/create-order', payload);

export const verifyPaymentSignature = (payload: VerifyPaymentSignatureRequest) =>
  backendPost<VerifyPaymentSignatureRequest, { valid: boolean; message: string }>(
    '/payments/verify-signature',
    payload
  );

