/**
 * Backward-compatibility shim.
 * Pages that use `useNavigation()` can continue to work while migrating.
 * New code should use `useAuth()` from AuthContext and `useNavigate()` from react-router-dom.
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { AuthUser } from '../services/auth';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  isPageLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Map legacy page keys to routes
const PAGE_ROUTES: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  'book-test': '/book-test',
  reports: '/reports',
  education: '/education',
  blog: '/blog',
  partners: '/partners',
  contact: '/contact',
  login: '/login',
  profile: '/profile',
  dashboard: '/dashboard',
  privacy: '/privacy',
  terms: '/terms',
  refund: '/refund',
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, refreshAuth } = useAuth();

  const navigateTo = (page: string) => {
    const route = PAGE_ROUTES[page] ?? `/${page}`;
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage: '',
        navigateTo,
        isAuthenticated,
        user,
        isPageLoading: false,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
