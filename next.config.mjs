/** @type {import("next").NextConfig} */
const nextConfig = {
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