import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import stripeReducer from './features/stripeSlice';
import paypalReducer from './features/paypalSlice';
import bankReducer from './features/bankSlice';
import subscriptionReducer from './features/subscriptionSlice';
import subscriptionTypesReducer from './features/subscriptionTypesSlice';
import modulesReducer from './features/modulesSlice';
import verificationReducer from './features/verificationSlice';
import relationshipReducer from './features/relationshipSlice';
import fieldofstudyReducer from './features/fieldofstudySlice';
import badgeVerificationSlice from './features/badgeVerificationSlice';
import degreeReducer from './features/degreeSlice';
import specialtyReducer from './features/specialitySlice';
import interestReducer from './features/interestSlice';
import skillReducer from './features/skillSlice';
import employeeReducer from './features/employeeSlice';
import jobTitleReducer from './features/jobTitleSlice';
import companyReducer from './features/companyNameSlice';
import subSkillReducer from './features/subSkillSlice';
import rssFeedReducer from './features/rssFeedSlice';
import faqCategoryReducer from './features/faqCateSlice';
import userReducer from './features/userSlice';
import faqQaReducer from './features/faqQaSlice';
import subscribedUserReducer from './features/subscribedUserSlice';
import rewardSystemReducer from './features/rewardSystemSlice';
// nothing to commit
export const store = configureStore({

  reducer: {
    auth: authReducer,
    stripe: stripeReducer,
    paypal: paypalReducer,
    bank: bankReducer,
    subscription: subscriptionReducer,
    subscriptionTypes: subscriptionTypesReducer,
    modules: modulesReducer,
    verification: verificationReducer,
    relationship: relationshipReducer,
    fieldofstudy: fieldofstudyReducer,
    badgeVerificationList: badgeVerificationSlice,
    degree: degreeReducer,
    specialty: specialtyReducer,
    interest: interestReducer,
    skill: skillReducer,
    employee: employeeReducer,
    jobTitle: jobTitleReducer,
    companyName: companyReducer,
    subSkill: subSkillReducer,
    rssFeed: rssFeedReducer,
    faqCategory: faqCategoryReducer,
    users: userReducer,
    faqQa: faqQaReducer,
    subscribedUser: subscribedUserReducer,
    rewardSystem: rewardSystemReducer,
  },
});

// Make store globally accessible for token refresh
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}