"use client"
import { Inter } from 'next/font/google';
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { metadata } from './layout-metadata';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
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
  const pathname = router.pathname;

  // List of public routes that don't require authentication
  const publicRoutes = [
    '/admin-Login',
    '/forget-password',
    '/reset-password'
  ];

  const checkTokenExpiration = () => {
    // Skip token check for public routes
    if (publicRoutes.some(route => window.location.pathname.includes(route))) {
      return;
    }

    const token = Cookies.get('authToken');
    
    if (!token) {
      console.log('📋 No token found, redirecting to login');
      // Reset tab to dashboard when token is missing
      localStorage.setItem('selectedTab', 'dashboard');
      router.replace('/admin-Login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const isExpired = expirationTime < currentTime;
      
      console.log('🔍 Token check:', {
        expired: isExpired,
        timeRemaining: Math.floor((expirationTime - currentTime) / 1000 / 60), // minutes
        role: payload.role,
        userId: payload.sub || payload.userId
      });
      
      if (window.location.pathname.startsWith('/admin')) {
        if (payload.role !== 'admin') {
          console.log('❌ Non-admin user trying to access admin area');
          Cookies.remove("authToken", { path: "/" });
          localStorage.setItem('selectedTab', 'dashboard'); // Reset tab
          router.replace('/admin-Login');
          return;
        }
      }
      
      if (isExpired) {
        console.log('⏰ Token expired, logging out');
        Cookies.remove("authToken", { path: "/" });
        localStorage.setItem('selectedTab', 'dashboard'); // Reset tab
        router.replace('/admin-Login');
      }
      
      return { isExpired, timeUntilExpiry: expirationTime - currentTime };
    } catch (error) {
      console.error('❌ Token decode error:', error);
      console.log('Token value:', token?.substring(0, 50) + '...');
      // Don't logout on decode error if it's just a refresh - wait a moment
      setTimeout(() => {
        const retryToken = Cookies.get('authToken');
        if (!retryToken) {
          console.log('No token on retry, logging out');
          Cookies.remove("authToken", { path: "/" });
          localStorage.setItem('selectedTab', 'dashboard');
          router.replace('/admin-Login');
        }
      }, 1000);
    }
  };

  useEffect(() => {
    // Completely disable automatic token checking to prevent logout issues
    console.log('🔄 Layout token validation completely disabled');
    console.log('📋 AuthGuard handles all token validation now');
    
    // No token validation in layout - AuthGuard handles everything
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body className='bg-[#F5F5F5]'>
        <Toaster position="top-right" />
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
