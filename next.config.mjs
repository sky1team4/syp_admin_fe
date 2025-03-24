const nextConfig = {
  reactStrictMode: false, 
  env: {
    NEXT_PUBLIC_API_URL: 'https://sypadminapi.azurewebsites.net', // Ensure it's correct
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sypadminapi.azurewebsites.net', // Hardcoded API hostname
        pathname: '/uploads/verifications/**',
      },
    ],
    domains: ['sypadminapi.azurewebsites.net'], // Static domain required
  },
};

export default nextConfig;
