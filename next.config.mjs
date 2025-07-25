const nextConfig = {
  reactStrictMode: false, 
  // env: {
  //   NEXT_PUBLIC_API_URL: 'https://sypadminapi.azurewebsites.net', // Ensure it's correct
  // },
  images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sypadminapi.azurewebsites.net', // Hardcoded API hostname
        pathname: '/uploads/verifications/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/verifications/**',
      },
    ],
    domains: ['sypadminapi.azurewebsites.net', 'i.pravatar.cc', 'localhost'], // Added localhost domain
  },
};

export default nextConfig;
