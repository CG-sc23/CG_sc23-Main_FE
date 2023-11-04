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
  swcMinify: true,
};

module.exports = nextConfig;
