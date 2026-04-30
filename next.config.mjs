/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  compiler: {
    styledComponents: true,
  }
};

export default nextConfig;
