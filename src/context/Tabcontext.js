import React, { createContext, useState, useEffect } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState(() => {
    // Retrieve the selected tab from localStorage or default to "dashboard"
    return localStorage.getItem('selectedTab') || 'dashboard';
  });

  useEffect(() => {
    // Update localStorage whenever currentTab changes
    localStorage.setItem('selectedTab', currentTab);
  }, [currentTab]);

  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};