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
        hostname: 'sypadminapi.azurewebsites.net',
        pathname: '/uploads/verifications/**', // Ensure proper path matching
      },
    ],
    domains: ['localhost', 'sypadminapi.azurewebsites.net'], // Allow API hostname
  },
};

export default nextConfig;
