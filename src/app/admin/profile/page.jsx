'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updateUser, updateProfileImage } from '@/redux/features/authSlice'
import Cookies from 'js-cookie'

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      const updateData = {};
      if (profileData.email !== user.email) updateData.email = profileData.email;
      if (profileData.name !== user.name) updateData.name = profileData.name;

      if (Object.keys(updateData).length === 0) {
        toast.dismiss(loadingToast);
        toast.info('No changes to update');
        return;
      }

      const result = await dispatch(updateUser(updateData)).unwrap();
      
      // Update local state while preserving the profile picture
      setProfileData(prev => ({
        ...prev,
        ...updateData,
        picture: user.profilePicture
      }));
      
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully!', {
        description: `Updated: ${Object.keys(updateData).join(', ')}`
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading('Changing password...');
    
    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.dismiss(loadingToast);
        toast.error('New passwords do not match');
        return;
      }

      if (!passwordData.currentPassword || !passwordData.newPassword) {
        toast.dismiss(loadingToast);
        toast.error('Please fill in all password fields');
        return;
      }

      const updateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      const result = await dispatch(updateUser(updateData)).unwrap();
      
      // Clear password fields after successful update
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.dismiss(loadingToast);
      toast.success('Password changed successfully!', {
        description: 'Your password has been updated'
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to change password');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show loading toast
      const loadingToast = toast.loading('Uploading profile picture...');
      
      try {
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.dismiss(loadingToast);
          toast.error('File size too large. Maximum size is 5MB');
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.dismiss(loadingToast);
          toast.error('Please select an image file');
          return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload the image
        const result = await dispatch(updateProfileImage(file)).unwrap();
        console.log('Upload result:', result); // Debug log

        if (result.imageUrl) {
          // Update profile data with new image URL
          setProfileData(prev => ({
            ...prev,
            picture: result.imageUrl
          }));

          // Store in localStorage
          localStorage.setItem('userProfilePicture', result.imageUrl);

          toast.dismiss(loadingToast);
          toast.success('Profile picture updated successfully!');
        } else {
          throw new Error('No image URL received');
        }

      } catch (error) {
        console.error('Image upload error:', error);
        toast.dismiss(loadingToast);
        toast.error(error.message || 'Failed to update profile picture');
        
        // Revert to previous picture on error
        const storedProfilePicture = localStorage.getItem('userProfilePicture');
        setProfileData(prev => ({
          ...prev,
          picture: storedProfilePicture || user?.profilePicture || null
        }));
      }
    }
  };

  // In your render method, update the Image component
  const renderProfileImage = () => {
    const profilePicture = profileData.picture || user?.profilePicture || localStorage.getItem('userProfilePicture');
    console.log('Rendering profile image:', profilePicture); // Debug log

    if (profilePicture) {
      return (
        <Image 
          src={profilePicture}
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
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {renderProfileImage()}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-image-input"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-image-input"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
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
                    {user?.profilePicture && (
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
              <h2 className="text-2xl font-semibold text-gray-800">Reset Password</h2>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <button type="button" className="absolute right-3 top-10 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <button type="button" className="absolute right-3 top-10 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <button type="button" className="absolute right-3 top-10 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
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
