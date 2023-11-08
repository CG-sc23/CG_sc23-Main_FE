const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    emotion: {
      sourceMap: true,
      autoLabel: 'dev-only',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'domo-s3.s3.ap-northeast-2.amazonaws.com',
        pathname: '/users/**',
      },
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
