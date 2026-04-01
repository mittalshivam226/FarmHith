import { backendGet, backendPost, backendPut } from './backendApi';
import { logger } from '../utils/logger';
import type { UserProfile, UserProfileFormData } from '../types';

export interface UserCredentials {
  phone: string;
  password?: string;
  otp?: string;
}

export interface PhoneSignInData {
  phone: string;
}

export interface AuthUser {
  id: string;
  role: string;
  phone: string;
  name: string;
  email?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

interface TokenBundle {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_seconds: number;
}

interface VerifyOtpResponse extends TokenBundle {
  user: AuthUser;
  needs_profile_completion: boolean;
}

interface RequestOtpResponse {
  message: string;
  expires_in_seconds: number;
  otp_length: number;
  dev_otp?: string;
}

export interface UserSession {
  user: AuthUser;
  session: TokenBundle;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminSession {
  user: AuthUser;
  session: TokenBundle;
}

const ACCESS_TOKEN_KEY = 'farmhith_access_token';
const REFRESH_TOKEN_KEY = 'farmhith_refresh_token';
const USER_KEY = 'farmhith_user';

const isBrowser = typeof window !== 'undefined';

function setStoredValue(key: string, value: string) {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
}

function getStoredValue(key: string): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
}

function removeStoredValue(key: string) {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

function storeUser(user: AuthUser) {
  setStoredValue(USER_KEY, JSON.stringify(user));
}

function getStoredUser(): AuthUser | null {
  const rawUser = getStoredValue(USER_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

function clearStoredAuth() {
  removeStoredValue(ACCESS_TOKEN_KEY);
  removeStoredValue(REFRESH_TOKEN_KEY);
  removeStoredValue(USER_KEY);
}

function toTokenBundle(accessToken: string, refreshToken: string, expiresInSeconds: number): TokenBundle {
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
    expires_in_seconds: expiresInSeconds,
  };
}

function persistSession(data: VerifyOtpResponse | TokenBundle, user?: AuthUser) {
  setStoredValue(ACCESS_TOKEN_KEY, data.access_token);
  setStoredValue(REFRESH_TOKEN_KEY, data.refresh_token);
  if ('user' in data && data.user) {
    storeUser(data.user);
  } else if (user) {
    storeUser(user);
  }
}

function toUserProfile(user: AuthUser): UserProfile {
  return {
    id: user.id,
    user_id: user.id,
    name: user.name,
    email: user.email || undefined,
    phone: user.phone,
    village: user.village || undefined,
    district: user.district || undefined,
    state: user.state || undefined,
    address: user.address || undefined,
    farm_details: undefined,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export const getAccessToken = (): string | null => getStoredValue(ACCESS_TOKEN_KEY);

const getRefreshToken = (): string | null => getStoredValue(REFRESH_TOKEN_KEY);

/**
 * Temporary placeholder while admin auth migration is pending.
 */
export const signInAdmin = async (_credentials: AdminCredentials): Promise<AdminSession> => {
  throw new Error('Admin email/password login is not configured in backend yet.');
};

export const signOutAdmin = async (): Promise<void> => {
  clearStoredAuth();
};

export const getCurrentAdminSession = async (): Promise<AdminSession | null> => {
  const session = await getCurrentUserSession();
  if (!session || session.user.role !== 'admin') return null;
  return session;
};

export const isAdminAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentAdminSession();
  return session !== null;
};

export const refreshAdminSession = async (): Promise<AdminSession> => {
  const session = await refreshUserSession();
  if (session.user.role !== 'admin') {
    throw new Error('Access denied: Admin privileges required');
  }
  return session;
};

/**
 * Sends OTP to phone number for sign in
 */
export const sendPhoneOTP = async (phoneData: PhoneSignInData): Promise<void> => {
  try {
    const response = await backendPost<PhoneSignInData, RequestOtpResponse>('/auth/otp/request', {
      phone: phoneData.phone,
    });

    logger.info('OTP sent successfully', {
      phone: phoneData.phone,
      ...(response.dev_otp ? { devOtpAvailable: true } : {}),
    });
  } catch (error) {
    logger.error('Phone OTP sending failed', {
      phone: phoneData.phone,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Verifies OTP and signs in user
 */
export const verifyPhoneOTP = async (credentials: UserCredentials): Promise<UserSession> => {
  try {
    if (!credentials.otp) {
      throw new Error('OTP is required');
    }

    const data = await backendPost<{ phone: string; otp: string }, VerifyOtpResponse>('/auth/otp/verify', {
      phone: credentials.phone,
      otp: credentials.otp,
    });

    persistSession(data);

    logger.info('User signed in successfully with phone', {
      userId: data.user.id,
      phone: credentials.phone,
      needsProfileCompletion: data.needs_profile_completion,
    });

    return {
      user: data.user,
      session: toTokenBundle(data.access_token, data.refresh_token, data.expires_in_seconds),
    };
  } catch (error) {
    logger.error('Phone OTP verification failed', {
      phone: credentials.phone,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Creates or updates user profile after authentication
 */
export const createOrUpdateUserProfile = async (profileData: UserProfileFormData): Promise<UserProfile> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('User not authenticated');
  }

  try {
    const payload = {
      name: profileData.name,
      email: profileData.email || undefined,
      village: profileData.village || undefined,
      district: profileData.district || undefined,
      state: profileData.state || undefined,
      address: profileData.address || undefined,
    };

    const updatedUser = await backendPut<typeof payload, AuthUser>(
      '/auth/profile',
      payload,
      accessToken
    );

    storeUser(updatedUser);

    logger.info('User profile created/updated successfully', {
      userId: updatedUser.id,
    });

    return toUserProfile(updatedUser);
  } catch (error) {
    logger.error('User profile creation/update failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Gets the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const session = await getCurrentUserSession();
    if (!session) return null;
    return toUserProfile(session.user);
  } catch (error) {
    logger.error('User profile fetch failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

/**
 * Signs out the current user
 */
export const signOutUser = async (): Promise<void> => {
  const accessToken = getAccessToken();
  try {
    if (accessToken) {
      await backendPost<undefined, { message: string }>('/auth/logout', undefined, accessToken);
    }
  } catch (error) {
    logger.warn('User sign-out request failed, clearing local session anyway', {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    clearStoredAuth();
  }
};

/**
 * Gets the current user session
 */
export const getCurrentUserSession = async (): Promise<UserSession | null> => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    const user = await backendGet<AuthUser>('/auth/me', accessToken);
    storeUser(user);
    return {
      user,
      session: toTokenBundle(accessToken, refreshToken, 0),
    };
  } catch (error) {
    logger.warn('Access token check failed, trying refresh', {
      error: error instanceof Error ? error.message : String(error),
    });
    try {
      return await refreshUserSession();
    } catch {
      clearStoredAuth();
      return null;
    }
  }
};

/**
 * Checks if the current user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentUserSession();
  return session !== null;
};

/**
 * Refreshes the user session using refresh token
 */
export const refreshUserSession = async (): Promise<UserSession> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const refreshedTokens = await backendPost<{ refresh_token: string }, TokenBundle>(
    '/auth/refresh',
    { refresh_token: refreshToken }
  );

  const existingUser = getStoredUser();
  persistSession(refreshedTokens, existingUser || undefined);

  const user = await backendGet<AuthUser>('/auth/me', refreshedTokens.access_token);
  storeUser(user);

  logger.info('User session refreshed successfully', {
    userId: user.id,
  });

  return {
    user,
    session: toTokenBundle(
      refreshedTokens.access_token,
      refreshedTokens.refresh_token,
      refreshedTokens.expires_in_seconds
    ),
  };
};
