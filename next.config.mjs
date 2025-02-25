/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable Strict Mode
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Default value for production
    },
    images: {
      // remotePatterns: [
      //   {
      //     protocol: 'http',
      //     hostname: 'localhost',
      //     port: '8080',
      //     pathname: '/profile/**',
      //   },
      // ],
      domains: ['localhost', process.env.NEXT_PUBLIC_API_URL], // Allow localhost and the API URL
    },
  };
  
  export default nextConfig;
  