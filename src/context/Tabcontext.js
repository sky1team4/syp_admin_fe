'use client'

import React, { createContext, useState, useEffect } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved tab after component mounts
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      setCurrentTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('selectedTab', currentTab === 'logout' ? 'dashboard' : currentTab);
    }
  }, [currentTab, mounted]);

  // Don't render children until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export default TabProvider;
