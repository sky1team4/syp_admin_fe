/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable Strict Mode
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
      domains: ['localhost'], // Allow images from localhost
    },
  };
  
  export default nextConfig;
  