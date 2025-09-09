# 🚀 Reward System API Setup Guide

## 📋 Prerequisites
- ✅ Backend API is running and accessible
- ✅ Authentication token is available in localStorage
- ✅ CORS is properly configured on backend

## 🔧 Configuration Steps

### 1. Set API URL
Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Replace with your actual backend URL:**
- Development: `http://localhost:3001`
- Staging: `https://api-staging.yourdomain.com`
- Production: `https://api-production.yourdomain.com`

### 2. Verify Backend Endpoints
Ensure your backend has these endpoints:

```
GET    /api/reward-system/steps
POST   /api/reward-system/steps
PUT    /api/reward-system/steps/:id
DELETE /api/reward-system/steps/:id
GET    /api/reward-system/conversion-rate
PUT    /api/reward-system/conversion-rate
```

### 3. Authentication Setup
Make sure your authentication token is stored in localStorage:

```javascript
// After login, store token
localStorage.setItem('token', 'your-jwt-token-here');
```

### 4. CORS Configuration
Your backend should allow requests from your frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

## 🧪 Testing the Connection

### 1. Start Your Backend
```bash
# Start your backend server
npm run start:dev
# or
yarn start:dev
```

### 2. Start Your Frontend
```bash
# Start your frontend
npm run dev
# or
yarn dev
```

### 3. Test the Connection
1. Navigate to `/admin/rewardSystem`
2. Check browser console for any errors
3. Verify data loads from backend
4. Test creating/updating/deleting steps

## 🔍 Troubleshooting

### Common Issues:

#### 1. CORS Error
```
Access to fetch at 'http://localhost:8080/api/reward-system/steps' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:** Configure CORS on your backend to allow your frontend domain.

#### 2. 401 Unauthorized
```
HTTP error! status: 401
```
**Solution:** Check if authentication token is properly set in localStorage.

#### 3. 404 Not Found
```
HTTP error! status: 404
```
**Solution:** Verify API endpoints match exactly and backend is running.

#### 4. Network Error
```
Network error: Unable to connect to server
```
**Solution:** Check if backend URL is correct and server is running.

### Debug Steps:
1. **Check API URL**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. **Check Backend**: Ensure backend is running and accessible
3. **Check Network**: Open browser DevTools → Network tab
4. **Check Console**: Look for error messages in browser console
5. **Test API**: Use Postman/curl to test endpoints directly

## 📞 Support
If you encounter issues:
1. Check browser console for error messages
2. Verify backend logs for any errors
3. Test API endpoints directly with Postman
4. Ensure all environment variables are set correctly

## ✅ Success Indicators
- ✅ Reward steps load from backend
- ✅ Creating new steps works
- ✅ Updating steps triggers redistribution
- ✅ Coin conversion rate loads and updates
- ✅ No console errors
- ✅ Network requests show 200 status codes
