'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const ResetPasswordContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/users/reset-password', {
                token,
                newPassword
            });

            if (response.data.success) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/admin-Login');
                }, 3000);
            } else {
                setMessage(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute rotate-90 -top-1/2 -left-1/2 w-full h-full bg-purple-400 rounded-full animate-pulse-slow opacity-20 z-10"></div>
                <div className="absolute rotate-12 -bottom-1/2 -right-1/2 w-full h-full bg-purple-300 rounded-full animate-pulse-slow opacity-20"></div>
            </div>

            {!token ? (
                <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl relative z-50 border border-white/20">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                            Invalid Reset Link
                        </h2>
                        <div className="mt-4 text-center text-red-600 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-100">
                            Missing reset token. Please request a new password reset link.
                        </div>
                        <div className="mt-6">
                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Request a new reset link
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl relative z-50 border border-white/20">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                            Reset Your Password
                        </h2>
                        <p className="mt-2 text-gray-600">Enter your new password below</p>
                    </div>
                    {message && (
                        <div className={`text-center p-4 rounded-xl ${message.includes('successful')
                            ? 'bg-green-50/80 text-green-600 border border-green-100'
                            : 'bg-red-50/80 text-red-600 border border-red-100'
                            } backdrop-blur-sm`}>
                            {message}
                        </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                    placeholder="Enter your new password"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                    placeholder="Confirm your new password"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${isLoading
                                    ? 'bg-purple-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const ResetPassword = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword;
