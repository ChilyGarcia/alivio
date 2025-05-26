/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Desarrollo local
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/storage/**',
      },
      {
        // Producción - Ajusta esto con tu dominio de producción
        protocol: 'https',
        hostname: 'api.alivio.com', // Reemplaza con tu dominio real de producción
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
