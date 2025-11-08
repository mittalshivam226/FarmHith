import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockSupabase, mockLogger } from '../utils/testHelpers'

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}))

// Mock the logger
vi.mock('../../utils/logger', () => ({
  logger: mockLogger
}))

// Import after mocks
import { submitContactMessage } from '../../services/contact'

describe('Contact Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitContactMessage', () => {
    it('should submit a contact message successfully', async () => {
      const testMessage = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        subject: 'Test Subject',
        message: 'Test message content'
      }
      const mockResponse = { ...testMessage, id: '123', status: 'pending' }

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

      const result = await submitContactMessage(testMessage)

      expect(result).toEqual(mockResponse)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Contact message submitted successfully',
        expect.objectContaining({ id: '123' })
      )
    })

    it('should handle validation errors', async () => {
      const invalidMessage = {
        name: '',
        email: 'invalid-email',
        phone: '123',
        subject: 'Test',
        message: 'Test message'
      }

      await expect(submitContactMessage(invalidMessage)).rejects.toThrow('Validation failed')
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Contact message validation failed',
        expect.any(Object)
      )
    })

    it('should handle database errors', async () => {
      const testMessage = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        subject: 'Test Subject',
        message: 'Test message content'
      }

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

      await expect(submitContactMessage(testMessage)).rejects.toThrow('Failed to send message. Please try again.')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
