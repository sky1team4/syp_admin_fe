import React, { createContext, useState, useEffect } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('dashboard'); // Ensure consistent SSR rendering

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        setCurrentTab(savedTab); // Update state after hydration
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedTab', currentTab);
    }
  }, [currentTab]);

  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export default TabProvider;
