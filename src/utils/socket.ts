import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let reconnectionAttempts = 0;
const maxReconnectionAttempts = 5;

export const connectSocket = (token: string) => {
  console.log('connectSocket called with token:', token ? 'Token exists' : 'No token');
  
  // If socket exists and is connected, return it
  if (socket && socket.connected) {
    console.log('Using existing connected socket');
    return socket;
  }

  // Disconnect existing socket if it exists but is not connected
  if (socket && !socket.connected) {
    console.log('Disconnecting existing unconnected socket');
    socket.disconnect();
    socket = null;
  }

  try {
    console.log('Creating new socket connection to:', process.env.NEXT_PUBLIC_API_URL);
    
    // Try multiple authentication strategies that backends commonly use
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      // Primary auth strategy: auth object
      auth: { 
        token: token,
        authorization: `Bearer ${token}`,
        authToken: token, // Some backends expect this key
      },
      // Secondary auth strategy: query parameters
      query: {
        token: token,
        authToken: token,
        authorization: `Bearer ${token}`,
      },
      // Tertiary auth strategy: headers
      extraHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-Auth-Token': token,
        'Access-Token': token,
      },
      // Connection settings
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      timeout: 20000,
      // Enable reconnection with exponential backoff
      reconnection: true,
      reconnectionAttempts: maxReconnectionAttempts,
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 10000, // Max 10 seconds between attempts
      randomizationFactor: 0.5, // Add randomization to prevent thundering herd
      forceNew: false,
      autoConnect: true,
      // Additional options for better compatibility
      upgrade: true,
      rememberUpgrade: true,
    });

    // Reset reconnection counter on successful connection
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully, ID:', socket?.id);
      console.log('Socket transport:', socket?.io?.engine?.transport?.name);
      reconnectionAttempts = 0; // Reset counter on successful connection
      
      // Send authentication confirmation if required by backend
      socket?.emit('authenticate', { token: token });
    });

    socket.on('connect_error', (error: any) => {
      console.error('❌ Socket connection error:', error);
      console.error('Error message:', error.message);
      console.error('Error description:', error.description);
      console.error('Error context:', error.context);
      console.error('Error type:', error.type);
      
      // Increment reconnection attempts
      reconnectionAttempts++;
      
      if (reconnectionAttempts >= maxReconnectionAttempts) {
        console.log('🛑 Max reconnection attempts reached. Socket will not retry further.');
      }
    });

    socket.on('disconnect', (reason, details) => {
      console.log('🔌 Socket disconnected:', reason);
      console.log('Disconnect details:', details);
      
      if (reason === 'io server disconnect') {
        console.log('🚨 Server forcibly disconnected the socket');
        console.log('💡 Common causes:');
        console.log('   - Authentication failed in socket middleware');
        console.log('   - Token validation failed on backend');
        console.log('   - Backend called socket.disconnect()');
        console.log('   - Socket.io middleware returned error');
        
        // Don't attempt reconnection for server-initiated disconnects
        // This usually indicates an authentication/authorization issue
        console.log('⚠️  Stopping reconnection attempts due to server disconnect');
        socket?.disconnect();
      } else if (reason === 'io client disconnect') {
        console.log('📱 Client initiated disconnect');
        // This is normal - don't attempt reconnection
      } else {
        console.log('🔄 Network or transport issue - will attempt reconnection');
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected successfully after', attemptNumber, 'attempts');
      reconnectionAttempts = 0; // Reset counter
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Socket reconnection attempt ${attemptNumber}/${maxReconnectionAttempts}`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔄❌ Socket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('🔄❌ Socket reconnection failed after all attempts');
      console.log('💡 Consider implementing polling fallback');
    });

    // Authentication-related event listeners
    socket.on('authenticated', () => {
      console.log('✅ Socket authentication confirmed by server');
    });

    socket.on('unauthorized', (error) => {
      console.error('❌ Socket authentication rejected by server:', error);
      console.log('💡 Backend socket middleware rejected the token');
      console.log('🔍 Check:');
      console.log('   - Token format and validity');
      console.log('   - Backend socket middleware implementation');
      console.log('   - CORS configuration');
    });

    socket.on('auth_error', (error) => {
      console.error('❌ Socket auth error:', error);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket general error:', error);
    });

    // Add a test event to verify two-way communication
    socket.on('test', (data) => {
      console.log('📨 Test message received from server:', data);
    });

    socket.on('pong', (latency) => {
      console.log('🏓 Pong received, latency:', latency, 'ms');
    });

    // Listen for common notification events with enhanced logging
    const notificationEvents = [
      'notification', 
      'newNotification', 
      'user_notification', 
      'userNotification',
      'admin_notification',
      'system_notification'
    ];

    notificationEvents.forEach(eventName => {
      socket?.on(eventName, (data) => {
        console.log(`📨 ${eventName} event received:`, data);
        console.log('🕒 Received at:', new Date().toISOString());
      });
    });

    // Add connection quality monitoring
    socket.on('ping', () => {
      console.log('🏓 Ping sent to server');
    });

    console.log('Socket instance created, attempting connection...');
    console.log('🔍 Connection config:');
    console.log('   - URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('   - Transport preference: websocket -> polling');
    console.log('   - Reconnection enabled:', true);
    console.log('   - Max reconnection attempts:', maxReconnectionAttempts);
    
    return socket;
  } catch (error) {
    console.error('❌ Error creating socket connection:', error);
    return null;
  }
};

export const getSocket = () => {
  console.log('getSocket called, socket exists:', !!socket, 'connected:', socket?.connected);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 Disconnecting socket manually');
    // Remove all listeners to prevent memory leaks
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    reconnectionAttempts = 0;
  } else {
    console.log('No socket to disconnect');
  }
};

// Test socket connection and communication
export const testSocketCommunication = () => {
  if (socket && socket.connected) {
    console.log('🧪 Testing socket communication...');
    
    // Test basic ping
    socket.emit('ping');
    
    // Test authentication status
    socket.emit('test', { 
      message: 'Test from admin frontend',
      timestamp: new Date().toISOString(),
      userId: 'test'
    });
    
    // Test notification request (if backend supports it)
    socket.emit('requestNotifications', { userId: 'current_user' });
    
    return true;
  } else {
    console.warn('❌ No active socket connection for testing');
    return false;
  }
};

// Get connection status
export const getSocketStatus = () => {
  if (!socket) {
    return { status: 'not_created', connected: false, id: null };
  }
  
  return {
    status: socket.connected ? 'connected' : 'disconnected',
    connected: socket.connected,
    id: socket.id,
    transport: socket.io?.engine?.transport?.name,
    reconnectionAttempts: reconnectionAttempts,
  };
};
