/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable Strict Mode
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
  