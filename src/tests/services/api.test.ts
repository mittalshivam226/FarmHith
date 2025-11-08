import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockSupabase, generateTestBookingSubmission, generateTestBooking, generateTestReport, mockLogger } from '../utils/testHelpers'

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}))

// Mock the logger
vi.mock('../../utils/logger', () => ({
  logger: mockLogger
}))

// Import after mocks
import { submitBooking, getBookingByTrackingId, getReportByTrackingId } from '../../services/api'

describe('API Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitBooking', () => {
    it('should submit a booking successfully', async () => {
      const testBooking = generateTestBookingSubmission()
      const mockResponse = { ...testBooking, id: '123' }

      // Mock successful response
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockResponse,
              error: null
            })
          })
        })
      })

      const result = await submitBooking(testBooking)

      expect(result).toEqual(mockResponse)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Booking submitted successfully',
        expect.objectContaining({
          id: '123',
          trackingId: testBooking.tracking_id
        })
      )
    })

    it('should handle validation errors', async () => {
      const invalidBooking = generateTestBookingSubmission({ mobile: 'invalid' })

      await expect(submitBooking(invalidBooking)).rejects.toThrow('Validation failed')
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Booking validation failed',
        expect.any(Object)
      )
    })

    it('should handle database errors', async () => {
      const testBooking = generateTestBookingSubmission()

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' }
            })
          })
        })
      })

      await expect(submitBooking(testBooking)).rejects.toThrow('Failed to submit booking')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('getBookingByTrackingId', () => {
    it('should retrieve a booking successfully', async () => {
      const testBooking = generateTestBooking()
      const mockResponse = { ...testBooking, id: '123' }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockResponse,
                error: null
              })
            })
          })
        })
      })

      const result = await getBookingByTrackingId(testBooking.tracking_id, testBooking.mobile)

      expect(result).toEqual(mockResponse)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Booking fetched successfully',
        expect.objectContaining({ id: '123' })
      )
    })

    it('should handle booking not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
              })
            })
          })
        })
      })

      await expect(getBookingByTrackingId('INVALID', '9876543210')).rejects.toThrow('Booking not found')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('getReportByTrackingId', () => {
    it('should retrieve a report successfully', async () => {
      const testReport = generateTestReport()
      const mockResponse = { ...testReport, id: '456' }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockResponse,
              error: null
            })
          })
        })
      })

      const result = await getReportByTrackingId(testReport.tracking_id)

      expect(result).toEqual(mockResponse)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Report fetched successfully',
        expect.objectContaining({ id: '456' })
      )
    })

    it('should handle report not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }
            })
          })
        })
      })

      await expect(getReportByTrackingId('INVALID')).rejects.toThrow('Report not found')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
