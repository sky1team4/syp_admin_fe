'use client'
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post(process.env.NEXT_PUBLIC_API_URL + '/users/forgot-password', {
        email: email
      });

      // Set success message
      setMessage(response.data.message);
      // Set link sent state to true
      setIsLinkSent(true);
      // Clear email field on success if it was successful
      if (response.data.success) {
        setEmail('');
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      // Handle errors
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
      setIsLinkSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rotate-90 -top-1/2 -left-1/2 w-full h-full bg-purple-400 rounded-full animate-pulse-slow opacity-20 z-10"></div>
        <div className="absolute rotate-12 -bottom-1/2 -right-1/2 w-full h-full bg-purple-300 rounded-full animate-pulse-slow opacity-20"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl relative z-50 border border-white/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {isLinkSent ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLinkSent
              ? 'We have sent a password reset link to your email address. Please check your inbox.'
              : 'Enter your email address to reset your password'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 backdrop-blur-sm ${isLinkSent
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                }`}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isLinkSent}
            />
          </div>

          {message && (
            <div
              className={`text-center p-4 rounded-xl backdrop-blur-sm border ${message.toLowerCase().includes('sent')
                ? 'bg-green-50/80 text-green-600 border-green-100'
                : 'bg-red-50/80 text-red-600 border-red-100'
                }`}
            >
              {message}
            </div>
          )}

          {!isLinkSent && (
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${isLoading
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/admin-Login"
              className="text-purple-600 bg-purple-100 hover:bg-purple-200 p-2 rounded-lg hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;