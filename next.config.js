/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // RTL Support
  i18n: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.yourdomain.com', // Your Cloudflare CDN
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-004.backblazeb2.com',
      },
    ],
  },

  // Server Actions are enabled by default in Next.js 14
}

module.exports = nextConfig
