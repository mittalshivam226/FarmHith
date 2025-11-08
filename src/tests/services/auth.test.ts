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
import { signInAdmin, signOutAdmin, getCurrentAdminSession } from '../../services/auth'

describe('Auth Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signInAdmin', () => {
    it('should sign in admin successfully', async () => {
      const credentials = { email: 'admin@example.com', password: 'password123' }
      const mockResponse = { user: { id: '123', email: credentials.email, user_metadata: { role: 'admin' } }, session: { access_token: 'token' } }

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockResponse,
        error: null
      })

      const result = await signInAdmin(credentials)

      expect(result).toEqual(mockResponse)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Admin signed in successfully',
        expect.objectContaining({ userId: '123' })
      )
    })

    it('should handle invalid credentials', async () => {
      const credentials = { email: 'admin@example.com', password: 'wrongpassword' }

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      })

      await expect(signInAdmin(credentials)).rejects.toThrow('Invalid admin credentials')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('signOutAdmin', () => {
    it('should sign out admin successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null
      })

      await expect(signOutAdmin()).resolves.toBeUndefined()
      expect(mockLogger.info).toHaveBeenCalledWith('Admin signed out successfully')
    })

    it('should handle sign out errors', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' }
      })

      await expect(signOutAdmin()).rejects.toThrow('Failed to sign out')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('getCurrentAdminSession', () => {
    it('should get current admin session successfully', async () => {
      const mockSessionData = { user: { id: '123', email: 'admin@example.com', user_metadata: { role: 'admin' } }, session: { access_token: 'token' } }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSessionData },
        error: null
      })

      const result = await getCurrentAdminSession()

      expect(result).toEqual({
        user: mockSessionData.user,
        session: mockSessionData
      })
      expect(mockLogger.info).not.toHaveBeenCalled() // No logging for successful session retrieval
    })

    it('should return null for no active session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      const result = await getCurrentAdminSession()

      expect(result).toBeNull()
    })
  })
})
