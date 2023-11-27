const path = require('path');

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

module.exports = nextConfig;


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "domo-we-best",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
