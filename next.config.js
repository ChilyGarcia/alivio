/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.aliviapp.com.co',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
