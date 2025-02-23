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

    const token = localStorage.getItem('token');
    
    if (!token) {
      // console.log("checkTokenExpiration = " , false);
      router.push('/admin-Login');
      return;
    }

    try {
      // Decode the JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const isExpired = expirationTime < currentTime;
      
      if (isExpired) {
        localStorage.removeItem('token');
        Cookies.remove("authToken", { path: "/" });
        router.push('/admin-Login');
      }
      
      return { isExpired, timeUntilExpiry: expirationTime - currentTime };
    } catch (error) {
      // console.error('Error checking token:', error);
      router.push('/admin-Login');
    }
  };

  useEffect(() => {
    const tokenStatus = checkTokenExpiration();
    
    if (tokenStatus && !tokenStatus.isExpired) {
      // Set up check only when token is close to expiring (e.g., 5 minutes before)
      const checkBeforeExpiry = Math.max(tokenStatus.timeUntilExpiry - 5 * 60 * 1000, 0);
      const timeout = setTimeout(() => {
        // Once we're close to expiry, start checking more frequently
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
      }, checkBeforeExpiry);
      
      return () => clearTimeout(timeout);
    }
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
