/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  reactCompiler: true,
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