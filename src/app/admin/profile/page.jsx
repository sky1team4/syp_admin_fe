'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { updateUser, updateProfileImage, verifyPassword, resetPassword } from '@/redux/features/authSlice'
import Cookies from 'js-cookie'

// Get base URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Initialize state with empty values
  const [profileData, setProfileData] = useState({
    email: '',
    name: '',
    picture: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add state for image preview URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Add these state variables at the top with your other state declarations
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Add a new state for temporary file storage
  const [selectedImage, setSelectedImage] = useState(null);

  // Update profile data when user info changes
  useEffect(() => {
    if (mounted && user) {
      console.log('Setting profile data from user:', user); // Debug log
      const profilePicture = user.profilePicture || localStorage.getItem('userProfilePicture');

      setProfileData({
        email: user.email || '',
        name: user.name || '',
        picture: profilePicture
      });
    }
  }, [user, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clean up object URL when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Add this to handle unauthorized access
  useEffect(() => {
    if (mounted && !user) {
      const token = Cookies.get('authToken');
      if (!token) {
        window.location.href = '/admin-Login';
      }
    }
  }, [user, mounted]);

  // // Add validation for password
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const promise = toast.promise(
      (async () => {
        try {
          const updateData = {};
          if (profileData.email !== user.email) updateData.email = profileData.email;
          if (profileData.name !== user.name) updateData.name = profileData.name;

          // Check if there are any changes including image
          if (Object.keys(updateData).length === 0 && !selectedImage) {
            throw new Error('No changes to update');
          }

          // First upload image if there is one
          if (selectedImage) {
            const imageResult = await dispatch(updateProfileImage(selectedImage)).unwrap();
            if (!imageResult.imageUrl) {
              throw new Error('Failed to upload profile picture');
            }
            // Store the complete URL with BASE_URL
            updateData.profilePicture = imageResult.imageUrl.startsWith('http')
              ? imageResult.imageUrl
              : `${BASE_URL}${imageResult.imageUrl}`;
          }

          // Then update other profile data if any
          if (Object.keys(updateData).length > 0) {
            const result = await dispatch(updateUser(updateData)).unwrap();
          }

          // Update local state with complete URL
          setProfileData(prev => ({
            ...prev,
            ...updateData,
            picture: updateData.profilePicture || prev.picture
          }));

          // Clear the selected image
          setSelectedImage(null);

          // Store the complete URL in localStorage
          if (updateData.profilePicture) {
            localStorage.setItem('userProfilePicture', updateData.profilePicture);
          }

          return `Updated: ${Object.keys(updateData).join(', ')}`;
        } catch (error) {
          throw new Error(error.message || 'Failed to update profile');
        }
      })(),
      {
        loading: 'Updating profile...',
        success: (message) => message,
        error: (err) => err.message || 'Failed to update profile'
      }
    );
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const promise = toast.promise(
      (async () => {
        try {
          // First check if current password is provided
          if (!passwordData.currentPassword) {
            throw new Error('Please enter your current password');
          }

          // Step 1: Verify current password
          const verifyPasswordResult = await dispatch(verifyPassword(
            passwordData.currentPassword
          )).unwrap();

          if (!verifyPasswordResult.success) {
            throw new Error('Current password is incorrect');
          }

          // Step 2: Only after verification, check and update new password
          if (!passwordData.newPassword || !passwordData.confirmPassword) {
            throw new Error('Please fill in new password fields');
          }

          if (passwordData.newPassword !== passwordData.confirmPassword) {
            throw new Error('New passwords do not match');
          }

          const passwordError = validatePassword(passwordData.newPassword);
          if (passwordError) {
            throw new Error(passwordError);
          }

          // Use reset password endpoint instead
          const resetResult = await dispatch(resetPassword({
            
            newPassword: passwordData.newPassword
          })).unwrap();

          // Clear form after successful update
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });

          return 'Password changed successfully!';
        } catch (error) {
          throw new Error(error.message || 'Failed to change password');
        }
      })(),
      {
        loading: 'Validating current password...',
        success: (message) => message,
        error: (err) => err.message
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Maximum size is 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Store the file and create preview URL
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  // Add this function to handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Update the renderProfileImage function to show preview
  const renderProfileImage = () => {
    if (imagePreviewUrl) {
      return (
        <Image
          src={imagePreviewUrl}
          alt="Profile Preview"
          width={80}
          height={80}
          className="rounded-full object-cover w-full h-full"
          unoptimized={true}
        />
      );
    }

    const profilePicture = profileData.picture || user?.profilePicture || localStorage.getItem('userProfilePicture');

    if (profilePicture) {
      // Always ensure we have a complete URL
      const imageUrl = profilePicture.startsWith('http')
        ? profilePicture
        : `${BASE_URL}${profilePicture}`;

      return (
        <Image
          src={imageUrl}
          alt={user?.name || 'Profile'}
          width={80}
          height={80}
          className="rounded-full object-cover w-full h-full"
          unoptimized={true}
        />
      );
    }

    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  // Don't render until client-side hydration is complete
  if (!mounted) return null;

  return (
    <div className="p-6 min-h-screen">
      {user ? (
        <>
          <div className="mb-8 bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
                  <div className="flex justify-center w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {renderProfileImage()}
                    </div>
                  </div>
                  <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-image-input"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-image-input"
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Choose new photo
                    </label>
                    {selectedImage && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected: {selectedImage.name}
                      </p>
                    )}
                    {user?.profilePicture && !selectedImage && (
                      <p className="mt-2 text-sm text-gray-500">
                        Current: {user.profilePicture.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center disabled:bg-purple-400"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Reset Section */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type={showPasswords.currentPassword ? "text" : "password"}
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.currentPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.newPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.confirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200 mt-8 flex items-center disabled:bg-purple-400"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
          </div>
        </div>
      )}
    </div>
  );
}