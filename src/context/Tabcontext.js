import React, { createContext, useState, useEffect } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  // const [currentTab, setCurrentTab] = useState(() => {
  //   // Check if localStorage is available
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     // Retrieve the selected tab from localStorage or default to "dashboard"
  //     return localStorage.getItem('selectedTab') || 'dashboard';
  //   }
  //   return 'dashboard'; // Default value if localStorage is not available
  // });

  const [currentTab, setCurrentTab] = useState('dashboard')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        setCurrentTab(savedTab);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedTab', currentTab);
    }
  }, [currentTab]);

  // const handleTabChange = (newTab) => {
  //   if (newTab === 'signout') {
  //     // Reset to dashboard when signing out
  //     setCurrentTab('dashboard');
  //     if (typeof window !== 'undefined' && window.localStorage) {
  //       localStorage.setItem('selectedTab', 'dashboard');
  //     }
  //   } else {
  //     setCurrentTab(newTab);
  //     if (typeof window !== 'undefined' && window.localStorage) {
  //       localStorage.setItem('selectedTab', newTab);
  //     }
  //   }
  // };

  return (
    <>
      <TabContext.Provider value={{ currentTab, setCurrentTab }}>
        {children}
      </TabContext.Provider>
    </>
  );
};

export default TabProvider;
