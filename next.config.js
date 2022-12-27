/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "static-cdn.jtvnw.net",
      "uieskineapnmdqwofpjx.supabase.co",
    ],
  },
};

module.exports = nextConfig;
