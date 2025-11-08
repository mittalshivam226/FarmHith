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
import { RateLimiter } from '../../services/rateLimit'

describe('Rate Limit Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('RateLimiter.checkLimit', () => {
    it('should return success for rate limit check', async () => {
      const identifier = '192.168.1.1'
      const config = { windowMs: 60000, maxRequests: 10 }

      const result = await RateLimiter.checkLimit(identifier, config)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(9)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })
  })

  describe('RateLimiter.getRemainingRequests', () => {
    it('should return remaining requests', async () => {
      const identifier = '192.168.1.1'

      const result = await RateLimiter.getRemainingRequests(identifier)

      expect(result).toBe(10)
    })
  })

  describe('RateLimiter.getResetTime', () => {
    it('should return reset time', async () => {
      const identifier = '192.168.1.1'

      const result = await RateLimiter.getResetTime(identifier)

      expect(result).toBeGreaterThan(Date.now())
    })
  })
})
