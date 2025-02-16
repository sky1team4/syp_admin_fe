import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import stripeReducer from './features/stripeSlice';
import paypalReducer from './features/paypalSlice';
import bankReducer from './features/bankSlice';
import subscriptionReducer from './features/subscriptionSlice';
import verificationReducer from './features/verificationSlice';
import relationshipReducer from './features/relationshipSlice';
import fieldofstudyReducer from './features/fieldofstudySlice';
import subscription_verificationReducer from './features/subscription_verificationSlice';
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
    subscription_verification: subscription_verificationReducer,
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
  },
});