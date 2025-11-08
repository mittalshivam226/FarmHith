import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'
import type { User, Session } from '@supabase/supabase-js'

export interface AdminCredentials {
  email: string
  password: string
}

export interface AdminSession {
  user: User
  session: Session
}

/**
 * Signs in an admin user
 * @param credentials - Admin email and password
 * @returns Admin session information
 * @throws Error if authentication fails
 */
export const signInAdmin = async (credentials: AdminCredentials): Promise<AdminSession> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      logger.error('Admin authentication failed', {
        error: error.message,
        email: credentials.email,
      })
      throw new Error('Invalid admin credentials')
    }

    // Verify admin role (assuming role is stored in user metadata)
    if (!data.user?.user_metadata?.role || data.user.user_metadata.role !== 'admin') {
      logger.warn('Non-admin user attempted admin login', {
        userId: data.user?.id,
        email: credentials.email,
      })
      await supabase.auth.signOut()
      throw new Error('Access denied: Admin privileges required')
    }

    logger.info('Admin signed in successfully', {
      userId: data.user.id,
      email: credentials.email,
    })

    return {
      user: data.user,
      session: data.session!,
    }
  } catch (error) {
    logger.error('Admin sign-in error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Signs out the current admin user
 * @throws Error if sign-out fails
 */
export const signOutAdmin = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.error('Admin sign-out failed', { error: error.message })
      throw new Error('Failed to sign out')
    }

    logger.info('Admin signed out successfully')
  } catch (error) {
    logger.error('Admin sign-out error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Gets the current admin session
 * @returns Current admin session or null if not authenticated
 */
export const getCurrentAdminSession = async (): Promise<AdminSession | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      logger.error('Failed to get admin session', { error: error.message })
      return null
    }

    if (!session || !session.user?.user_metadata?.role || session.user.user_metadata.role !== 'admin') {
      return null
    }

    return {
      user: session.user,
      session,
    }
  } catch (error) {
    logger.error('Error getting current admin session', { error: error instanceof Error ? error.message : String(error) })
    return null
  }
}

/**
 * Checks if the current user is an authenticated admin
 * @returns True if user is authenticated admin, false otherwise
 */
export const isAdminAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentAdminSession()
  return session !== null
}

/**
 * Refreshes the admin session
 * @returns Refreshed admin session
 * @throws Error if refresh fails or user is not admin
 */
export const refreshAdminSession = async (): Promise<AdminSession> => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      logger.error('Admin session refresh failed', { error: error.message })
      throw new Error('Failed to refresh session')
    }

    if (!data.user?.user_metadata?.role || data.user.user_metadata.role !== 'admin') {
      logger.warn('Non-admin user session refresh attempted', {
        userId: data.user?.id,
      })
      await supabase.auth.signOut()
      throw new Error('Access denied: Admin privileges required')
    }

    logger.info('Admin session refreshed successfully', {
      userId: data.user.id,
    })

    return {
      user: data.user,
      session: data.session!,
    }
  } catch (error) {
    logger.error('Admin session refresh error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}
