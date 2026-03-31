import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { getCurrentUserSession, signOutUser } from '../services/auth';
import type { User } from '@supabase/supabase-js';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
  isAuthenticated: boolean;
  user: User | null;
  isPageLoading: boolean;
  logout: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const navLoaderTimeout = useRef<number | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const session = await getCurrentUserSession();
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuth();
  }, []);

  const navigateTo = (page: string) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsPageLoading(true);
    setCurrentPage(page);
    if (navLoaderTimeout.current) {
      clearTimeout(navLoaderTimeout.current);
    }
    navLoaderTimeout.current = window.setTimeout(() => {
      setIsPageLoading(false);
    }, 420);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (navLoaderTimeout.current) {
        clearTimeout(navLoaderTimeout.current);
      }
    };
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setIsAuthenticated(false);
      setUser(null);
      navigateTo('home');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      navigateTo,
      isAuthenticated,
      user,
      isPageLoading,
      logout
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export { NavigationProvider, useNavigation };
