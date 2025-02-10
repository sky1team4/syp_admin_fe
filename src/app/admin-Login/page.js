"use client";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/authSlice";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error: reduxError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInputErrors({ email: "", password: "" });

    if (!formData.email) {
      toast.error("Enter your email address");
      return;
    }
    if (!formData.password) {
      toast.error("Enter your password");
      return;
    }

    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      console.log("Login response:", response);

      if (response) {
        console.log(response);
        router.push("/admin/dashboard");
      } else {
        setError("Login failed - please try again");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.message.includes("SSL_PROTOCOL_ERROR")) {
        toast.error("Connection error - please check the server is running and using the correct protocol");
      } else {
        toast.error(err?.message || "An error occurred during login");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] text-white lg:overflow-hidden">
        <nav className="bg-white text-black px-6 py-4 z-40">
          <div className="mx-auto flex items-center justify-between">
            <a href="#" className="text-xl font-bold">SYP</a>
          </div>
        </nav>

        <div className="w-full h-full px-0 md:px-20 flex gap-10 justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full h-full md:w-1/2 p-8 bg-[#F5F5F5] text-black">
            <div className="w-[22rem] sm:w-[30rem] py-8 px-6 scale-100 bg-white rounded-lg transition-all duration-300 ease-in-out">
              <h1 className="text-3xl font-bold text-center">Sign In</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 sm:mb-6">
                  <label className="block text-md font-medium mb-3" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  />
                </div>
                <div className="mb-3 sm:mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-md font-medium mb-3" htmlFor="password">Password</label>
                    <a href="#" className="text-sm text-purple-600 hover:underline">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your Password"
                      className="w-full px-4 pr-10 lg:pr-0 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
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
                  <label className="flex items-center text-sm mt-5 mb-5">
                    <input type="checkbox" id="rememberMe" className="mr-2" />
                    Remember Me
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 text-xl bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none disabled:bg-purple-400"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
          <div className="hidden lg:flex w-1/2 2xl:scale-125 justify-center items-center bg-[#F5F5F5]">
            <Image
              src="/loginImage.svg"
              alt="Illustration"
              width={650}
              height={650}
              priority
              className="max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
