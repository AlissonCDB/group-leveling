/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    qualities: [75, 90],
  }
};

export default nextConfig;
