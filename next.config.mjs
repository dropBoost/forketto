/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  reactCompiler: true,
  images: {
    qualities: [100, 70, 75],
  },
  async rewrites() {
    return [
      {
        source: "/:alias",
        destination: "/horeca/:alias",
      },
    ];
  },
};

export default nextConfig;