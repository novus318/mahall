/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains over HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all domains over HTTP
      },
    ],
  },
};

export default nextConfig;
