/** @type {import('next').NextConfig} */
const nextConfig = {
  // Encaminha /api/* para o backend (Fastify), evitando configurar CORS
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:3333"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
