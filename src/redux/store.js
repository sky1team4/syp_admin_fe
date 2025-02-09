import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import stripeReducer from './features/stripeSlice';
import paypalReducer from './features/paypalSlice';
import bankReducer from './features/bankSlice';
import subscriptionReducer from './features/subscriptionSlice';
import verificationReducer from './features/verificationSlice';
import relationshipReducer from './features/relationshipSlice';
import fieldofstudyReducer from './features/fieldofstudySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stripe: stripeReducer,
    paypal: paypalReducer,
    bank: bankReducer,
    subscription: subscriptionReducer,
    verification: verificationReducer,
    relationship: relationshipReducer,
    fieldofstudy: fieldofstudyReducer,
  },
}); 