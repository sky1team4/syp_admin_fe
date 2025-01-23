import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import stripeReducer from './features/stripeSlice';
import paypalReducer from './features/paypalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stripe: stripeReducer,
    paypal: paypalReducer,
  },
}); 