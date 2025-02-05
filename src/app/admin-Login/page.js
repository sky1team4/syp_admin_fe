"use client"
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error: reduxError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Add new state for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Update state to handle specific input errors
  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: ''
  });

  // Add handle input change function
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Update handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInputErrors({ email: '', password: '' });

    // Basic validation
    if (!formData.email) {
      toast.error('Enter your email address');
      return;
    }
    if (!formData.password) {
      toast.error('Enter your password');
      return;
    }

    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      console.log('Login response:', response); // Debug log

      if (response) {
        // Successful login
        console.log(response);
        router.push('/admin/dashboard');
      } else {
        setError('Login failed - please try again');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      if (err.message.includes('SSL_PROTOCOL_ERROR')) {
        toast.error('Connection error - please check the server is running and using the correct protocol');
      } else {
        toast.error(err?.message || 'An error occurred during login');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] text-white lg:overflow-hidden">
        {/* Navigation Bar */}
        <nav className="bg-white text-black px-6 py-4 z-40">
          <div className="mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="text-xl font-bold">
              Logo
            </a>
          </div>
        </nav>

        <div className="w-full h-full px-0 md:px-20 flex gap-10 justify-center items-center">
          {/* Left Section - Form */}
          <div className="flex flex-col justify-center items-center w-full h-full md:w-1/2 md:p-8 p-4 bg-[#F5F5F5] text-black">
            <div className="w-full max-w-md min-w-[20rem] 2xl:w-[40rem] 2xl:h-[30rem] bg-white md:p-8 p-2 rounded-lg md:h-[60%] h-[90%]">
              <h1 className="text-3xl font-bold mb-6 2xl:mt-5 md:mt-0 mt-36 text-center">Sign In</h1>

              <form onSubmit={handleSubmit} className="">
                <div className="mb-4 2xl:mb-6">
                  <label
                    className="block text-md font-medium mb-1 2xl:mb-3"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email"
                    className="w-full px-4 md:py-2 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base md:text-sm"
                  />
                  {/* Display specific error below email input */}
                  {inputErrors.email && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <span className="material-icons text-red-500 mr-1">error</span>
                      {inputErrors.email}
                    </div>
                  )}
                </div>
                <div className="mb-4 2xl:mb-8">
                  <label
                    className="block text-md font-medium mb-1 2xl:mb-3"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your Password"
                      className="w-full px-4 pr-10 lg:pr-0 md:py-2 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base md:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                      <Image
                        src={showPassword ? "/eye 1.svg" : "/eye.png"}
                        alt={showPassword ? "Hide password" : "Show password"}
                        width={20}
                        height={20}
                        priority
                        className="max-w-full h-auto object-cover"
                      />
                    </button>
                  </div>
                  {/* Display specific error below password input */}
                  {inputErrors.password && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <span className="material-icons text-red-500 mr-1">error</span>
                      {inputErrors.password}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 text-xl md:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none disabled:bg-purple-400"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
          {/* Right Section - Illustration */}
          <div className="hidden md:flex w-1/2 justify-center items-center bg-[#F5F5F5]">
            <Image
              src="/loginImage.svg"  // path from public folder
              alt="Illustration"
              width={650}  // required in Next.js
              height={650} // required in Next.js
              priority     // if this is above the fold
              className="max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}