import { z } from 'zod'
import { Booking, SoilReport } from '../types'
import { logger } from '../utils/logger'
import { backendGet, backendPatch, backendPost } from './backendApi'

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

export interface BookingSubmissionData {
  farmer_name: string
  mobile: string
  village: string
  district: string
  state: string
  crop_type: string
  pickup_type: 'pickup' | 'drop'
  address?: string
  payment_method: string
  payment_status?: string
  status?: string
  package_id: string
  tracking_id: string
}

/**
 * Submits a new soil test booking
 */
export const submitBooking = async (data: BookingSubmissionData) => {
  try {
    const validatedData = bookingSubmissionSchema.parse(data)
    const booking = await backendPost<typeof validatedData, Booking>('/bookings', validatedData)

    logger.info('Booking submitted successfully', {
      id: booking.id,
      trackingId: booking.tracking_id,
    })

    return booking
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Booking validation failed', {
        issues: error.issues,
        trackingId: data.tracking_id,
      })
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    logger.error('Error submitting booking', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Retrieves a booking by tracking ID and mobile number for verification
 */
export const getBookingByTrackingId = async (trackingId: string, mobile: string) => {
  try {
    trackingIdSchema.parse(trackingId)
    mobileSchema.parse(mobile)

    const booking = await backendGet<Booking>(
      `/bookings/by-tracking?tracking_id=${encodeURIComponent(trackingId)}&mobile=${encodeURIComponent(mobile)}`
    )

    logger.info('Booking fetched successfully', {
      id: booking.id,
      trackingId,
    })

    return booking
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Booking fetch validation failed', {
        issues: error.issues,
        trackingId,
      })
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    logger.error('Error fetching booking', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Retrieves a soil test report by tracking ID
 */
export const getReportByTrackingId = async (trackingId: string) => {
  try {
    trackingIdSchema.parse(trackingId)

    const report = await backendGet<SoilReport>(
      `/reports/by-tracking?tracking_id=${encodeURIComponent(trackingId)}`
    )

    logger.info('Report fetched successfully', {
      id: report.id,
      trackingId,
    })

    return report
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Report fetch validation failed', {
        issues: error.issues,
        trackingId,
      })
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    logger.error('Error fetching report', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Retrieves all bookings for admin management
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookings = await backendGet<Booking[]>('/bookings')
    logger.info('All bookings fetched successfully', { count: bookings.length })
    return bookings
  } catch (error) {
    logger.error('Error fetching all bookings', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Updates a booking's status
 */
export const updateBookingStatus = async (id: string, status: string, paymentStatus?: string): Promise<Booking> => {
  try {
    const booking = await backendPatch<{ status: string; payment_status?: string }, Booking>(
      `/bookings/${id}/status`,
      { status, ...(paymentStatus ? { payment_status: paymentStatus } : {}) }
    )

    logger.info('Booking status updated successfully', {
      id,
      status,
      paymentStatus,
    })

    return booking
  } catch (error) {
    logger.error('Error updating booking', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Retrieves all reports for admin management
 */
export const getAllReports = async (): Promise<SoilReport[]> => {
  try {
    const reports = await backendGet<SoilReport[]>('/reports')
    logger.info('All reports fetched successfully', { count: reports.length })
    return reports
  } catch (error) {
    logger.error('Error fetching all reports', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Updates or creates a report
 */
export const upsertReport = async (reportData: Partial<SoilReport>): Promise<SoilReport> => {
  try {
    const report = await backendPost<Partial<SoilReport>, SoilReport>('/reports/upsert', reportData)
    logger.info('Report upserted successfully', {
      id: report.id,
      trackingId: report.tracking_id,
    })
    return report
  } catch (error) {
    logger.error('Error upserting report', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}
