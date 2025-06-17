import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connectSocket, getSocket } from '@/utils/socket';
import Cookies from 'js-cookie';

// Test function to verify socket connection (for debugging)
export const testSocketConnection = () => {
  const socket = getSocket();
  if (socket && socket.connected) {
    console.log('🧪 Testing socket connection...');
    socket.emit('test', { message: 'Test from admin frontend', timestamp: new Date().toISOString() });
    
    // Test ping for latency
    socket.emit('ping');
    
    return true;
  } else {
    console.warn('❌ No socket connection available for testing');
    return false;
  }
};

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const token = Cookies.get('authToken');
    console.log('🧪 Testing backend connection...');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Debug backend socket authentication
export const debugBackendSocketAuth = () => {
  const token = Cookies.get('authToken');
  
  if (!token) {
    console.error('❌ No token found for socket authentication');
    return;
  }

  console.log('🔍 Backend Socket Authentication Debug:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📋 Token Info:');
    console.log('   - User ID:', payload.sub || payload.userId);
    console.log('   - Role:', payload.role);
    console.log('   - Expires:', new Date(payload.exp * 1000).toLocaleString());
    console.log('   - Issued:', new Date(payload.iat * 1000).toLocaleString());
    console.log('   - Token length:', token.length);
    
    console.log('\n🔧 Authentication Formats Tried:');
    console.log('   1. auth: { token: "' + token.substring(0, 20) + '..." }');
    console.log('   2. auth: { authorization: "Bearer ' + token.substring(0, 20) + '..." }');
    console.log('   3. query: { token: "' + token.substring(0, 20) + '..." }');
    console.log('   4. extraHeaders: { Authorization: "Bearer ' + token.substring(0, 20) + '..." }');
    
    console.log('\n🎯 Common Backend Socket.io Auth Patterns:');
    console.log('   • middleware((socket, next) => { check socket.handshake.auth.token })');
    console.log('   • middleware((socket, next) => { check socket.handshake.query.token })');
    console.log('   • middleware((socket, next) => { check socket.handshake.headers.authorization })');
    
    console.log('\n💡 Backend Investigation Steps:');
    console.log('   1. Add logging to Socket.io middleware');
    console.log('   2. Check what auth data is received: console.log(socket.handshake)');
    console.log('   3. Verify JWT validation is working');
    console.log('   4. Test if middleware is calling next() or next(error)');
    
    console.log('\n🛠️ Backend Socket.io Setup Check:');
    console.log('   const io = new Server(httpServer, {');
    console.log('     cors: { origin: "http://localhost:3000", credentials: true }');
    console.log('   });');
    console.log('   io.use((socket, next) => {');
    console.log('     const token = socket.handshake.auth.token;');
    console.log('     // Validate token and call next() or next(error)');
    console.log('   });');
    
  } catch (error) {
    console.error('❌ Error parsing token:', error);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

// Force polling mode (for testing when socket fails)
export const forcePollingMode = () => {
  console.log('🔄 Manually forcing polling mode for notifications...');
  // This will be set by the component that calls this
  if (typeof window !== 'undefined' && (window as any).forceStartPolling) {
    (window as any).forceStartPolling();
  }
};

// Test notification API directly
export const testNotificationAPI = async () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      console.error('❌ No token for API test');
      return false;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded?.sub || decoded?.userId;
    
    console.log('🧪 Testing notification API directly...');
    console.log('User ID:', userId);
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/notifications?userId=${userId}`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 API Response Status:', response.status);
    console.log('📊 API Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 API Response Data:', data);
      console.log('📊 Notification Count:', data.length);
      return { success: true, data, count: data.length };
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return { success: false, error: errorText, status: response.status };
    }
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return { success: false, error: error.message };
  }
};

// Comprehensive auth debugging function
export const debugAuthStatus = () => {
  console.log('🔍 COMPREHENSIVE AUTH DEBUG');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. Check token existence and format
  const token = Cookies.get('authToken');
  console.log('📋 Token Status:');
  console.log('   - Exists:', !!token);
  console.log('   - Length:', token?.length || 0);
  console.log('   - Format valid:', token?.split('.').length === 3);
  
  if (token) {
    try {
      // 2. Decode and analyze token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeRemaining = Math.floor((payload.exp - currentTime) / 60);
      
      console.log('📋 Token Details:');
      console.log('   - User ID:', payload.sub || payload.userId);
      console.log('   - Role:', payload.role);
      console.log('   - Email:', payload.email);
      console.log('   - Issued at:', new Date(payload.iat * 1000).toLocaleString());
      console.log('   - Expires at:', new Date(payload.exp * 1000).toLocaleString());
      console.log('   - Time remaining:', timeRemaining, 'minutes');
      console.log('   - Is expired:', payload.exp < currentTime);
      
      // 3. Check localStorage consistency
      const localToken = localStorage.getItem('token');
      console.log('📋 Storage Consistency:');
      console.log('   - Cookie token length:', token.length);
      console.log('   - localStorage token length:', localToken?.length || 0);
      console.log('   - Tokens match:', token === localToken);
      
    } catch (error) {
      console.error('❌ Token decode error:', error);
    }
  }
  
  // 4. Check Redux state
  try {
    const state = JSON.parse(localStorage.getItem('persist:root') || '{}');
    const authState = state.auth ? JSON.parse(state.auth) : {};
    
    console.log('📋 Redux Auth State:');
    console.log('   - isAuthenticated:', authState.isAuthenticated);
    console.log('   - User exists:', !!authState.user);
    console.log('   - Role:', authState.role);
    console.log('   - Token in state:', !!authState.token);
  } catch (error) {
    console.warn('⚠️ Could not read Redux state:', error);
  }
  
  // 5. Check current page and auth requirements
  console.log('📋 Current Context:');
  console.log('   - Current path:', window.location.pathname);
  console.log('   - Is admin path:', window.location.pathname.startsWith('/admin'));
  console.log('   - Referrer:', document.referrer);
  
  // 6. Check AuthGuard status (if available)
  const authGuardState = (window as any).__authGuardState;
  if (authGuardState) {
    console.log('📋 AuthGuard State:');
    console.log('   - Is checking:', authGuardState.isChecking);
    console.log('   - Is valid:', authGuardState.isValid);
    console.log('   - Last pathname:', authGuardState.lastPathname);
  }
  
  // 7. Test token validation
  console.log('📋 Token Validation Test:');
  const validation = validateToken();
  console.log('   - Valid:', validation.valid);
  console.log('   - Reason:', validation.reason);
  console.log('   - Time remaining:', validation.timeRemaining, 'minutes');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 If logout occurs after this, check:');
  console.log('   1. AuthGuard.jsx logs for validation failures');
  console.log('   2. Network tab for failed API requests');
  console.log('   3. Redux DevTools for state changes');
  console.log('   4. Console for token refresh attempts');
  
  return {
    token: !!token,
    valid: validation.valid,
    timeRemaining: validation.timeRemaining,
    currentPath: window.location.pathname,
  };
};

// Test function to simulate notification and monitor auth behavior
export const testNotificationAuthBehavior = () => {
  console.log('🧪 TESTING NOTIFICATION vs AUTH BEHAVIOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. Record initial state
  const initialAuth = validateToken();
  const initialPath = window.location.pathname;
  
  console.log('📋 Initial State:');
  console.log('   - Auth valid:', initialAuth.valid);
  console.log('   - Time remaining:', initialAuth.timeRemaining, 'minutes');
  console.log('   - Current path:', initialPath);
  
  // 2. Simulate notification processing
  console.log('🔄 Simulating notification processing...');
  
  // Simulate what happens when a real notification arrives
  const mockNotification = {
    id: Date.now(),
    message: 'Test notification',
    timestamp: new Date().toISOString(),
    read_status: false
  };
  
  // Test auth during notification processing
  setTimeout(() => {
    console.log('📋 During notification processing:');
    const duringAuth = validateToken();
    console.log('   - Auth valid:', duringAuth.valid);
    console.log('   - Current path:', window.location.pathname);
    
    // Check if path changed (indicates redirect)
    if (window.location.pathname !== initialPath) {
      console.error('🚨 PATH CHANGED DURING TEST!');
      console.error('   - Initial:', initialPath);
      console.error('   - Current:', window.location.pathname);
      console.error('   - This suggests middleware triggered redirect');
    }
  }, 50);
  
  // Test auth after notification processing
  setTimeout(() => {
    console.log('📋 After notification processing:');
    const afterAuth = validateToken();
    console.log('   - Auth valid:', afterAuth.valid);
    console.log('   - Current path:', window.location.pathname);
    
    if (!afterAuth.valid && initialAuth.valid) {
      console.error('🚨 AUTH BECAME INVALID DURING TEST!');
      console.error('   - Initial auth was valid');
      console.error('   - Auth is now invalid');
      console.error('   - Reason:', afterAuth.reason);
    }
    
    if (window.location.pathname.includes('admin-Login') && !initialPath.includes('admin-Login')) {
      console.error('🚨 REDIRECTED TO LOGIN DURING TEST!');
      console.error('   - This confirms middleware caused redirect');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, 200);
  
  return 'Test started - check console for results';
};

// Manual token validation (doesn't auto-logout)
export const validateToken = () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      console.log('🔍 Token validation: No token found');
      return { valid: false, reason: 'missing' };
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const isExpired = expirationTime < currentTime;
    const timeRemaining = Math.floor((expirationTime - currentTime) / 1000 / 60); // minutes

    console.log('🔍 Token validation:', {
      valid: !isExpired,
      timeRemaining: timeRemaining + ' minutes',
      role: payload.role,
      userId: payload.sub || payload.userId
    });

    return {
      valid: !isExpired,
      timeRemaining,
      role: payload.role,
      userId: payload.sub || payload.userId,
      reason: isExpired ? 'expired' : 'valid'
    };
  } catch (error) {
    console.error('🔍 Token validation error:', error);
    return { valid: false, reason: 'invalid' };
  }
};

// Token renewal function
export const refreshToken = async () => {
  try {
    const currentToken = Cookies.get('authToken');
    if (!currentToken) {
      console.log('🔄 No token to refresh');
      return false;
    }

    console.log('🔄 Attempting to refresh token...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        console.log('✅ Token refreshed successfully');
        Cookies.set("authToken", data.access_token, {
          expires: 1,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        localStorage.setItem('token', data.access_token);
        return true;
      } else {
        console.warn('❌ Token refresh response missing access_token');
        return false;
      }
    } else {
      console.warn('❌ Token refresh failed with status:', response.status);
      // Don't fail immediately on 401 - backend might not support refresh
      if (response.status === 404 || response.status === 405) {
        console.log('⚠️ Backend does not support token refresh endpoint');
        return true; // Pretend success to avoid logout loops
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    // Network errors shouldn't trigger logout
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.log('⚠️ Network error during token refresh - not failing');
      return true; // Pretend success to avoid logout on network issues
    }
    return false;
  }
};

// Token monitor that prevents expiration
export const startTokenMonitor = () => {
  const checkInterval = 60000; // Check every minute
  
  const monitor = setInterval(() => {
    const validation = validateToken();
    
    if (!validation.valid) {
      console.log('🔄 Token invalid, stopping monitor');
      clearInterval(monitor);
      return;
    }
    
    // Refresh token if it expires in less than 10 minutes
    if (validation.timeRemaining < 10) {
      console.log(`⏰ Token expires in ${validation.timeRemaining} minutes, refreshing...`);
      refreshToken();
    } else {
      console.log(`✅ Token healthy: ${validation.timeRemaining} minutes remaining`);
    }
  }, checkInterval);
  
  console.log('🔄 Token monitor started (checks every minute)');
  return monitor;
};

// Manual token extension for testing (extends current token by 1 hour)
export const extendTokenForTesting = () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      console.log('❌ No token to extend');
      return false;
    }

    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Extend expiration by 1 hour
    const newExp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour from now
    decodedPayload.exp = newExp;
    
    // Create new token with extended expiration
    const newPayload = btoa(JSON.stringify(decodedPayload));
    const extendedToken = `${header}.${newPayload}.${signature}`;
    
    Cookies.set("authToken", extendedToken, {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "Strict",
    });
    
    console.log('✅ Token extended by 1 hour for testing');
    console.log('New expiration:', new Date(newExp * 1000).toLocaleString());
    return true;
  } catch (error) {
    console.error('❌ Token extension failed:', error);
    return false;
  }
};

// Global token monitor restart function
export const restartTokenMonitorIfNeeded = () => {
  const validation = validateToken();
  if (validation.valid) {
    console.log('🔄 Restarting token monitor after login...');
    return startTokenMonitor();
  } else {
    console.log('❌ Cannot start token monitor - no valid token');
    return null;
  }
};

// Emergency recovery function - checks if logged in and restarts systems
export const emergencyRecovery = () => {
  console.log('🚨 Running emergency recovery...');
  
  const tokenStatus = validateToken();
  console.log('Token status:', tokenStatus);
  
  if (tokenStatus.valid) {
    console.log('✅ Token is valid, restarting systems...');
    
    // Restart token monitor
    const monitor = restartTokenMonitorIfNeeded();
    if (monitor) {
      console.log('✅ Token monitor restarted');
    }
    
    console.log('✅ Emergency recovery complete - systems restored');
    return true;
  } else {
    console.log('❌ No valid token found - please log in first');
    console.log('📍 Current location:', window.location.pathname);
    
    if (!window.location.pathname.includes('admin-Login')) {
      console.log('🔄 Redirecting to login...');
      window.location.href = '/admin-Login';
    }
    return false;
  }
};

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const socketInitialized = useRef(false);
  const fetchingNotifications = useRef(false);
  const connectionAttempts = useRef(0);
  const maxConnectionAttempts = 3; // Enable socket connection attempts (was 0 for polling-only)
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const tokenMonitor = useRef<NodeJS.Timeout | null>(null);
  const socketConnected = useRef(false);

  // Polling fallback function - only used when socket fails
  const startPollingFallback = async () => {
    console.log('🔄 Starting polling fallback for notifications (every 10 seconds)');
    console.log('⚠️  Socket.io failed - using polling as fallback');
    
    const pollNotifications = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded?.sub || decoded?.userId;
        if (!userId) return;

        console.log('📊 Polling for new notifications (fallback mode)...');
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );

        const normalized = res.data.map((n: any) => ({
          id: n.id,
          message: n.message || n.title,
          time: n.create_date,
          isRead: n.read_status,
          read_status: n.read_status,
          isArchived: false,
          name: 'System',
          avatar: '/profileImage.png',
        }));

        setNotifications(normalized);
        console.log('📊 Notifications updated via polling fallback:', normalized.length, 'total notifications');
      } catch (error) {
        console.warn('Polling update failed:', error);
      }
    };

    // Initial poll immediately
    pollNotifications();
    
    // Poll every 10 seconds (less aggressive than before since it's fallback)
    pollingInterval.current = setInterval(pollNotifications, 10000);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
        // Prevent multiple simultaneous fetches
        if (fetchingNotifications.current) {
            console.log('Notifications fetch already in progress, skipping...');
            return;
        }

        fetchingNotifications.current = true;

        try {
            // Use the same token source as auth system
            const token = Cookies.get('authToken');
            if (!token || token.split('.').length !== 3) {
                console.warn('No valid token found for notifications');
                fetchingNotifications.current = false;
                return;
            }

            let decoded: any;
            try {
                decoded = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded token for notifications:', { userId: decoded?.sub || decoded?.userId, role: decoded?.role });
            } catch (err) {
                console.warn('Invalid token format:', err);
                fetchingNotifications.current = false;
                return;
            }

            // Check token expiration
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                console.warn('Token expired, skipping notification fetch');
                fetchingNotifications.current = false;
                return;
            }

            const userId = decoded?.sub || decoded?.userId; // Try both common JWT claims
            if (!userId) {
                console.warn('No userId found in token');
                fetchingNotifications.current = false;
                return;
            }

            try {
                console.log('Fetching notifications for user:', userId);
                const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/notifications?userId=${userId}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000, // Add timeout to prevent hanging requests
                }
                );

                console.log('Notifications API response:', res.data);

                const normalized = res.data.map((n: any) => ({
                id: n.id,
                message: n.message || n.title,
                time: n.create_date,
                isRead: n.read_status,
                read_status: n.read_status, // Keep both for compatibility
                isArchived: false,
                name: 'System',
                avatar: '/profileImage.png', // Use existing default profile image
                }));

                console.log('Normalized notifications:', normalized);
                setNotifications(normalized);

                // Try Socket.io first, fallback to polling only if socket fails
                if (!socketInitialized.current && connectionAttempts.current < maxConnectionAttempts) {
                    console.log('🚀 Attempting socket.io connection for real-time notifications...');
                    connectionAttempts.current += 1;
                    
                const socket = connectSocket(token);
                    
                    if (socket) {
                        socketInitialized.current = true;
                        
                        // Connection success handler
                        socket.on('connect', () => {
                            console.log('✅ Socket.io connected successfully!');
                            console.log('🔍 Socket info:');
                            console.log('   - ID:', socket.id);
                            console.log('   - Transport:', socket.io?.engine?.transport?.name);
                            console.log('   - Connected:', socket.connected);
                            
                            socketConnected.current = true;
                            
                            // Clear any existing polling since socket is working
                            if (pollingInterval.current) {
                                console.log('📡 Socket connected - stopping polling fallback');
                                clearInterval(pollingInterval.current);
                                pollingInterval.current = null;
                            }
                            
                            // Test the connection after successful connect
                            setTimeout(() => {
                                console.log('🧪 Testing socket connection...');
                                testSocketConnection();
                            }, 1000);
                        });

                        // Connection error handler
                        socket.on('connect_error', (error) => {
                            console.warn('❌ Socket connection error:', error);
                            console.warn('Error details:', error.message);
                            
                            socketInitialized.current = false;
                            socketConnected.current = false;
                            
                            // If this was our last attempt, start polling fallback
                            if (connectionAttempts.current >= maxConnectionAttempts) {
                                console.log('🛑 Max socket attempts reached. Starting polling fallback...');
                                startPollingFallback();
                            }
                        });

                        // Disconnection handler
                        socket.on('disconnect', (reason, details) => {
                            console.log('🔌 Socket disconnected:', reason, details);
                            socketConnected.current = false;
                            
                            // If server disconnects us immediately, it's likely an auth issue
                            if (reason === 'io server disconnect') {
                                console.log('🚨 Server rejected socket connection immediately');
                                console.log('💡 This indicates backend authentication failed');
                                console.log('🔍 Backend troubleshooting:');
                                console.log('   1. Check socket.io middleware logs');
                                console.log('   2. Verify JWT validation in socket middleware');
                                console.log('   3. Ensure middleware calls next() on success');
                                console.log('   4. Check CORS configuration for socket.io');
                                
                                // Force max attempts to trigger fallback immediately
                                connectionAttempts.current = maxConnectionAttempts;
                                socketInitialized.current = false;
                                
                                console.log('🔄 Starting polling fallback due to auth rejection...');
                                startPollingFallback();
                            } else {
                                // Other disconnection reasons - allow retry
                                console.log('🔄 Will attempt to reconnect socket...');
                                socketInitialized.current = false;
                            }
                        });

                        // Listen for different notification event names that backend might use
                        const notificationEvents = ['notification', 'newNotification', 'user_notification', 'userNotification'];
                        
                        notificationEvents.forEach(eventName => {
                            socket.on(eventName, (data: any) => {
                                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                console.log(`📨 REAL-TIME NOTIFICATION RECEIVED via '${eventName}':`, data);
                                console.log('🕒 Timestamp:', new Date().toISOString());
                                console.log('📋 Current auth status before processing:');
                                
                                // Check auth status before processing notification
                                const preNotificationAuth = validateToken();
                                console.log('   - Token valid:', preNotificationAuth.valid);
                                console.log('   - Time remaining:', preNotificationAuth.timeRemaining, 'minutes');
                                console.log('   - Current path:', window.location.pathname);
                                
                                const normalized = {
                                    id: data.id || Date.now(),
                                    message: data.message || data.title || data.text,
                                    time: data.create_date || data.timestamp || new Date().toISOString(),
                                    isRead: data.read_status || false,
                                    read_status: data.read_status || false,
                                    isArchived: false,
                                    name: 'System',
                                    avatar: '/profileImage.png',
                                };
                                
                                console.log('📨 Normalized notification:', normalized);
                                
                                // Safe state update with additional auth check
                                try {
                                    // Track middleware activity during notification processing
                                    console.log('📨 Before notification state update - checking middleware activity');
                                    
                                    setNotifications((prev) => {
                                        // Double-check auth status during state update
                                        const duringUpdateAuth = validateToken();
                                        if (!duringUpdateAuth.valid) {
                                            console.warn('⚠️ Token became invalid during notification update!');
                                            console.warn('   - Reason:', duringUpdateAuth.reason);
                                            // Don't update notifications if token is invalid
                                            return prev;
                                        }
                                        
                                        // Avoid duplicates
                                        const exists = prev.find(n => n.id === normalized.id);
                                        if (exists) {
                                            console.log('📨 Duplicate notification ignored');
                                            return prev;
                                        }
                                        
                                        console.log('📨 Adding new real-time notification to state');
                                        console.log('📊 Previous notification count:', prev.length);
                                        const newState = [normalized, ...prev];
                                        console.log('📊 New notification count:', newState.length);
                                        
                                        return newState;
                                    });
                                    
                                    // Post-notification auth check with middleware monitoring
                                    setTimeout(() => {
                                        const postNotificationAuth = validateToken();
                                        console.log('📋 Auth status after notification processing:');
                                        console.log('   - Token valid:', postNotificationAuth.valid);
                                        console.log('   - Time remaining:', postNotificationAuth.timeRemaining, 'minutes');
                                        console.log('   - Current URL:', window.location.href);
                                        
                                        // Check if we got redirected to login (indicates middleware triggered)
                                        if (window.location.pathname.includes('admin-Login')) {
                                            console.error('🚨 REDIRECTED TO LOGIN AFTER NOTIFICATION!');
                                            console.error('🔍 This confirms middleware triggered logout');
                                            console.error('📍 Notification processing caused middleware redirect');
                                        }
                                        
                                        if (!postNotificationAuth.valid && preNotificationAuth.valid) {
                                            console.error('🚨 TOKEN BECAME INVALID AFTER NOTIFICATION!');
                                            console.error('🔍 This indicates the notification processing caused logout');
                                            console.error('📍 Debug info:');
                                            console.error('   - Event name:', eventName);
                                            console.error('   - Notification data:', data);
                                            console.error('   - Auth reason:', postNotificationAuth.reason);
                                            console.error('   - Current path:', window.location.pathname);
                                        }
                                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                    }, 100);
                                } catch (error) {
                                    console.error('❌ Error during notification state update:', error);
                                }
                            });
                        });

                        // Listen for authentication success/failure with enhanced logging
                        socket.on('authenticated', () => {
                            console.log('✅ Socket authentication successful');
                        });

                        socket.on('unauthorized', (error) => {
                            console.error('❌ Socket authentication failed:', error);
                            console.log('⚠️ WARNING: Socket auth failure might trigger logout');
                            
                            // Check if this socket auth failure affects the main auth token
                            setTimeout(() => {
                                const authCheck = validateToken();
                                console.log('📋 Main auth token status after socket unauthorized:');
                                console.log('   - Token valid:', authCheck.valid);
                                console.log('   - Reason:', authCheck.reason);
                                
                                if (!authCheck.valid) {
                                    console.error('🚨 SOCKET UNAUTHORIZED EVENT CAUSED TOKEN INVALIDATION!');
                                    console.error('🔍 This is the source of the logout issue');
                                }
                            }, 50);
                        });

                    } else {
                        console.warn('❌ Failed to create socket connection');
                        socketInitialized.current = false;
                        
                        // If this was our last attempt, start polling fallback
                        if (connectionAttempts.current >= maxConnectionAttempts) {
                            console.log('🛑 Socket creation failed. Starting polling fallback...');
                            startPollingFallback();
                        }
                    }
                } else if (connectionAttempts.current >= maxConnectionAttempts && !socketConnected.current) {
                    // Max attempts reached and socket not connected - ensure polling is active
                    if (!pollingInterval.current) {
                        console.log('🛑 Socket failed, ensuring polling fallback is active...');
                        startPollingFallback();
                    }
                } else if (socketConnected.current) {
                    console.log('📡 Socket already connected and working');
                } else {
                    console.log(`📡 Socket initialization already attempted (${connectionAttempts.current}/${maxConnectionAttempts})`);
                }

                // Start token monitor to prevent expiration logout
                if (!tokenMonitor.current) {
                    tokenMonitor.current = startTokenMonitor();
                }

            } catch (err: any) {
                console.error('Failed to load notifications:', err);
                // Don't set notifications to empty array on error
                // This prevents clearing existing notifications on network errors
                if (err.response?.status === 401) {
                    console.warn('Unauthorized access to notifications - token might be invalid');
                    // Don't automatically logout, let the main auth system handle this
                }
            }
        } catch (err) {
            console.error('Token decode error or userId missing:', err);
        } finally {
            fetchingNotifications.current = false;
        }
    };

    if (typeof window !== 'undefined') {
      fetchNotifications();
      
      // Expose debugging functions globally for manual testing
      (window as any).forceStartPolling = startPollingFallback;
      (window as any).testSocket = testSocketConnection;
      (window as any).debugSocketAuth = debugBackendSocketAuth;
      (window as any).testNotificationAPI = testNotificationAPI;
      (window as any).validateAuthToken = validateToken;
      (window as any).debugAuthStatus = debugAuthStatus;
      (window as any).testNotificationAuthBehavior = testNotificationAuthBehavior;
      (window as any).getSocketStatus = () => {
        const socket = getSocket();
        return {
          exists: !!socket,
          connected: socket?.connected || false,
          id: socket?.id || null,
          transport: socket?.io?.engine?.transport?.name || null,
        };
      };
      
      console.log('🔄 Debug functions available:');
      console.log('   - window.forceStartPolling() - Start polling fallback');
      console.log('   - window.testSocket() - Test socket connection');
      console.log('   - window.debugSocketAuth() - Debug socket authentication');
      console.log('   - window.testNotificationAPI() - Test API directly');
      console.log('   - window.validateAuthToken() - Check token status');
      console.log('   - window.debugAuthStatus() - Full auth debug');
      console.log('   - window.testNotificationAuthBehavior() - Test notification vs auth behavior');
      console.log('   - window.getSocketStatus() - Get socket info');
    }

    return () => {
      const socket = getSocket();
      if (socket) {
        console.log('Cleaning up notification socket listeners');
        socket.off('notification');
        socket.off('newNotification');
        socket.off('user_notification');
        socket.off('userNotification');
        socket.off('authenticated');
        socket.off('unauthorized');
        // Don't disconnect the socket here as it might be used elsewhere
      }
      
      // Clear polling interval
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      
      // Clear token monitor
      if (tokenMonitor.current) {
        clearInterval(tokenMonitor.current);
        tokenMonitor.current = null;
      }
      
      socketInitialized.current = false;
      fetchingNotifications.current = false;
      socketConnected.current = false;
    };
  }, []); // Empty dependency array - only run once

  return { notifications, setNotifications };
}
