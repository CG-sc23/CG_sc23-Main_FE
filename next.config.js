const path = require('path');
const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-markdown', '@uiw'],
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
      {
        protocol: 'https',
        hostname: 'domo-s3.s3.amazonaws.com',
        pathname: '/users/**',
      },
      {
        protocol: 'https',
        hostname: 'domo-s3.s3.amazonaws.com',
        pathname: '/resources/**',
      },
      {
        protocol: 'https',
        hostname: 'domo-s3.s3.ap-northeast-2.amazonaws.com',
        pathname: '/resources/**',
      },
      {
        protocol: 'https',
        hostname: 'img.shields.io',
        pathname: '/badge/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return [
      {
        source: '/s3',
        destination: 'https://domo-s3.s3.amazonaws.com',
      },
    ];
  },
  swcMinify: true,
};

module.exports = removeImports({
  ...nextConfig,
  webpack(config, options) {
    return config;
  },
});
