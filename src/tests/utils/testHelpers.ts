import { vi } from 'vitest'

// Mock Supabase client
export const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null }))
      }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null }))
        }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null }))
        }))
      }))
    })),
    upsert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null }))
      }))
    }))
  })),
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    refreshSession: vi.fn(),
    signInWithOtp: vi.fn(),
    verifyOtp: vi.fn()
  }
}

// Test data generators
export const generateTestBooking = (overrides = {}) => ({
  package_id: 'test-package-1',
  tracking_id: 'TEST123456',
  farmer_name: 'Test Farmer',
  mobile: '9876543210',
  village: 'Test Village',
  district: 'Test District',
  state: 'Test State',
  crop_type: 'Rice',
  pickup_type: 'pickup' as const,
  address: 'Test Address',
  payment_method: 'online',
  payment_status: 'pending',
  status: 'pending',
  ...overrides
})

export const generateTestBookingSubmission = (overrides = {}) => ({
  package_id: 'test-package-1',
  tracking_id: 'TEST123456',
  farmer_name: 'Test Farmer',
  mobile: '9876543210',
  village: 'Test Village',
  district: 'Test District',
  state: 'Test State',
  crop_type: 'Rice',
  pickup_type: 'pickup' as const,
  address: 'Test Address',
  payment_method: 'online',
  payment_status: 'pending',
  status: 'pending',
  ...overrides
})

export const generateTestReport = (overrides = {}) => ({
  tracking_id: 'TEST123456',
  ph_level: 7.0,
  nitrogen: 50,
  phosphorus: 30,
  potassium: 40,
  organic_matter: 2.5,
  recommendations: 'Test recommendations',
  ...overrides
})

// Mock logger
export const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn()
}
