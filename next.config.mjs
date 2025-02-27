/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Default value for production
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_URL,
        pathname: '/uploads/verifications/**', // Ensure proper path matching
      },
    ],
    domains: ['localhost', process.env.NEXT_PUBLIC_API_URL], // Allow API hostname
  },
};

export default nextConfig;
