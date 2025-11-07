import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { BookingFormData, Booking, SoilReport, ContactMessage, ApiResponse } from '../types'

// Validation schemas
const bookingSubmissionSchema = z.object({
  package_id: z.string().min(1, 'Package ID is required'),
  tracking_id: z.string().min(1, 'Tracking ID is required'),
  farmer_name: z.string().min(1, 'Farmer name is required').max(100, 'Farmer name too long'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number (10 digits starting with 6-9)'),
  village: z.string().min(1, 'Village is required').max(100, 'Village name too long'),
  district: z.string().min(1, 'District is required').max(100, 'District name too long'),
  state: z.string().min(1, 'State is required').max(100, 'State name too long'),
  crop_type: z.string().min(1, 'Crop type is required').max(100, 'Crop type too long'),
  pickup_type: z.enum(['pickup', 'drop'], 'Invalid pickup type'),
  address: z.string().optional(),
  payment_method: z.string().min(1, 'Payment method is required'),
  payment_status: z.string().default('pending'),
  status: z.string().default('pending')
})

const trackingIdSchema = z.string().min(1, 'Tracking ID is required')
const mobileSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number')

export interface BookingSubmissionData extends Omit<BookingFormData, 'packageId'> {
  package_id: string
  tracking_id: string
}

/**
 * Submits a new soil test booking
 * @param data - The booking data to submit
 * @returns The created booking record
 * @throws Error if validation fails or submission fails
 */
export const submitBooking = async (data: BookingSubmissionData) => {
  try {
    // Validate input data
    const validatedData = bookingSubmissionSchema.parse(data)

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      console.error('Database error submitting booking:', error)
      throw new Error(`Failed to submit booking: ${error.message}`)
    }

    return booking
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues)
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    throw error
  }
}

/**
 * Retrieves a booking by tracking ID and mobile number for verification
 * @param trackingId - The tracking ID of the booking
 * @param mobile - The mobile number for verification
 * @returns The booking record
 * @throws Error if booking not found or credentials invalid
 */
export const getBookingByTrackingId = async (trackingId: string, mobile: string) => {
  try {
    // Validate inputs
    trackingIdSchema.parse(trackingId)
    mobileSchema.parse(mobile)

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tracking_id', trackingId)
      .eq('mobile', mobile)
      .single()

    if (error) {
      console.error('Database error fetching booking:', error)
      if (error.code === 'PGRST116') {
        throw new Error('Booking not found or invalid credentials.')
      }
      throw new Error(`Failed to fetch booking: ${error.message}`)
    }

    return booking
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    throw error
  }
}

/**
 * Retrieves a soil test report by tracking ID
 * @param trackingId - The tracking ID of the report
 * @returns The report record
 * @throws Error if report not found
 */
export const getReportByTrackingId = async (trackingId: string) => {
  try {
    // Validate input
    trackingIdSchema.parse(trackingId)

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('tracking_id', trackingId)
      .single()

    if (error) {
      console.error('Database error fetching report:', error)
      if (error.code === 'PGRST116') {
        throw new Error('Report not found.')
      }
      throw new Error(`Failed to fetch report: ${error.message}`)
    }

    return report
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    throw error
  }
}

// Admin functions (require authentication)

/**
 * Retrieves all bookings for admin management
 * @returns Array of all booking records
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all bookings:', error)
    throw new Error('Failed to fetch bookings.')
  }

  return bookings as Booking[]
}

/**
 * Updates a booking's status
 * @param id - Booking ID
 * @param status - New status
 * @param paymentStatus - New payment status (optional)
 * @returns Updated booking record
 */
export const updateBookingStatus = async (id: string, status: string, paymentStatus?: string): Promise<Booking> => {
  const updateData: Partial<Booking> = { status }
  if (paymentStatus) updateData.payment_status = paymentStatus

  const { data: booking, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating booking:', error)
    throw new Error('Failed to update booking.')
  }

  return booking as Booking
}

/**
 * Retrieves all reports for admin management
 * @returns Array of all report records
 */
export const getAllReports = async (): Promise<SoilReport[]> => {
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all reports:', error)
    throw new Error('Failed to fetch reports.')
  }

  return reports as SoilReport[]
}

/**
 * Updates or creates a report
 * @param reportData - Report data
 * @returns Updated or created report record
 */
export const upsertReport = async (reportData: Partial<SoilReport>): Promise<SoilReport> => {
  const { data: report, error } = await supabase
    .from('reports')
    .upsert(reportData)
    .select()
    .single()

  if (error) {
    console.error('Error upserting report:', error)
    throw new Error('Failed to save report.')
  }

  return report as SoilReport
}
