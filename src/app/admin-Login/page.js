"use client"
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // Add new state for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Add handle input change function
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Add handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      console.log(data);
      // Handle successful login
      // Store token in localStorage or other state management solution
      localStorage.setItem('token', data.access_token);
      // Redirect to dashboard or home page
      window.location.href = '/admin/dashboard'; // Or use Next.js router
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>    
      <div className="flex flex-col w-full h-full bg-[#F5F5F5] text-white lg:overflow-hidden">
        {/* Navigation Bar */}
        <nav className="bg-white text-black px-6 py-4 z-40">
          <div className=" mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="text-xl font-bold">
              Logo
            </a>
            {/* Optional Links (if needed) */}
            {/* <div className="hidden md:flex space-x-4">
              <a href="#" className="hover:text-purple-600">
                Home
              </a>
              <a href="#" className="hover:text-purple-600">
                About
              </a>
              <a href="#" className="hover:text-purple-600">
                Contact
              </a>
            </div> */}
          </div>
        </nav>
        
        <div className="w-full h-full px-0 md:px-20 flex gap-10 justify-center items-center">
          {/* Left Section - Form */}
          <div className="md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#F5F5F5] text-black">
            <div className=" w-full 2xl:w-[40rem] 2xl:h-[30rem] bg-white p-8 rounded-lg">
              <h1 className="text-3xl font-bold mb-6 2xl:mt-5 text-center">Sign In</h1>
              
              {/* Add error message display */}
              {error && (
                <div className="mb-4 text-red-500 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4 2xl:mb-6">
                  <label
                    className="block text-sm font-medium mb-1 2xl:mb-3"
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-4 2xl:mb-8">
                  <label
                    className="block text-sm font-medium mb-1 2xl:mb-3"
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
                      className="w-full px-4 pr-10 lg:pr-0 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                      <Image
                        src={showPassword ? "/eye 1.svg" : "/eye 1.svg"}
                        alt={showPassword ? "Hide password" : "Show password"}
                        width={17}
                        height={17}
                        priority
                        className="max-w-full h-auto object-cover"
                      />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
                >
                  Sign In
                </button>
              </form>
              <p className="mt-4 2xl:mt-10 text-center">
                Don't have an Account?{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Signup
                </a>
              </p>
            </div>
          </div>
          {/* Right Section - Illustration */}
          <div className="hidden md:flex w-1/2 justify-center items-center bg-[#F5F5F5]">
            {/* <img
              src={login_sideimage}
              alt="Illustration"
              className="max-w-full h-auto"
            /> */}
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