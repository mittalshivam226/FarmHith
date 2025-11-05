import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
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
