import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile, UserProfileFormData } from '../types'

export interface UserCredentials {
  phone: string
  password?: string
  otp?: string
}

export interface PhoneSignInData {
  phone: string
}

export interface UserSession {
  user: User
  session: Session
}

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

/**
 * Sends OTP to phone number for sign in
 * @param phoneData - Phone number
 * @throws Error if OTP sending fails
 */
export const sendPhoneOTP = async (phoneData: PhoneSignInData): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneData.phone,
    })

    if (error) {
      logger.error('Phone OTP sending failed', {
        error: error.message,
        phone: phoneData.phone,
      })
      throw new Error('Failed to send OTP')
    }

    logger.info('OTP sent successfully', {
      phone: phoneData.phone,
    })
  } catch (error) {
    logger.error('Phone OTP sending error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Verifies OTP and signs in user
 * @param credentials - Phone and OTP
 * @returns User session information
 * @throws Error if verification fails
 */
export const verifyPhoneOTP = async (credentials: UserCredentials): Promise<UserSession> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: credentials.phone,
      token: credentials.otp!,
      type: 'sms',
    })

    if (error) {
      logger.error('Phone OTP verification failed', {
        error: error.message,
        phone: credentials.phone,
      })
      throw new Error('Invalid OTP')
    }

    logger.info('User signed in successfully with phone', {
      userId: data.user!.id,
      phone: credentials.phone,
    })

    return {
      user: data.user!,
      session: data.session!,
    }
  } catch (error) {
    logger.error('Phone OTP verification error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Creates or updates user profile after authentication
 * @param profileData - User profile information
 * @returns Created/updated user profile
 * @throws Error if profile creation/update fails
 */
export const createOrUpdateUserProfile = async (profileData: UserProfileFormData): Promise<UserProfile> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.error('User not authenticated for profile creation', { error: authError?.message })
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        name: profileData.name,
        email: profileData.email,
        phone: user.phone || '',
        village: profileData.village,
        district: profileData.district,
        state: profileData.state,
        address: profileData.address,
        farm_details: profileData.farm_details,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      logger.error('User profile creation/update failed', {
        error: error.message,
        userId: user.id,
      })
      throw new Error('Failed to save profile')
    }

    logger.info('User profile created/updated successfully', {
      userId: user.id,
      profileId: data.id,
    })

    return data
  } catch (error) {
    logger.error('User profile creation/update error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Gets the current user's profile
 * @returns User profile or null if not found
 * @throws Error if query fails
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.error('User not authenticated for profile fetch', { error: authError?.message })
      return null
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null
      }
      logger.error('User profile fetch failed', {
        error: error.message,
        userId: user.id,
      })
      throw new Error('Failed to fetch profile')
    }

    return data
  } catch (error) {
    logger.error('User profile fetch error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Signs out the current user
 * @throws Error if sign-out fails
 */
export const signOutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.error('User sign-out failed', { error: error.message })
      throw new Error('Failed to sign out')
    }

    logger.info('User signed out successfully')
  } catch (error) {
    logger.error('User sign-out error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Gets the current user session
 * @returns Current user session or null if not authenticated
 */
export const getCurrentUserSession = async (): Promise<UserSession | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      logger.error('Failed to get user session', { error: error.message })
      return null
    }

    if (!session) {
      return null
    }

    return {
      user: session.user,
      session,
    }
  } catch (error) {
    logger.error('Error getting current user session', { error: error instanceof Error ? error.message : String(error) })
    return null
  }
}

/**
 * Checks if the current user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentUserSession()
  return session !== null
}

/**
 * Refreshes the user session
 * @returns Refreshed user session
 * @throws Error if refresh fails
 */
export const refreshUserSession = async (): Promise<UserSession> => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      logger.error('User session refresh failed', { error: error.message })
      throw new Error('Failed to refresh session')
    }

    logger.info('User session refreshed successfully', {
      userId: data.user!.id,
    })

    return {
      user: data.user!,
      session: data.session!,
    }
  } catch (error) {
    logger.error('User session refresh error', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}
