"use client"
import { Inter } from 'next/font/google';
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { metadata } from './layout-metadata';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const executeCommand = async () => {
  const response = await fetch("/api/execute-command");
  const data = await response.json();
  console.log(data.output);
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const router = useRouter();

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log("checkTokenExpiration = " , false);
      router.push('/admin-Login');
      return;
    }

    try {
      // Decode the JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem('token');
        router.push('/admin-Login');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      router.push('/admin-Login');
    }
  };

  useEffect(() => {
    checkTokenExpiration();
    // Optional: Set up interval to periodically check token expiration
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
