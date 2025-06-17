'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { validateToken, refreshToken, emergencyRecovery } from '@/hooks/useNotifications';
import { logout } from '@/redux/features/authSlice';
import Cookies from 'js-cookie';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [lastPathname, setLastPathname] = useState('');

  // Public routes that don't require authentication
  const publicRoutes = ['/admin-Login', '/forget-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔒 AuthGuard.checkAuth() called');
      console.log('   - Current pathname:', pathname);
      console.log('   - Last pathname:', lastPathname);
      console.log('   - Is public route:', isPublicRoute);
      console.log('   - Current isValid:', isValid);
      console.log('   - Trigger timestamp:', new Date().toISOString());
      
      // Skip auth check for public routes
      if (isPublicRoute) {
        console.log('🔒 Public route detected, allowing access');
        setIsValid(true);
        setIsChecking(false);
        return;
      }

      // Skip repeated checks for the same route to prevent logout loops
      if (pathname === lastPathname && isValid) {
        console.log('🔒 Same route and valid, skipping auth check to prevent loops');
        setIsChecking(false);
        return;
      }

      console.log('🔒 Running auth validation...');
      
      try {
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.log('🔒 No token found, redirecting to login');
          setIsValid(false);
          setIsChecking(false);
          router.replace('/admin-Login');
          return;
        }

        console.log('🔒 Token exists, validating...');
        
        // Use a more lenient token validation approach
        let validation;
        try {
          validation = validateToken();
          console.log('🔒 Token validation result:', validation);
        } catch (error) {
          console.error('🔒 Token validation error:', error);
          // Don't immediately logout on validation errors - give it a moment
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Retry validation once
          try {
            validation = validateToken();
            console.log('🔒 Token validation retry result:', validation);
          } catch (retryError) {
            console.error('🔒 Token validation retry failed:', retryError);
            validation = { valid: false, reason: 'validation_error' };
          }
        }
        
        if (!validation.valid) {
          console.log('🔒 Token invalid, reason:', validation.reason);
          
          // Only attempt refresh if token exists but is expired/invalid
          if (validation.reason === 'expired') {
            console.log('⏰ Token expired, attempting refresh...');
            
            try {
              const refreshed = await refreshToken();
              
              if (refreshed) {
                console.log('✅ Token refreshed successfully');
                setIsValid(true);
                setLastPathname(pathname);
              } else {
                console.log('❌ Token refresh failed, logging out');
                console.log('🚨 LOGOUT TRIGGERED BY: Token refresh failure');
                dispatch(logout());
                router.replace('/admin-Login');
                setIsValid(false);
              }
            } catch (refreshError) {
              console.error('🔒 Token refresh error:', refreshError);
              // Don't logout immediately - token might still be valid
              console.log('⚠️ Token refresh failed but not logging out yet');
              setIsValid(true); // Give it a chance
              setLastPathname(pathname);
            }
          } else if (validation.reason === 'missing') {
            console.log('❌ No token, redirecting to login');
            console.log('🚨 LOGOUT TRIGGERED BY: Missing token');
            router.replace('/admin-Login');
            setIsValid(false);
          } else {
            // For other validation failures, be more lenient
            console.warn(`⚠️ Token validation issue: ${validation.reason}`);
            console.log('🔄 Allowing access but monitoring token status');
            setIsValid(true); // Allow access despite validation issues
            setLastPathname(pathname);
          }
        } else {
          console.log('✅ Token valid, allowing access');
          setIsValid(true);
          setLastPathname(pathname);
        }
      } catch (error) {
        console.error('🔒 Auth check error:', error);
        // Don't automatically logout on network errors or other issues
        console.log('⚠️ Auth check failed but not logging out (network error?)');
        setIsValid(true); // Allow access despite error
        setLastPathname(pathname);
      } finally {
        setIsChecking(false);
      }
    };

    console.log('🔒 AuthGuard useEffect triggered');
    console.log('   - Dependencies changed:');
    console.log('     - pathname:', pathname, '(was:', lastPathname, ')');
    console.log('     - isValid:', isValid);
    console.log('     - Component render timestamp:', new Date().toISOString());

    // Only run auth check if we haven't checked this route recently
    if (pathname !== lastPathname || !isValid) {
      console.log('🔒 Auth check needed, running checkAuth()');
      checkAuth();
    } else {
      console.log('🔒 No auth check needed');
      setIsChecking(false);
    }
  }, [pathname, isPublicRoute, router, dispatch, lastPathname, isValid]);

  // Show loading spinner while checking auth (but only for initial load)
  if (isChecking && !isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // For public routes or valid auth, render children
  if (isPublicRoute || isValid) {
    return children;
  }

  // For invalid auth on protected routes, show nothing (redirect will happen)
  return null;
};

export default AuthGuard; 